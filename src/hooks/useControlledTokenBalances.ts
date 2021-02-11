import { useEffect } from 'react';
import { usePoolData } from '../providers/pools';
import { useState } from 'react';
import { useNetworkProvider } from '../providers/ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { BigNumber } from 'ethers';
import { Contract, Provider } from 'ethers-multicall';
import ERC20 from '../abis/erc20';

// REFACTOR
export const useControlledTokenBalances = () => {
  const pools = usePoolData();
  const { sdk, safe } = useSafeAppsSDK();
  const provider = useNetworkProvider();
  const [controlledTokenBalances, setControlledTokenBalances] = useState<BigNumber[]>([]);
  useEffect(() => {
    (async () => {
      const ethCallProvider = new Provider(provider);
      await ethCallProvider.init();
      const reqs = [];
      for (const pool of pools) {
        reqs.push(new Contract(pool.ticketAddress, ERC20).balanceOf(safe.safeAddress));
      }
      let controlledTokenBalances: BigNumber[];
      try {
        controlledTokenBalances = await ethCallProvider.all(reqs);
      } catch (e) {
        console.log(e);
        return;
      }
      setControlledTokenBalances(controlledTokenBalances);
    })();
  }, [pools, sdk]);
  return controlledTokenBalances;
};
