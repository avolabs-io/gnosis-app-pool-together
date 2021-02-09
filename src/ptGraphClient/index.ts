import fetch from 'cross-fetch';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import { POOLS_QUERY, POOLS_BY_ID } from './queries';

export const POOLTOGETHER_GRAPH_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0';
// 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-staging-v3_1_0';
// https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0
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
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return { error: true, message: error };
  }
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
