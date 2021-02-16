import React, { useEffect, useState } from 'react';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { usePoolData } from '../../providers/pools';
import { ethers } from 'ethers';
import { useTicketBalances } from '../../providers/tickets';
import { usePoolChainData } from '../../providers/pools-chain';
import { useDidMount } from '../../utils/useDidMount';
const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);
  const pools = usePoolData();
  const { ticketBalances, refreshTicketBalances } = useTicketBalances();
  const poolChainData = usePoolChainData();
  useDidMount(() => refreshTicketBalances());

  useEffect(() => {
    setPrizePools(
      pools.map((x, index) => ({
        poolIndex: index.toString(),
        tokenImageUrl: ethers.utils.getAddress(x.underlyingCollateralToken.toString()),
        tokenSymbol: x.underlyingCollateralSymbol.toString(),
        userBalance:
          ticketBalances.length < pools.length
            ? '0.0'
            : ethers.utils.formatUnits(ticketBalances[index], x.ticketDecimals || '18'),
        prizeValue: '1000',
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
  }, [JSON.stringify(pools), JSON.stringify(ticketBalances), JSON.stringify(poolChainData)]);

  return (
    <>
      {prizePools.map((val) => (
        <PoolCard key={val.tokenSymbol} {...val} />
      ))}
    </>
  );
};

export default Pools;
