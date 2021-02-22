import React, { useEffect, useState, useRef } from 'react';
import PoolCard, { PoolCardProps } from '../../components/PoolCard';
import { usePoolData } from '../../providers/pools';
import { ethers } from 'ethers';
import { useTicketBalances } from '../../providers/tickets';
import { usePoolChainData } from '../../providers/pools-chain';
import { useDidMount } from '../../utils/useDidMount';
import { usePrizeValues } from '../../providers/prize-values';
const Pools: React.FC = () => {
  const [prizePools, setPrizePools] = useState<PoolCardProps[]>([]);

  const date = useRef(Date.now() as number);
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
        prizeValue: prizeVals.length < pools.length ? '' : prizeVals[index],
        secondsRemaining:
          date.current +
          (poolChainData.length < pools.length ? 0 : poolChainData[index].secondsRemaining.toNumber() * 1000),
        loading: prizeVals.length < pools.length,
      })),
    );
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
