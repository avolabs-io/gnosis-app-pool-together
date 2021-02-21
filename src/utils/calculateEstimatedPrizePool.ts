import { ethers, BigNumber, constants } from 'ethers';

import {
  normalizeTo18Decimals,
  DEFAULT_TOKEN_DECIMAL_PRECISION as DEFAULT_TOKEN_PRECISION,
} from './normalizeTo18Decimals';

const bn = BigNumber.from;

const SECONDS_PER_BLOCK = 14;

type CalculateEstimatedPoolPrizeArgs = {
  tokenDecimals: number;
  awardBalance: BigNumber;
  poolTotalSupply: BigNumber;
  supplyRatePerBlock: BigNumber;
  prizePeriodRemainingSeconds: BigNumber;
};

export function calculateEstimatedPoolPrize({
  tokenDecimals,
  awardBalance,
  poolTotalSupply,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds,
}: CalculateEstimatedPoolPrizeArgs): BigNumber {
  const decimals = tokenDecimals || DEFAULT_TOKEN_PRECISION;

  awardBalance = awardBalance || constants.Zero;
  awardBalance = normalizeTo18Decimals(awardBalance, decimals);

  poolTotalSupply = poolTotalSupply || bn(0);
  poolTotalSupply = normalizeTo18Decimals(poolTotalSupply, decimals);

  const supplyRatePerBlockBN = supplyRatePerBlock || bn(0);

  const prizePeriodRemainingSecondsBN = bn(prizePeriodRemainingSeconds || 0).div(SECONDS_PER_BLOCK);

  const additionalYield = poolTotalSupply
    .mul(supplyRatePerBlockBN)
    .mul(prizePeriodRemainingSecondsBN)
    .div(ethers.constants.WeiPerEther);

  const estimatedPrizeBN = additionalYield.add(awardBalance);

  // denormalize back to original token decimal amount
  return estimatedPrizeBN.div(ethers.utils.parseUnits('1', 18 - parseInt(decimals.toString(), 10)));
}
