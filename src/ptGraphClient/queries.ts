import { gql } from '@apollo/client';

export const POOLS_QUERY = gql`
  query GetPools {
    prizePools {
      id
      deactivated
      underlyingCollateralName
      cumulativePrizeNet
      prizes {
        prizePeriodStartedTimestamp
      }
    }
  }
`;

export const USERS_TOKEN_BALANCES = gql`
  query GetTokenBalances($account: String!) {
    accounts(where: { id: $account }) {
      controlledTokenBalances {
        controlledToken {
          id
        }
        balance
      }
    }
  }
`;
export const POOLS_BY_ID = gql`
  query GetPoolsById($poolAddresses: [String!]!) {
    prizePools(where: { id_in: $poolAddresses }) {
      id
      underlyingCollateralSymbol
      underlyingCollateralToken
      underlyingCollateralDecimals
      compoundPrizePool {
        cToken
      }
      prizeStrategy {
        singleRandomWinner {
          id
          prizePeriodEndAt
          sponsorship {
            id
            totalSupply
          }
          ticket {
            id
            totalSupply
          }
        }
        multipleWinners {
          prizePeriodEndAt
          id
          sponsorship {
            id
            totalSupply
            decimals
          }
          ticket {
            id
            totalSupply
            decimals
          }
        }
      }
    }
  }
`;
