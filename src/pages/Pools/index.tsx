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
        userBalance:
          controlledTokenBalances.length < pools.length
            ? '0.0'
            : ethers.utils.formatEther(controlledTokenBalances[index]),
        prizeValue: '1000',
        countdown: {
          days: 0,
          hours: 10,
          minutes: 8,
        },
        secondsRemaining: (x.poolGraphData.prizeStrategy.multipleWinners != null
          ? x.poolGraphData.prizeStrategy.multipleWinners.prizePeriodEndAt
          : x.poolGraphData.prizeStrategy.singleRandomWinner
          ? x.poolGraphData.prizeStrategy.singleRandomWinner.prizePeriodEndAt
          : Date.now()) as number,
      })),
    );

    if (pools.length > 0) {
      console.log(
        pools[0].poolGraphData.prizeStrategy.multipleWinners != null
          ? pools[0].poolGraphData.prizeStrategy.multipleWinners.prizePeriodEndAt
          : pools[0].poolGraphData.prizeStrategy.singleRandomWinner
          ? pools[0].poolGraphData.prizeStrategy.singleRandomWinner.prizePeriodEndAt
          : Date.now(),
      );
    }

    if (pools.length > 0) {
      console.log('poolChainData');
      console.log(pools[0].prizeStrategyContract);
    }
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
