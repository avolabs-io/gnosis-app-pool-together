import React, { useState } from 'react';
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

const Withdraw: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('1');

  const [hasFairnessFee, setHasFairnessFee] = useState(false);

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
        onChange={() => {}}
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
