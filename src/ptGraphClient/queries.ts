import { gql } from '@apollo/client';

export const POOLS_QUERY = gql`
  query GetPools {
    prizePools {
      id
      deactivated
      underlyingCollateralName
      cumulativePrizeNet
    }
  }
`;
export const POOLS_BY_ID = gql`
  query GetPoolsById($poolAddresses: [String!]!) {
    prizePools(where: { id_in: $poolAddresses }) {
      id
      underlyingCollateralSymbol
      underlyingCollateralToken
      compoundPrizePool {
        cToken
      }
      prizeStrategy {
        singleRandomWinner {
          id
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
          id
          sponsorship {
            id
            totalSupply
          }
          ticket {
            id
            totalSupply
          }
        }
      }
    }
  }
`;
