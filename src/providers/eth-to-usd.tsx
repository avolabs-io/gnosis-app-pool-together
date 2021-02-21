import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ethers, BigNumber, constants, Contract } from 'ethers';
import { useDidMount } from '../utils/useDidMount';
import { chainlinkAbi } from '../abis/chainlink';
import { useNetworkProvider } from './ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

const CHAINLINK_ADDRESSES = {
  [1]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  [4]: '0x9326BFA02ADD2366b30bacB125260Af641031331',
};

// EIGHT DECIMALS

const EthToUSDContext = createContext<BigNumber>(constants.Zero);

export const EthToUSDProvider: React.FC = ({ children }) => {
  const [ethToUsd, setEthToUsd] = useState(constants.Zero);
  const provider = useNetworkProvider();
  const { connected } = useSafeAppsSDK();
  useEffect(() => {
    (async () => {
      if (!connected || !provider) return;
      const networkId = (await provider.getNetwork()).chainId;
      if (networkId != 4 && networkId != 1) return;
      const chainLinkContract = new Contract(CHAINLINK_ADDRESSES[networkId], chainlinkAbi, provider);
      chainLinkContract.latestAnswer().then((x: BigNumber) => {
        console.log(ethers.utils.formatUnits(x, 8));
        setEthToUsd(x);
      });
    })();
  }, [provider, connected]);
  return <EthToUSDContext.Provider value={ethToUsd}>{children}</EthToUSDContext.Provider>;
};

export const useEthToUsd = (): BigNumber => {
  const context = useContext(EthToUSDContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
