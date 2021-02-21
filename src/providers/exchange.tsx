import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers, BigNumber, constants, Contract } from 'ethers';
import { chainlinkAbi } from '../abis/chainlink';
import { useNetworkProvider } from './ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { getLootboxERC20Sources, getExternalErc20Sources } from '../utils/getERC20Sources';
import { erc20Source, usePoolData } from './pools';
import { flatten } from '../utils/flatten';
import { GetTokenExchange } from '../ptGraphClient';
const CHAINLINK_ADDRESSES = {
  [1]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  [4]: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
};

type ExchangeDict = {
  [key: string]: {
    derivedEth: string;
    decimals: string;
  };
};

type InitalizedExchangeDict = {
  initialized: boolean;
  exchangeDict: ExchangeDict;
};

type ExchangeType = {
  ethToUsd: BigNumber;
  tokenExchange: InitalizedExchangeDict;
};

// EIGHT DECIMALS

const ExchangeContext = createContext<ExchangeType>({
  ethToUsd: constants.Zero,
  tokenExchange: {
    initialized: false,
    exchangeDict: {},
  },
});

export const ExchangeProvider: React.FC = ({ children }) => {
  const [ethToUsd, setEthToUsd] = useState(constants.Zero);
  const [exchangeDict, setExchangeDict] = useState<InitalizedExchangeDict>({ initialized: false, exchangeDict: {} });
  const provider = useNetworkProvider();
  const { connected } = useSafeAppsSDK();
  const pools = usePoolData();
  useEffect(() => {
    (async () => {
      if (!connected || !provider) return;
      const networkId = (await provider.getNetwork()).chainId;
      if (networkId != 4 && networkId != 1) return;
      const chainLinkContract = new Contract(CHAINLINK_ADDRESSES[networkId], chainlinkAbi, provider);
      chainLinkContract.latestAnswer().then((x: BigNumber) => {
        setEthToUsd(x);
      });
    })();
  }, [provider, connected]);

  useEffect(() => {
    if (!provider) return;
    (async () => {
      setExchangeDict({
        initialized: false,
        exchangeDict: {},
      });
      const networkId = (await provider.getNetwork()).chainId;
      const sources: erc20Source[] = flatten(
        getExternalErc20Sources(pools).concat(await getLootboxERC20Sources(pools, networkId)),
      );
      const ticketIds = sources
        .map((x) => x.id)
        .concat(pools.map((pool) => pool.underlyingCollateralContract.address.toLowerCase()));
      const data = await GetTokenExchange(ticketIds);
      if (!data.tokens) return;
      const exchangeDict: ExchangeDict = data.tokens.reduce(
        (a: ExchangeDict, b: { derivedETH: string; id: string; decimals: string }) => {
          a[b.id] = {
            derivedEth: b.derivedETH,
            decimals: b.decimals,
          };
          return a;
        },
        {},
      );
      setExchangeDict({ initialized: true, exchangeDict });
    })();
  }, [provider, pools]);

  return (
    <ExchangeContext.Provider
      value={{
        ethToUsd,
        tokenExchange: exchangeDict,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = (): ExchangeType => {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
