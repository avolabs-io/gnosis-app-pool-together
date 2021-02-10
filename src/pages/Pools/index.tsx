import React, { useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { contractAddresses } from '@pooltogether/current-pool-data';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { usePoolData } from '../../providers/pools';
import { ethers } from 'ethers';
import { useControlledTokenBalances } from '../../hooks/useControlledTokenBalances';
import { usePoolChainData } from '../../providers/pools-chain';
const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);
  const pools = usePoolData();
  const controlledTokenBalances = useControlledTokenBalances();
  const poolChainData = usePoolChainData();
  useEffect(() => {
    setPrizePools(
      pools.map((x, index) => ({
        tokenImageUrl: ethers.utils.getAddress(x.underlyingCollateralToken.toString()),
        tokenSymbol: x.underlyingCollateralSymbol.toString(),
        userBalance: controlledTokenBalances.length < pools.length ? '0.0' : controlledTokenBalances[index],
        prizeValue: '1000',
        countdown: {
          days: 0,
          hours: 10,
          minutes: 8,
        },
        secondsRemaining: poolChainData.length < pools.length ? 0 : poolChainData[index].secondsRemaining,
      })),
    );
  }, [JSON.stringify(pools), JSON.stringify(controlledTokenBalances), JSON.stringify(poolChainData)]);

  return (
    <>
      {prizePools.map((val) => (
        <PoolCard key={val.tokenSymbol} {...val} />
      ))}
    </>
  );
};

export default Pools;
