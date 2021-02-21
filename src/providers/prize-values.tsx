/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useEffect, useContext, useState } from 'react';
import { usePoolData } from './pools';
import { usePoolChainData } from './pools-chain';
import { usePoolsERC20Balance } from './pools-erc-balance';
import { useExchange } from './exchange';
import { useNetworkProvider } from './ethers';
import { calculateEstimatedPoolPrize } from '../utils/calculateEstimatedPrizePool';
import { ethers, BigNumber } from 'ethers';
import { normalizeTo18Decimals } from '../utils/normalizeTo18Decimals';
import { derivedEthToEthAlreadyNormalized, EthToUsd, derivedEthToEth } from '../utils/conversions';

const EthersContext = createContext<undefined>(undefined);

export const PrizeProvider: React.FC = ({ children }) => {
  const {
    ethToUsd,
    tokenExchange: { initialized, exchangeDict },
  } = useExchange();
  const pools = usePoolData();
  const poolsChainData = usePoolChainData();
  const poolsErc20Balance = usePoolsERC20Balance();
  const provider = useNetworkProvider();
  useEffect(() => {
    (async () => {
      if (!provider) return;
      // const chainId = (await provider.getNetwork()).chainId;
      console.log('HEHEHEHEHEHEH');
      console.log(poolsErc20Balance.length !== pools.length);
      console.log(!initialized);
      if (poolsErc20Balance.length !== pools.length || !initialized) return;
      console.log(exchangeDict);
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
          poolPrizeEth = poolPrizeEth.add(
            derivedEthToEth(balance.balance, exchangeDict[balance.id].decimals, exchangeDict[balance.id].derivedEth),
          );
        }
        console.log('///////');

        console.log(ethers.utils.formatUnits(EthToUsd(poolPrizeEth, ethToUsd), 18));
      }
    })();
  }, [pools, poolsChainData, poolsErc20Balance, provider, exchangeDict, initialized, ethToUsd]);
  return <EthersContext.Provider value={undefined}>{children}</EthersContext.Provider>;
};
