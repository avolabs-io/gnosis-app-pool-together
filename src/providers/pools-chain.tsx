import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { usePoolData } from './pools';
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface';
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners';
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner';
import { Provider } from 'ethers-multicall';
import { Contract as StaticCallMultiContract } from '../utils/StaticCallMultiContract';
import { useNetworkProvider } from './ethers';
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool';
import { BigNumber, constants, ethers } from 'ethers';
import { calculateEstimatedPoolPrize } from '../utils/calculateEstimatedPrizePool';

const PoolsChainContext = createContext<PoolChainData[]>([]);

type PoolChainData = {
  supplyRatePerBlock: BigNumber;
  awardBalance: BigNumber;
  secondsRemaining: BigNumber;
};

export const PoolsChainProvider: React.FC = ({ children }) => {
  const { connected } = useSafeAppsSDK();
  const baseProvider = useNetworkProvider();
  const pools = usePoolData();
  const [poolChainData, setPoolChainData] = useState<PoolChainData[]>([]);
  useEffect(() => {
    if (!pools || pools.length === 0) return;
    if (!connected) return;

    (async () => {
      const provider = new Provider(baseProvider);
      await provider.init();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requests: any[] = [];
      const indexes = [];
      let index = 0;
      for (const pool of pools) {
        indexes.push(index);

        const poolMultiContract = new StaticCallMultiContract(pool.id, PrizePoolAbi);
        requests.push(poolMultiContract.captureAwardBalance());
        let strategyMultiContract;
        if (pool.isMultiple) {
          strategyMultiContract = new StaticCallMultiContract(
            pool.prizeStrategyAddress,
            MultipleWinnersPrizeStrategyAbi,
          );
        } else {
          strategyMultiContract = new StaticCallMultiContract(
            pool.prizeStrategyAddress,
            SingleRandomWinnerPrizeStrategyAbi,
          );
        }
        requests.push(strategyMultiContract.prizePeriodRemainingSeconds());
        index += 2;
        if (!!pool.cTokenAddress) {
          const cTokenMultiContract = new StaticCallMultiContract(pool.cTokenAddress, CTokenAbi);
          requests.push(cTokenMultiContract.supplyRatePerBlock());
          index++;
        }
      }
      const results = await provider.all(requests);
      const finalData: PoolChainData[] = [];
      for (let i = 0; i < pools.length; i++) {
        const ind = indexes[i];
        const awardBalance: BigNumber = results[ind];
        const secondsRemaining: BigNumber = results[ind + 1];
        let supplyRatePerBlock = constants.Zero;
        if (!!pools[i].cTokenAddress) {
          supplyRatePerBlock = results[ind + 2];
        }
        finalData.push({ awardBalance, supplyRatePerBlock, secondsRemaining });
      }
      console.log(finalData);
      setPoolChainData(finalData);
      console.log(parseInt(pools[0].ticketDecimals));
      console.log(
        finalData.map((x, index) => {
          return ethers.utils.formatUnits(
            calculateEstimatedPoolPrize({
              tokenDecimals: parseInt(pools[index].ticketDecimals, 10),
              awardBalance: x.awardBalance,
              supplyRatePerBlock: x.supplyRatePerBlock,
              prizePeriodRemainingSeconds: x.secondsRemaining,
              poolTotalSupply: BigNumber.from(pools[index].ticketSupply).add(
                BigNumber.from(pools[index].sponsorshipSupply),
              ),
            }).mul(
              ethers.utils.parseUnits(
                '1',
                parseInt(pools[index].ticketDecimals || '18', 10) -
                  parseInt(pools[index].underlyingCollateralDecimals || '18', 10),
              ),
            ),
            pools[index].ticketDecimals,
          );
        }),
      );
    })();
  }, [connected, pools]);

  /// this is unscalable, need to come up with a better solution
  // useEffect(() => {
  //   (async () => {
  //     const address = (await sdk.getSafeInfo()).safeAddress;
  //     const reqs = [];
  //     for (const pool of pools) {
  //       reqs.push(
  //         sdk.eth.call([
  //           {
  //             from: address,
  //             to: pool.prizeStrategyContract.address,
  //             data: pool.prizeStrategyContract.interface.encodeFunctionData('prizePeriodRemainingSeconds'),
  //           },
  //         ]),
  //       );
  //     }
  //     // Promise.all(reqs).then((values) => {
  //     //   setPoolChainData(
  //     //     values.map((value) => ({
  //     //       secondsRemaining: Number(value),
  //     //     })),
  //     //   );
  //     // });
  //   })();
  // }, [JSON.stringify(pools), sdk]);

  return <PoolsChainContext.Provider value={poolChainData}>{children}</PoolsChainContext.Provider>;
};

export const usePoolChainData = (): PoolChainData[] => {
  const context = useContext(PoolsChainContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
