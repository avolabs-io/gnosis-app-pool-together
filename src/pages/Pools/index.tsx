import React, { useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { contractAddresses } from '@pooltogether/current-pool-data';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { GetPools, GetPoolsById } from '../../ptGraphClient';
import { ethers } from 'ethers';

const cards: PoolCardProps[] = [
  {
    tokenImageUrl: 'https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg',
    tokenSymbol: 'DAI',
    prizeValue: '4,255',
    userBalance: '23.50',
    countdown: {
      days: 4,
      hours: 3,
      minutes: 7,
    },
    prizeGivingTimestamp: '1',
  },
  {
    tokenImageUrl: 'https://app.pooltogether.com/_next/static/images/token-uni-451e466d1b684adf13ce4990aee5b04b.png',
    tokenSymbol: 'UNI',
    prizeValue: '1,052',
    userBalance: '0.00',
    countdown: {
      days: 4,
      hours: 3,
      minutes: 7,
    },
    prizeGivingTimestamp: '2',
  },
  {
    tokenImageUrl:
      'https://app.pooltogether.com/_next/static/images/usdc-new-transparent-61b9e782ef440264b641b5723a503473.png',
    tokenSymbol: 'USDC',
    prizeValue: '1,535',
    userBalance: '137.00',
    countdown: {
      days: 0,
      hours: 10,
      minutes: 8,
    },
    prizeGivingTimestamp: '3',
  },
];

const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);
  useEffect(() => {
    console.log('This is called');
    const pools = Object.keys(contractAddresses['1'])
      .filter((x) => !!contractAddresses['1'][x].prizePool)
      .map((x) => contractAddresses['1'][x].prizePool.toLowerCase());
    (async () => {
      const value: {
        prizePools: [
          {
            underlyingCollateralSymbol: string;
            underlyingCollateralToken: string;
            maxTimelockDuration: string;
          },
        ];
      } = await GetPoolsById(pools);
      const p: PoolCardProps[] = value.prizePools.map((x) => ({
        tokenImageUrl: ethers.utils.getAddress(x.underlyingCollateralToken.toString()),
        tokenSymbol: x.underlyingCollateralSymbol.toString(),
        userBalance: '0.0',
        prizeValue: '1000',
        countdown: {
          days: 0,
          hours: 10,
          minutes: 8,
        },
        prizeGivingTimestamp: x.maxTimelockDuration,
      }));

      setPrizePools(p);
    })();
  }, []);

  return (
    <>
      {prizePools.map((val) => (
        <PoolCard key={val.tokenSymbol} {...val} />
      ))}
    </>
  );
};

export default Pools;
