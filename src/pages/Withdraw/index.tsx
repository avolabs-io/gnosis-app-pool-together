import React, { useState, useEffect } from 'react';
import { Title, Divider, Select, TextField, Text, Button } from '@gnosis.pm/safe-react-components';
import {
  Heading,
  Wrapper,
  Label,
  RightJustified,
  FormHeaderWrapper,
  FormButtonWrapper,
} from '../../components/GeneralStyled';
import { SelectItem } from '../../types';
import { Link } from './styled';

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { ethers, constants } from 'ethers';
import { usePoolData } from '../../providers/pools';
import { useTicketBalances } from '../../providers/tickets';
import { useDidMount } from '../../utils/useDidMount';
// eslint-disable-next-line no-var
const Withdraw: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('0');
  const [selectItems, setSelectItems] = useState<SelectItem[]>([]);
  const [maxBalance, setMaxBalance] = useState(constants.Zero);

  const [error, setError] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const [decimals, setDecimals] = useState('18');

  const [amount, setAmount] = useState('');
  const [underlyingAmount, setUnderlyingAmount] = useState(constants.Zero);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const { sdk, safe } = useSafeAppsSDK();
  const pools = usePoolData();
  const { ticketBalances, refreshTicketBalances } = useTicketBalances();

  useDidMount(() => refreshTicketBalances());
  useEffect(() => {
    const s = pools.map((pool, index) => ({
      id: index.toString(),
      label: pool.underlyingCollateralSymbol,
      subLabel:
        ticketBalances.length < pools.length
          ? '0.0 tickets'
          : `${ethers.utils.formatUnits(ticketBalances[index], pool.ticketDecimals || '18')} tickets`,
      iconUrl: `https://gnosis-safe-token-logos.s3.amazonaws.com/${ethers.utils.getAddress(
        pool.underlyingCollateralToken.toString(),
      )}.png`,
    }));
    setSelectItems(s);
    if (pools.length > 0) onSelect(activeItemId);
  }, [pools, JSON.stringify(ticketBalances)]);

  const [hasFairnessFee, setHasFairnessFee] = useState(false);

  const onSelect = (id: string) => {
    const index = Number(id);
    setActiveItemId(id);
    const pool = pools[index];
    setTokenSymbol(pool.underlyingCollateralSymbol);
    if (ticketBalances.length !== pools.length) return;
    const { contract, ticketAddress, ticketDecimals } = pool;
    sdk.eth
      .call([
        {
          to: contract.address,
          data: contract.interface.encodeFunctionData('calculateTimelockDuration', [
            safe.safeAddress,
            ticketAddress,
            ticketBalances[index],
          ]),
        },
      ])
      .then((x) => {
        if (contract.interface.decodeFunctionResult('calculateTimelockDuration', x).durationSeconds.gt(0)) {
          setHasFairnessFee(true);
        }
      })
      .catch((x) => console.log(x));
    setDecimals(ticketDecimals || '18');
    setMaxBalance(ticketBalances[index]);
  };

  useEffect(() => {
    if (amount == '') {
      setUnderlyingAmount(constants.Zero);
      if (buttonActive) setButtonActive(false);
    } else {
      let newAmount;
      try {
        newAmount = ethers.utils.parseUnits(amount, decimals);
      } catch {
        setUnderlyingAmount(constants.Zero);
        if (!error) setError(true);
        if (buttonActive) setButtonActive(false);
        return;
      }
      setUnderlyingAmount(newAmount);
      if (error) setError(false);
      if (!buttonActive) setButtonActive(true);
    }
  }, [amount]);

  const onClick = () => {
    if (!buttonActive) return;
    const { contract, ticketContract } = pools[Number(activeItemId)];
    const underlyingAmountStr = underlyingAmount.toString();
    const txs = [
      // {
      //   to: ticketContract.address,
      //   value: '0',
      //   data: ticketContract.interface.encodeFunctionData('approve', [contract.address, underlyingAmountStr]),
      // },
      {
        to: contract.address,
        value: '0',
        data: contract.interface.encodeFunctionData('withdrawInstantlyFrom', [
          safe.safeAddress,
          underlyingAmountStr,
          ticketContract.address,
          constants.MaxUint256,
        ]),
      },
    ];
    sdk.txs.send({ txs }).catch((e) => console.log(e));
  };

  const formattedMaxBalance = ethers.utils.formatUnits(maxBalance, decimals);

  return (
    <Wrapper>
      <FormHeaderWrapper>
        <Title size="sm" withoutMargin>
          Redeem Tickets
        </Title>
      </FormHeaderWrapper>

      <Divider />
      <Label size="lg">Select the prize pool to withdraw from</Label>
      <Select
        items={selectItems}
        activeItemId={activeItemId}
        onItemClick={onSelect}
        fallbackImage="https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg"
      />
      {hasFairnessFee && (
        <RightJustified>
          <Text size="lg" color="error">
            By withdrawing from this pool you may be subject to a{' '}
            <Link href="https://docs.pooltogether.com/protocol/prize-pool/fairness">fairness</Link> fee.
          </Text>
        </RightJustified>
      )}
      <Divider />
      <Label size="lg">Choose the amount you wish to redeem</Label>
      <TextField
        id="standard-name"
        label="Amount"
        value={amount}
        meta={error ? { error: 'Please enter a valid amount' } : {}}
        onChange={(e) => setAmount(e.target.value)}
        endAdornment={
          <Button color="secondary" size="md" onClick={() => setAmount(formattedMaxBalance)}>
            <Heading>MAX</Heading>
          </Button>
        }
      />
      <RightJustified>
        <Text size="lg">
          Maximum {formattedMaxBalance} {tokenSymbol}
        </Text>
      </RightJustified>
      <Divider />
      <FormButtonWrapper>
        <Button color="secondary" size="lg" variant="contained" onClick={onClick}>
          Withdraw {tokenSymbol}
        </Button>
      </FormButtonWrapper>
    </Wrapper>
  );
};
export default Withdraw;
