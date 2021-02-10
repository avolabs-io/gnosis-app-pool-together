import React, { createContext, useMemo, useContext } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

const EthersContext = createContext<SafeAppsSdkProvider | undefined>(undefined);

export const EthersProvider: React.FC = ({ children }) => {
  const { sdk, safe } = useSafeAppsSDK();
  const provider = useMemo(() => new SafeAppsSdkProvider(safe, sdk), [sdk, safe]);
  return <EthersContext.Provider value={provider}>{children}</EthersContext.Provider>;
};

export const useNetworkProvider = (): SafeAppsSdkProvider => {
  const context = useContext(EthersContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
