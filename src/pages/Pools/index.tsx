import React, { useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { contractAddresses } from '@pooltogether/current-pool-data';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { usePoolData } from '../../providers/pools';
import { ethers } from 'ethers';

const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);

  const pools = usePoolData();

  useEffect(() => {
    setPrizePools(
      pools.map((x) => ({
        tokenImageUrl: ethers.utils.getAddress(x.underlyingCollateralToken.toString()),
        tokenSymbol: x.underlyingCollateralSymbol.toString(),
        userBalance: '0.0',
        prizeValue: '1000',
        countdown: {
          days: 0,
          hours: 10,
          minutes: 8,
        },
      }))
    );
  }, [JSON.stringify(pools)]);

  return (
    <>
      {prizePools.map((val) => (
        <PoolCard key={val.tokenSymbol} {...val} />
      ))}
    </>
  );
};

export default Pools;
