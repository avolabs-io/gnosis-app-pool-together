/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useEffect, useContext, useState } from 'react';
import { usePoolData } from './pools';
import { usePoolChainData } from './pools-chain';
import { usePoolsERC20Balance } from './pools-erc-balance';
import { useExchange } from './exchange';
import { useNetworkProvider } from './ethers';
import { calculateEstimatedPoolPrize } from '../utils/calculateEstimatedPrizePool';
import { ethers, BigNumber } from 'ethers';
import { derivedEthToEthAlreadyNormalized, EthToUsd, derivedEthToEth } from '../utils/conversions';

const PrizeValContext = createContext<string[]>([]);

export const PrizeProvider: React.FC = ({ children }) => {
  const {
    ethToUsd,
    tokenExchange: { initialized, exchangeDict },
  } = useExchange();
  const pools = usePoolData();
  const poolsChainData = usePoolChainData();
  const poolsErc20Balance = usePoolsERC20Balance();
  const provider = useNetworkProvider();
  const [prizes, setPrizes] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      if (!provider) return;
      // const chainId = (await provider.getNetwork()).chainId;
      if (poolsErc20Balance.length !== pools.length || !initialized) return;
      const prizeVals = [];
      for (let i = 0; i < pools.length; i++) {
        console.log(pools[i].underlyingCollateralSymbol);
        let poolPrizeEth = derivedEthToEthAlreadyNormalized(
          calculateEstimatedPoolPrize({
            tokenDecimals: parseInt(pools[i].ticketDecimals, 10),
            awardBalance: poolsChainData[i].awardBalance,
            supplyRatePerBlock: poolsChainData[i].supplyRatePerBlock,
            prizePeriodRemainingSeconds: poolsChainData[i].secondsRemaining,
            poolTotalSupply: BigNumber.from(pools[i].ticketSupply).add(BigNumber.from(pools[i].sponsorshipSupply)),
          }),
          exchangeDict[pools[i].underlyingCollateralContract.address.toLowerCase()].derivedEth,
        );
        for (const balance of poolsErc20Balance[i]) {
          console.log(balance.symbol);
          console.log(balance);
          const newEth = derivedEthToEth(
            balance.balance,
            exchangeDict[balance.id].decimals,
            exchangeDict[balance.id].derivedEth,
          );
          console.log(ethers.utils.formatEther(newEth));
          poolPrizeEth = poolPrizeEth.add(newEth);
        }
        prizeVals.push(truncate(ethers.utils.formatUnits(EthToUsd(poolPrizeEth, ethToUsd), 18)));
      }
      setPrizes(prizeVals);
    })();
  }, [pools, poolsChainData, poolsErc20Balance, provider, exchangeDict, initialized, ethToUsd]);
  return <PrizeValContext.Provider value={prizes}>{children}</PrizeValContext.Provider>;
};

export const usePrizeValues = (): string[] => {
  const context = useContext(PrizeValContext);
  return context;
};

const truncate = (str: string): string => {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0];
  }
  return str;
};
