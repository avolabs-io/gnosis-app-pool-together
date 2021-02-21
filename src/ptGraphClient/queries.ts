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
      prizePoolType
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
          externalErc20Awards {
            id
            decimals
            symbol
          }
          externalErc721Awards {
            tokenIds
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
          externalErc20Awards {
            id
            decimals
            symbol
          }
          externalErc721Awards {
            tokenIds
          }
        }
      }
    }
  }
`;

export const LOOTBOX_QUERY = gql`
  query GetLootboxes($lootBoxAddress: String!, $tokenIDs: [String!]!) {
    lootBoxes(where: { tokenId_in: $tokenIDs, erc721: $lootBoxAddress }) {
      id
      tokenId
      erc20Balances {
        balance
        erc20Entity {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

export const TOKENS_QUERY = gql`
  query GetTokens($tokenIDs: [String!]!) {
    tokens(where: { id_in: $tokenIDs }) {
      id
      derivedETH
      symbol
      decimals
    }
  }
`;
