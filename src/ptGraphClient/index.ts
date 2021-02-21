import fetch from 'cross-fetch';

import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';

import { POOLS_QUERY, POOLS_BY_ID, USERS_TOKEN_BALANCES, LOOTBOX_QUERY, TOKENS_QUERY } from './queries';
export const POOLTOGETHER_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0';
// 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0';
// 'https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0';

export const LOOTBOX_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/pooltogether/lootbox-v1_0_0';

// eslint-disable-next-line no-var
let ptClient: ApolloClient<NormalizedCacheObject>;

let lbClient: ApolloClient<NormalizedCacheObject>;

export const setPtClient = (a: ApolloClient<NormalizedCacheObject>): void => {
  ptClient = a;
};
export const setLbClient = (a: ApolloClient<NormalizedCacheObject>): void => {
  lbClient = a;
};

const uniClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

export const GetPools = async () => {
  try {
    const { data } = await ptClient.query({
      query: POOLS_QUERY,
    });
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
};

export const GetPoolsById = async (ids: string[]) => {
  try {
    const { data } = await ptClient.query({
      query: POOLS_BY_ID,
      variables: {
        poolAddresses: ids,
      },
    });

    console.log('get pools by ID');
    console.log(data);

    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
};

export const GetUserAccountBalances = async (id: string) => {
  try {
    const { data } = await ptClient.query({
      query: USERS_TOKEN_BALANCES,
      variables: {
        account: id,
      },
    });
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
};

export const GetLootBoxSources = async (lootBoxAddress: string, ids: string[]) => {
  try {
    console.log(lootBoxAddress);
    console.log(ids);
    const { data } = await lbClient.query({
      query: LOOTBOX_QUERY,
      variables: {
        tokenIDs: ids,
        lootBoxAddress: lootBoxAddress,
      },
    });
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
};

export const GetTokenExchange = async (tokenID: string) => {
  try {
    const { data } = await uniClient.query({
      query: TOKENS_QUERY,
      variables: {
        tokenID,
      },
    });
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
};

export type LootBoxSource = {
  tokenId: string;
  id: string;
  erc20Balances: [
    {
      balance: string;
      erc20Entity: {
        id: string;
        symbol: string;
        decimals: string;
      };
    },
  ];
};

export type UserAccount = {
  controlledTokenBalances: {
    controlledToken: {
      id: string;
    };
    balance: string;
  }[];
};

type PrizeStrategy =
  | null
  | undefined
  | {
      id: string;
      prizePeriodEndAt: string;
      ticket: {
        id: string;
        totalSupply: string;
        decimals: string;
      };
      sponsorship: {
        id: string;
        totalSupply: string;
        decimals: string;
      };
      externalErc721Awards: [
        {
          tokenIds: string[];
        },
      ];
      externalErc20Awards: [
        {
          decimals: string;
          id: string;
          symbol: string;
        },
      ];
    };

type CompoundPrizePool =
  | null
  | undefined
  | {
      cToken: string;
    };

export type PoolGraphData = {
  underlyingCollateralSymbol: string;
  underlyingCollateralToken: string;
  compoundPrizePool: CompoundPrizePool;
  prizePoolType: string;
  underlyingCollateralDecimals: string;
  id: string;
  prizeStrategy: {
    singleRandomWinner: PrizeStrategy;
    multipleWinners: PrizeStrategy;
  };
};

// export const GetExampleQuery = async (userAddress) => {
//   try {
//     const { data } = await ptClient.query({
//       query: QUERY_NAME,
//       variables: {
//         address: userAddress,
//       },
//     })
//     return data
//   } catch (error) {
//     return { error: true, message: error }
//   }
// }
