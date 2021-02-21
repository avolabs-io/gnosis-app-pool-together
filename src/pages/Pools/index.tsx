import React, { useEffect, useState } from 'react';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { usePoolData } from '../../providers/pools';
import { ethers } from 'ethers';
import { useTicketBalances } from '../../providers/tickets';
import { usePoolChainData } from '../../providers/pools-chain';
import { useDidMount } from '../../utils/useDidMount';
import { usePrizeValues } from '../../providers/prize-values';
const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);
  const pools = usePoolData();
  const { ticketBalances, refreshTicketBalances } = useTicketBalances();
  const poolChainData = usePoolChainData();
  const prizeVals = usePrizeValues();
  useDidMount(() => refreshTicketBalances());

  useEffect(() => {
    console.log('HEY!');
    console.log(poolChainData);
    console.log(poolChainData.map((x) => x.secondsRemaining.toNumber()));
    console.log(Date.now());
    setPrizePools(
      pools.map((x, index) => ({
        poolIndex: index.toString(),
        tokenImageUrl: ethers.utils.getAddress(x.underlyingCollateralToken.toString()),
        tokenSymbol: x.underlyingCollateralSymbol.toString(),
        userBalance:
          ticketBalances.length < pools.length
            ? '0.0'
            : ethers.utils.formatUnits(ticketBalances[index], x.ticketDecimals || '18'),
        prizeValue: prizeVals.length < pools.length ? 'LOADING' : prizeVals[index],
        secondsRemaining:
          (Date.now() as number) +
          (poolChainData.length < pools.length ? 0 : poolChainData[index].secondsRemaining.toNumber() * 1000),
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
  }, [JSON.stringify(pools), JSON.stringify(ticketBalances), JSON.stringify(poolChainData), JSON.stringify(prizeVals)]);

  return (
    <>
      {prizePools.map((val) => (
        <PoolCard key={val.tokenSymbol} {...val} />
      ))}
    </>
  );
};

export default Pools;
