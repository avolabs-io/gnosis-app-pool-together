import React, { useEffect } from 'react';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { GetPools } from '../../ptGraphClient';

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
  },
];

const Pools: React.FC = () => {
  useEffect(() => {
    console.log('This is called');
    (async () => {
      const value = await GetPools();
      console.log(value);
    })();
  }, []);

  return (
    <>
      {cards.map((val) => (
        <PoolCard key={val.prizeValue} {...val} />
      ))}
    </>
  );
};

export default Pools;
