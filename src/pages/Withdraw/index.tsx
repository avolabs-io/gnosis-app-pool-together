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

// import { contractAddresses } from '@pooltogether/current-pool-data';
import { ethers } from 'ethers';
import { daiAbi } from '../../abis/dai';
import { daiPoolAbi } from '../../abis/daiPool';

const withdrawSelectItems: Array<SelectItem> = [
  {
    id: '1',
    label: 'DAI',
    subLabel: '23.50 tickets',
    iconUrl: 'https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg',
  },
  { id: '2', label: 'GNO', iconUrl: '' },
  { id: '3', label: 'without icon' },
];

declare const window: any;

const Withdraw: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('1');

  const [hasFairnessFee, setHasFairnessFee] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const daiPoolAddress = '0x4706856FA8Bb747D50b4EF8547FE51Ab5Edc4Ac2';
    // const daiPoolAddress = contractAddresses[CHAIN_ID].dai.prizePool; //TODO improvement add typescript declerations
    const daiPoolContract = new ethers.Contract(daiPoolAddress, daiPoolAbi, provider);

    const daiPoolWithSigner = daiPoolContract.connect(signer);

    daiPoolWithSigner.liquidityCap().then((res: BigInt) => console.log(res.toString()));

    // const daiAddress = '0x04bbc998daa6eb57cf5a845805312102799a1963';

    // const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

    // console.log(daiContract.name());

    // const dai = ethers.utils.parseUnits('1.0', 18);

    // const tx = daiWithSigner.transfer('0xD2532adf827b0341031CB3C96927024C23cCE9eE', dai);

    // console.log(tx);
    // console.log(provider);
  }, []);

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
        items={withdrawSelectItems}
        activeItemId={activeItemId}
        onItemClick={(id) => {
          setActiveItemId(id);
        }}
        fallbackImage=""
      />
      {hasFairnessFee && (
        <RightJustified>
          <Text size="lg" color="error">
            By withdrawing early from this pool you will be subject to a <Link href="/poolTogether">fairness</Link> fee.
          </Text>
        </RightJustified>
      )}
      <Divider />
      <Label size="lg">Choose the amount you wish to redeem</Label>
      <TextField
        id="standard-name"
        label="Amount"
        value=""
        onChange={() => {
          () => console.log('i changed');
        }}
        endAdornment={
          <Button color="secondary" size="md">
            <Heading>MAX</Heading>
          </Button>
        }
      />
      <RightJustified>
        <Text size="lg">Maximum 23.50 DAI</Text>
      </RightJustified>
      <Divider />
      <FormButtonWrapper>
        <Button color="secondary" size="lg" variant="contained">
          Withdraw DAI
        </Button>
      </FormButtonWrapper>
    </Wrapper>
  );
};
export default Withdraw;
