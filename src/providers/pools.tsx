import React, { createContext, useContext, useEffect, useState } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useNetworkProvider } from './ethers';
import { contractAddresses } from '@pooltogether/current-pool-data';
import { GetPoolsById, PoolGraphData } from '../ptGraphClient';
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool';
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners';
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner';
import ERC20Abi from '../abis/erc20';
import { ethers } from 'ethers';

const PoolsContext = createContext<PoolData[]>([]);

type PoolData = {
  underlyingCollateralSymbol: string;
  underlyingCollateralToken: string;
  underlyingCollateralDecimals: string;
  ticketDecimals: string;
  sponsorshipDecimals: string;
  prizePoolType: string;
  id: string;
  contract: ethers.Contract;
  underlyingCollateralContract: ethers.Contract;
  prizeStrategyContract: ethers.Contract;
  cTokenAddress: undefined | string;
  ticketContract: ethers.Contract;
  sponsorshipContract: ethers.Contract;
  poolGraphData: PoolGraphData;
  ticketAddress: string;
  ticketSupply: string;
  sponsorshipSupply: string;
};

export const PoolsProvider: React.FC = ({ children }) => {
  const provider = useNetworkProvider();
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);

  useEffect(() => {
    (async () => {
      const network = await provider.getNetwork();
      const addresses = contractAddresses[network.chainId.toString()];
      console.log(network.chainId.toString());

      console.log('Object.keys(addresses)');
      console.log(Object.keys(addresses));

      const poolAddresses = Object.keys(addresses)
        .filter((x) => !!addresses[x].prizePool)
        .map((x) => addresses[x].prizePool.toLowerCase());
      const queryResult = await GetPoolsById(poolAddresses);
      const queryArr: PoolGraphData[] = queryResult.prizePools;
      console.log(queryResult);

      const p = queryArr.map((result) => {
        const {
          prizeStrategy,
          ticket,
          sponsorship,
          ticketAddress,
          ticketDecimals,
          sponsorshipDecimals,
          ticketSupply,
          sponsorshipSupply,
        } = getPrizeStrategyAndTokenContracts(result, provider);

        return {
          id: result.id,
          prizePoolType: result.prizePoolType,
          underlyingCollateralSymbol: result.underlyingCollateralSymbol,
          underlyingCollateralToken: result.underlyingCollateralToken,
          underlyingCollateralDecimals: result.underlyingCollateralDecimals,
          contract: new ethers.Contract(result.id, PrizePoolAbi, provider),
          underlyingCollateralContract: new ethers.Contract(result.underlyingCollateralToken, ERC20Abi, provider),
          prizeStrategyContract: prizeStrategy,
          cTokenAddress: result?.compoundPrizePool?.cToken,
          sponsorshipContract: sponsorship,
          ticketContract: ticket,
          poolGraphData: result,
          ticketAddress: ticketAddress,
          ticketDecimals,
          sponsorshipDecimals,
          ticketSupply,
          sponsorshipSupply
        };
      });

      setPoolsData(p);
    })();
  }, [provider]);

  return <PoolsContext.Provider value={poolsData}>{children}</PoolsContext.Provider>;
};

const getPrizeStrategyAndTokenContracts = (result: PoolGraphData, provider: SafeAppsSdkProvider) => {
  if (!!result.prizeStrategy.multipleWinners) {
    return getStrategyVals(result.prizeStrategy.multipleWinners, provider, true);
  } else if (!!result.prizeStrategy.singleRandomWinner) {
    return getStrategyVals(result.prizeStrategy.singleRandomWinner, provider, true);

  }
  throw new Error('No strategy for prize Pool!');
};

type StrategyData = {
  id: string;
  ticket: {
    id: string;
    totalSupply: string;
    decimals: string;
  };
  sponsorship: {
    id: string;
    totalSupply: string;
    decimals: string;
  };
}

const getStrategyVals = ({
  id: strategyAddress,
  ticket: {
    id: ticketAddress,
    totalSupply: ticketSupply,
    decimals: ticketDecimals
  },
  sponsorship: {
    id: sponsorshipAddress,
    totalSupply: sponsorshipSupply,
    decimals: sponsorshipDecimals,
}} : StrategyData, provider: SafeAppsSdkProvider,isMultiple: boolean) => ({
  prizeStrategy: new ethers.Contract(
    strategyAddress,
    isMultiple ? MultipleWinnersPrizeStrategyAbi : SingleRandomWinnerPrizeStrategyAbi,
    provider,
  ),
  ticket: new ethers.Contract(
    ticketAddress,
    ERC20Abi,
    provider
  ),
  ticketAddress,
  ticketSupply,
  sponsorshipSupply,
  sponsorship: new ethers.Contract(
    sponsorshipAddress,
    ERC20Abi,
    provider,
  ),
  ticketDecimals,
  sponsorshipDecimals,
});

export const usePoolData = (): PoolData[] => {
  const context = useContext(PoolsContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
