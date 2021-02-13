import fetch from 'cross-fetch';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import { POOLS_QUERY, POOLS_BY_ID, USERS_TOKEN_BALANCES } from './queries';
export const POOLTOGETHER_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0';
// 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0';
// 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0';

const ptClient = new ApolloClient({
  link: new HttpLink({ uri: POOLTOGETHER_GRAPH_ENDPOINT, fetch }),
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
      };
      sponsorship: {
        id: string;
        totalSupply: string;
      };
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
