import { BigNumber, ethers, constants } from 'ethers';
import { normalizeTo18Decimals } from './normalizeTo18Decimals';
export const derivedEthToEth = (amount: BigNumber, decimals: string, derivedEth: string): BigNumber => {
  amount = normalizeTo18Decimals(amount, parseInt(decimals, 10));
  const dBN = ethers.utils.parseEther(derivedEth.substring(0, 18));
  return amount.mul(dBN).div(constants.WeiPerEther);
};

export const derivedEthToEthAlreadyNormalized = (amount: BigNumber, derivedEth: string): BigNumber => {
  const dBN = ethers.utils.parseEther(derivedEth.substring(0, 18));
  return amount.mul(dBN).div(constants.WeiPerEther);
};

export const EthToUsd = (amount: BigNumber, ethToUsd: BigNumber): BigNumber => {
  return amount.mul(ethToUsd).div(ethers.utils.parseUnits('1', 8));
};
