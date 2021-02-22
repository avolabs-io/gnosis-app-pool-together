/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useEffect, useContext, useState } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { fetch } from 'cross-fetch';
import { setPtClient, setLbClient } from '../ptGraphClient';
import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';

const EthersContext = createContext<SafeAppsSdkProvider | undefined>(undefined);

const PT_GRAPH_ENDPOINTS: any = {
  '1': 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0',
  '4': 'https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0',
};

const LB_GRAPH_ENDPOINTS: any = {
  '1': 'https://api.thegraph.com/subgraphs/name/pooltogether/lootbox-v1_0_0',
  '4': 'https://api.thegraph.com/subgraphs/name/pooltogether/ptv3-lootbox-rinkeby-staging',
};

export const EthersProvider: React.FC = ({ children }) => {
  const { sdk, safe } = useSafeAppsSDK();
  const [provider, setProvider] = useState<SafeAppsSdkProvider | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const p = new SafeAppsSdkProvider(safe, sdk);
      const chainId = (await p.getNetwork()).chainId;
      setPtClient(
        new ApolloClient({
          link: new HttpLink({
            uri:
              PT_GRAPH_ENDPOINTS[chainId.toString()] ||
              'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0',
            fetch,
          }),
          cache: new InMemoryCache(),
          defaultOptions: {
            query: {
              fetchPolicy: 'no-cache',
            },
          },
        }),
      );
      setLbClient(
        new ApolloClient({
          link: new HttpLink({
            uri:
              LB_GRAPH_ENDPOINTS[chainId.toString()] ||
              'https://api.thegraph.com/subgraphs/name/pooltogether/lootbox-v1_0_0',
            fetch,
          }),
          cache: new InMemoryCache(),
          defaultOptions: {
            query: {
              fetchPolicy: 'no-cache',
            },
          },
        }),
      );
      setProvider(p);
    })();
  }, [sdk, safe]);
  return <EthersContext.Provider value={provider}>{children}</EthersContext.Provider>;
};

export const useNetworkProvider = (): SafeAppsSdkProvider | undefined => {
  const context = useContext(EthersContext);
  return context;
};
