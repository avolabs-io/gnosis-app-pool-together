import { BigNumber } from 'ethers'

export const DEFAULT_TOKEN_DECIMAL_PRECISION = 18

export function normalizeTo18Decimals(bn: string | BigNumber, decimals: number): BigNumber {
  if (!decimals) {
    decimals = DEFAULT_TOKEN_DECIMAL_PRECISION
    console.warn('normalizeTo18Decimals: Number of decimals to adjust by needs to be passed in')
  }


  if (typeof bn === 'string') {
    bn = BigNumber.from(bn);
  }

  if (!bn) {
    throw new Error('normalizeTo18Decimals: BigNumber or string needs to be passed in')
  }

  if (decimals === DEFAULT_TOKEN_DECIMAL_PRECISION) {
    return bn
  }

  if (decimals > DEFAULT_TOKEN_DECIMAL_PRECISION) {
    throw new Error(
        `normalizeTo18Decimals currently doesn't support decimals higher than ${DEFAULT_TOKEN_DECIMAL_PRECISION}`
    );
  }

  const numZeroes = DEFAULT_TOKEN_DECIMAL_PRECISION - decimals
  const normalizedBN = bn.mul(BigNumber.from(Math.pow(10, numZeroes)))

  return normalizedBN
}
