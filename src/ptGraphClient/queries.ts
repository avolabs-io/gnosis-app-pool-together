import { gql } from '@apollo/client';

export const POOLS_QUERY = gql`
  query GetPools {
    prizePools {
      id
      deactivated
      underlyingCollateralName
    }
  }
`;
