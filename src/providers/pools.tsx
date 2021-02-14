import React, { createContext, useContext, useEffect, useState } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useNetworkProvider } from './ethers';
import { contractAddresses } from '@pooltogether/current-pool-data';
import { GetPoolsById, PoolGraphData } from '../ptGraphClient';
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool';
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners';
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner';
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface';
import ERC20Abi from '../abis/erc20';
import { ethers } from 'ethers';

const PoolsContext = createContext<PoolData[]>([]);

type PoolData = {
  underlyingCollateralSymbol: string;
  underlyingCollateralToken: string;
  underlyingCollateralDecimals: string;
  ticketDecimals: string;
  sponsorshipDecimals: string;
  id: string;
  contract: ethers.Contract;
  underlyingCollateralContract: ethers.Contract;
  prizeStrategyContract: ethers.Contract;
  cTokenContract: null | ethers.Contract;
  ticketContract: ethers.Contract;
  sponsorshipContract: ethers.Contract;
  poolGraphData: PoolGraphData;
  ticketAddress: string;
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
        } = getPrizeStrategyAndTokenContracts(result, provider);

        return {
          id: result.id,
          underlyingCollateralSymbol: result.underlyingCollateralSymbol,
          underlyingCollateralToken: result.underlyingCollateralToken,
          underlyingCollateralDecimals: result.underlyingCollateralDecimals,
          contract: new ethers.Contract(result.id, PrizePoolAbi, provider),
          underlyingCollateralContract: new ethers.Contract(result.underlyingCollateralToken, ERC20Abi, provider),
          prizeStrategyContract: prizeStrategy,
          cTokenContract: getCTokenContract(result, provider),
          sponsorshipContract: sponsorship,
          ticketContract: ticket,
          poolGraphData: result,
          ticketAddress: ticketAddress,
          ticketDecimals,
          sponsorshipDecimals,
        };
      });

      setPoolsData(p);
    })();
  }, [provider]);

  return <PoolsContext.Provider value={poolsData}>{children}</PoolsContext.Provider>;
};

const getPrizeStrategyAndTokenContracts = (result: PoolGraphData, provider: SafeAppsSdkProvider) => {
  if (!!result.prizeStrategy.multipleWinners) {
    return {
      prizeStrategy: new ethers.Contract(
        result.prizeStrategy.multipleWinners.id,
        MultipleWinnersPrizeStrategyAbi,
        provider,
      ),
      ticket: new ethers.Contract(result.prizeStrategy.multipleWinners.ticket.id, ERC20Abi, provider),
      ticketAddress: result.prizeStrategy.multipleWinners.ticket.id,
      ticketDecimals: result.prizeStrategy.multipleWinners.ticket.decimals,
      sponsorshipDecimals: result.prizeStrategy.multipleWinners.sponsorship.decimals,
      sponsorship: new ethers.Contract(result.prizeStrategy.multipleWinners.sponsorship.id, ERC20Abi, provider),
    };
  } else if (!!result.prizeStrategy.singleRandomWinner) {
    return {
      prizeStrategy: new ethers.Contract(
        result.prizeStrategy.singleRandomWinner.id,
        SingleRandomWinnerPrizeStrategyAbi,
        provider,
      ),
      ticket: new ethers.Contract(result.prizeStrategy.singleRandomWinner.ticket.id, ERC20Abi, provider),
      ticketAddress: result.prizeStrategy.singleRandomWinner.ticket.id,
      ticketDecimals: result.prizeStrategy.singleRandomWinner.ticket.decimals,
      sponsorshipDecimals: result.prizeStrategy.singleRandomWinner.sponsorship.decimals,
      sponsorship: new ethers.Contract(result.prizeStrategy.singleRandomWinner.sponsorship.id, ERC20Abi, provider),
    };
  }
  throw new Error('No strategy for prize Pool!');
};

const getCTokenContract = (result: PoolGraphData, provider: SafeAppsSdkProvider) => {
  if (!!result.compoundPrizePool) {
    return new ethers.Contract(result.compoundPrizePool.cToken, CTokenAbi, provider);
  }
  return null;
};

export const usePoolData = (): PoolData[] => {
  const context = useContext(PoolsContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
