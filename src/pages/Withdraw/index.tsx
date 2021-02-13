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
import { ethers, BigNumber, constants } from 'ethers';
import { usePoolData } from '../../providers/pools';
import { useTicketBalances } from '../../providers/tickets';
import { useDidMount } from '../../hooks/useDidMount';
// eslint-disable-next-line no-var
const Withdraw: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('0');
  const [selectItems, setSelectItems] = useState<SelectItem[]>([]);
  const [maxBalance, setMaxBalance] = useState(constants.Zero);

  const [error, setError] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

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
          : `${ethers.utils.formatEther(ticketBalances[index])} tickets`,
      iconUrl: `https://gnosis-safe-token-logos.s3.amazonaws.com/${ethers.utils.getAddress(
        pool.underlyingCollateralToken.toString(),
      )}.png`,
    }));
    setSelectItems(s);
    if (pools.length > 0) onSelect(activeItemId);
  }, [pools, JSON.stringify(ticketBalances)]);

  const [hasFairnessFee, setHasFairnessFee] = useState(false);

  const onSelect = (id: string) => {
    setActiveItemId(id);
    const pool = pools[Number(id)];
    setTokenSymbol(pool.underlyingCollateralSymbol);
    pool.contract.timelockBalanceOf(safe.safeAddress).then((value: BigNumber) => {
      if (value.gt(constants.Zero)) {
        setHasFairnessFee(true);
      }
    });
    if (ticketBalances.length === pools.length) {
      setMaxBalance(ticketBalances[Number(id)]);
    }
  };

  useEffect(() => {
    if (amount == '') {
      setUnderlyingAmount(BigNumber.from('0'));
      if (buttonActive) setButtonActive(false);
    } else {
      let newAmount;
      try {
        newAmount = ethers.utils.parseUnits(amount, 'ether');
      } catch {
        setUnderlyingAmount(BigNumber.from('0'));
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
    sdk.txs.send({ txs });
  };

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
            By withdrawing early from this pool you will be subject to a{' '}
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
          <Button color="secondary" size="md" onClick={() => setAmount(ethers.utils.formatEther(maxBalance))}>
            <Heading>MAX</Heading>
          </Button>
        }
      />
      <RightJustified>
        <Text size="lg">
          Maximum {ethers.utils.formatEther(maxBalance)} {tokenSymbol}
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
