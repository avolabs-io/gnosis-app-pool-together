import { useEffect } from 'react';
import { usePoolData } from '../providers/pools';
import { useState } from 'react';
import { useNetworkProvider } from '../providers/ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { ethers } from 'ethers';

// REFACTOR
export const useControlledTokenBalances = () => {
  const pools = usePoolData();
  const { sdk } = useSafeAppsSDK();
  const [controlledTokenBalances, setControlledTokenBalances] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const address = (await sdk.getSafeInfo()).safeAddress;
      const reqs = [];
      for (const pool of pools) {
        reqs.push(
          sdk.eth.call([
            {
              from: address,
              to: pool.ticketContract.address,
              data: pool.ticketContract.interface.encodeFunctionData('balanceOf', [address]),
            },
          ]),
        );
      }
      Promise.all(reqs).then((values) => {
        setControlledTokenBalances(values.map((value) => ethers.utils.formatEther(value)));
      });
    })();
  }, [pools, sdk]);
  return controlledTokenBalances;
};
