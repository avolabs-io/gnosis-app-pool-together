import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { BigNumber, constants, ethers } from 'ethers';
import { useNetworkProvider } from './ethers';
import { usePoolData } from './pools';
import { getLootboxERC20Sources, getExternalErc20Sources } from '../utils/getERC20Sources';
import { Contract, Provider } from 'ethers-multicall';
import ERC20Abi from '../abis/erc20';

type erc20Balance = {
  id: string;
  decimals: string;
  symbol: string;
  balance: BigNumber;
};

const PoolsERC20Balance = createContext<erc20Balance[][]>([]);

export const PoolsERC20BalanceProvider: React.FC = ({ children }) => {
  const { connected } = useSafeAppsSDK();
  const baseProvider = useNetworkProvider();
  const pools = usePoolData();
  const [poolBalances, setPoolBalances] = useState<erc20Balance[][]>([]);
  useEffect(() => {
    (async () => {
      if (!baseProvider || !pools || pools.length === 0 || !connected) return;
      const chainId = (await baseProvider.getNetwork()).chainId;
      const externalErc20Sources = getExternalErc20Sources(pools);
      let lootboxErc20Sources = await getLootboxERC20Sources(pools, chainId);
      if (lootboxErc20Sources.length !== pools.length || externalErc20Sources.length !== pools.length) return;
      lootboxErc20Sources = lootboxErc20Sources.map((x, index) =>
        x.filter((y) => !externalErc20Sources[index].find((z) => z.id == y.id)),
      );
      const provider = new Provider(baseProvider);
      await provider.init();
      const requests = [];
      for (let i = 0; i < pools.length; i++) {
        for (const erc20Bal of externalErc20Sources[i]) {
          const erc20Contract = new Contract(erc20Bal.id, ERC20Abi);
          requests.push(erc20Contract.balanceOf(pools[i].id));
        }
      }
      const results: BigNumber[] = await provider.all(requests);
      const finalResult: erc20Balance[][] = [];

      let z = 0;
      for (let i = 0; i < pools.length; i++) {
        const resultForPool: erc20Balance[] = [];
        for (const erc20Bal of externalErc20Sources[i]) {
          if (!results[z].eq(constants.Zero)) {
            resultForPool.push({
              ...erc20Bal,
              balance: results[z],
            });
          }
          z++;
        }
        finalResult.push(resultForPool.concat(lootboxErc20Sources[i]));
      }
      console.log(
        finalResult.map((x) =>
          x.map((x) => ({
            ...x,
            balance: ethers.utils.formatUnits(x.balance, x.decimals),
          })),
        ),
      );
      setPoolBalances(finalResult);
    })();
  }, [pools, connected]);

  return <PoolsERC20Balance.Provider value={poolBalances}>{children}</PoolsERC20Balance.Provider>;
};

export const usePoolsERC20Balance = (): erc20Balance[][] => {
  const context = useContext(PoolsERC20Balance);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
