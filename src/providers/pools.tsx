import React, { createContext, useContext, useEffect, useState } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useNetworkProvider } from './ethers';
import { contractAddresses } from '@pooltogether/current-pool-data';
import { GetPoolsById, PoolGraphData } from '../ptGraphClient';
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool';
import ERC20Abi from '../abis/erc20';
import { ethers } from 'ethers';

const PoolsContext = createContext<PoolData[]>([]);

export type erc20Source = {
  id: string;
  decimals: string;
  symbol: string;
};

type erc721Source = {
  tokenIds: string[];
};

export type PoolData = {
  underlyingCollateralSymbol: string;
  underlyingCollateralToken: string;
  underlyingCollateralDecimals: string;
  ticketDecimals: string;
  sponsorshipDecimals: string;
  prizePoolType: string;
  id: string;
  contract: ethers.Contract;
  underlyingCollateralContract: ethers.Contract;
  prizeStrategyAddress: string;
  cTokenAddress: undefined | string;
  ticketContract: ethers.Contract;
  poolGraphData: PoolGraphData;
  ticketAddress: string;
  ticketSupply: string;
  sponsorshipSupply: string;
  isMultiple: boolean;
  externalErc721Awards: erc721Source[];
  externalErc20Awards: erc20Source[];
};

export const PoolsProvider: React.FC = ({ children }) => {
  const provider = useNetworkProvider();
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);

  useEffect(() => {
    if (!provider) return;
    (async () => {
      const network = await provider.getNetwork();
      const addresses = contractAddresses[network.chainId.toString()];

      const poolAddresses = Object.keys(addresses)
        .filter((x) => !!addresses[x].prizePool)
        .map((x) => addresses[x].prizePool.toLowerCase());
      const queryResult = await GetPoolsById(poolAddresses);
      const queryArr: PoolGraphData[] = queryResult.prizePools;

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
          isMultiple,
          externalErc721Awards,
          externalErc20Awards,
        } = getPrizeStrategyAndTokenContracts(result, provider);

        return {
          id: result.id,
          prizePoolType: result.prizePoolType,
          underlyingCollateralSymbol: result.underlyingCollateralSymbol,
          underlyingCollateralToken: result.underlyingCollateralToken,
          underlyingCollateralDecimals: result.underlyingCollateralDecimals,
          contract: new ethers.Contract(result.id, PrizePoolAbi, provider),
          underlyingCollateralContract: new ethers.Contract(result.underlyingCollateralToken, ERC20Abi, provider),
          prizeStrategyAddress: prizeStrategy,
          cTokenAddress: result?.compoundPrizePool?.cToken,
          sponsorshipContract: sponsorship,
          ticketContract: ticket,
          poolGraphData: result,
          ticketAddress: ticketAddress,
          ticketDecimals,
          sponsorshipDecimals,
          externalErc721Awards,
          externalErc20Awards,
          ticketSupply,
          sponsorshipSupply,
          isMultiple,
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
    return getStrategyVals(result.prizeStrategy.singleRandomWinner, provider, false);
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
  externalErc721Awards: [
    {
      tokenIds: string[];
    },
  ];
  externalErc20Awards: [
    {
      id: string;
      decimals: string;
      symbol: string;
    },
  ];
};

const getStrategyVals = (
  {
    id: strategyAddress,
    ticket: { id: ticketAddress, totalSupply: ticketSupply, decimals: ticketDecimals },
    sponsorship: { id: sponsorshipAddress, totalSupply: sponsorshipSupply, decimals: sponsorshipDecimals },
    externalErc721Awards,
    externalErc20Awards,
  }: StrategyData,
  provider: SafeAppsSdkProvider,
  isMultiple: boolean,
) => ({
  isMultiple,
  prizeStrategy: strategyAddress,
  ticket: new ethers.Contract(ticketAddress, ERC20Abi, provider),
  ticketAddress,
  ticketSupply,
  sponsorshipSupply,
  sponsorship: new ethers.Contract(sponsorshipAddress, ERC20Abi, provider),
  ticketDecimals,
  sponsorshipDecimals,
  externalErc721Awards,
  externalErc20Awards,
});

export const usePoolData = (): PoolData[] => {
  const context = useContext(PoolsContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
