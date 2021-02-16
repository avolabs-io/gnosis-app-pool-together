import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { usePoolData } from './pools';
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface';
import {  Provider } from 'ethers-multicall';
import { Contract as StaticCallMultiContract } from '../utils/StaticCallMultiContract';
import { useNetworkProvider } from './ethers';
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool';
import { BigNumber, constants } from 'ethers';

const PoolsChainContext = createContext<PoolChainData[]>([]);

type PoolChainData = {
  supplyRatePerBlock: BigNumber;
  awardBalance: BigNumber;
};

export const PoolsChainProvider: React.FC = ({ children }) => {
  const { connected } = useSafeAppsSDK();
  const baseProvider = useNetworkProvider();
  const pools = usePoolData();
  const [poolChainData, setPoolChainData] = useState<PoolChainData[]>([]);
  useEffect(() => {
    if(!pools || pools.length === 0) return;
    if(!connected) return;

    (async () => {
      const provider = new Provider(baseProvider);
      await provider.init();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requests: any[] = [];
      const indexes = [];
      let index = 0;
      for(const pool of pools){
        indexes.push(index);
        index++;
        const poolMultiContract = new StaticCallMultiContract(pool.id, PrizePoolAbi);
        requests.push(poolMultiContract.captureAwardBalance());
        if(!!pool.cTokenAddress){
          const cTokenMultiContract = new StaticCallMultiContract(pool.cTokenAddress, CTokenAbi);
          requests.push(cTokenMultiContract.supplyRatePerBlock());
          index++;
        }
      }
      const results = await provider.all(requests);

      const finalData: PoolChainData[] = [];
      for(let i = 0; i < pools.length; i++){
        const awardBalance: BigNumber = results[indexes[i]];
        let supplyRatePerBlock = constants.Zero;
        if(!!pools[i].cTokenAddress){
          supplyRatePerBlock = results[indexes[i + 1]];
        }
        finalData.push({awardBalance, supplyRatePerBlock});
      }
      setPoolChainData(finalData);
    })();
  }, [connected, pools])
  


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
