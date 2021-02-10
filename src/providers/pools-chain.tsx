import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { usePoolData } from './pools';

const PoolsChainContext = createContext<PoolChainData[]>([]);

type PoolChainData = {
  secondsRemaining: number;
};

export const PoolsChain: React.FC = ({ children }) => {
  const { sdk } = useSafeAppsSDK();
  const [poolChainData, setPoolChainData] = useState<PoolChainData[]>([]);
  const pools = usePoolData();
  /// this is unscalable, need to come up with a better solution
  useEffect(() => {
    (async () => {
      const address = (await sdk.getSafeInfo()).safeAddress;
      const reqs = [];
      for (const pool of pools) {
        reqs.push(
          sdk.eth.call([
            {
              from: address,
              to: pool.prizeStrategyContract.address,
              data: pool.prizeStrategyContract.interface.encodeFunctionData('prizePeriodRemainingSeconds'),
            },
          ]),
        );
      }
      Promise.all(reqs).then((values) => {
        setPoolChainData(
          values.map((value) => ({
            secondsRemaining: Number(value),
          })),
        );
      });
    })();
  }, [JSON.stringify(pools), sdk]);

  return <PoolsChainContext.Provider value={poolChainData}>{children}</PoolsChainContext.Provider>;
};

export const usePoolChainData = (): PoolChainData[] => {
  const context = useContext(PoolsChainContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
