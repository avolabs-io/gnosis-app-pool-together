import React, { useEffect, useState } from 'react';
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
import { usePoolData } from '../../providers/pools';
import { ethers, BigNumber } from 'ethers';

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

const Deposit: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('0');
  const [selectItems, setSelectItems] = useState<SelectItem[]>([]);
  const [maxBalance, setMaxBalance] = useState(BigNumber.from('0'));

  const [error, setError] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const [amount, setAmount] = useState("");
  const [underlyingAmount, setUnderlyingAmount] = useState(BigNumber.from('0'));
  const [tokenSymbol, setTokenSymbol] = useState('');
  const { sdk, safe } = useSafeAppsSDK();
  const pools = usePoolData();
  useEffect(() => {
    const s = pools.map((pool, index) => ({
      id: index.toString(),
      label: pool.underlyingCollateralSymbol,
      iconUrl:  `https://gnosis-safe-token-logos.s3.amazonaws.com/${ethers.utils.getAddress(pool.underlyingCollateralToken.toString())}.png`,
    }))
    setSelectItems(s);
  }, [pools]);

  const onSelect = (id : string) => {
    setActiveItemId(id);
    const pool = pools[Number(id)];
    setTokenSymbol(pool.underlyingCollateralSymbol)
    pool.underlyingCollateralContract.balanceOf(safe.safeAddress).then( (value: any) => {
      console.log(value);
      setMaxBalance(BigNumber.from(value));
    });
  }

  useEffect(() => {
    if(amount == ""){
      setUnderlyingAmount(BigNumber.from('0'));
      if(buttonActive) setButtonActive(false);
    }else{
      let newAmount
      try{
        newAmount = ethers.utils.parseUnits(amount, 'ether');
      }catch{
        setUnderlyingAmount(BigNumber.from('0'));
        if(!error) setError(true);
        if(buttonActive) setButtonActive(false);
        return;
      }
      setUnderlyingAmount(newAmount);
      if(error) setError(false);
      if(!buttonActive) setButtonActive(true);
    }

  }, [amount])
  
  const onClick = () => {
    if(!buttonActive) return;
    const { underlyingCollateralContract, contract, ticketContract }= pools[Number(activeItemId)];
    const underlyingAmountStr = underlyingAmount.toString()
    const params = {
      safeTxGas: 500000,
    };
    const txs = [
      {
        to: underlyingCollateralContract.address,
        value: '0',
        data: underlyingCollateralContract.interface.encodeFunctionData('approve', [contract.address, underlyingAmountStr])
      },
      {
        to: contract.address,
        value: '0',
        data: contract.interface.encodeFunctionData('depositTo', [safe.safeAddress, underlyingAmountStr, ticketContract.address, safe.safeAddress])
      }
    ];
    sdk.txs.send({txs, params});
  }



  return (
    <Wrapper>
      <FormHeaderWrapper>
        <Title size="sm" withoutMargin>
          Purchase Tickets
        </Title>
      </FormHeaderWrapper>

      <Divider />
      <Label size="lg">Select the prize pool to deposit to</Label>
      <Select
        items={selectItems}
        activeItemId={activeItemId}
        onItemClick={onSelect}
        fallbackImage="https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg"
      />
      <Divider />
      <Label size="lg">Choose the amount you want to deposit</Label>
      <TextField
        id="standard-name"
        label="Amount"
        value={amount}
        meta={error ? {error: 'Please enter a valid amount'} : {}}
        onChange={(e) => setAmount(e.target.value)}
        endAdornment={
          <Button color="secondary" size="md" onClick={() => setAmount(ethers.utils.formatEther(maxBalance))}>
            <Heading>MAX</Heading>
          </Button>
        }
      />
      <RightJustified>
        <Text size="lg">Maximum {ethers.utils.formatEther(maxBalance)} {tokenSymbol}</Text>
      </RightJustified>
      <Divider />
      <FormButtonWrapper>
        <Button color="primary" size="lg" variant="contained" onClick={onClick}>
          Deposit {tokenSymbol}
        </Button>
      </FormButtonWrapper>
    </Wrapper>
  );
};
export default Deposit;
