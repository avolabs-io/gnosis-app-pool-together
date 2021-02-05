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

const selectItems: Array<SelectItem> = [
  {
    id: '1',
    label: 'DAI',
    subLabel: 'Compound Prize Pool',
    iconUrl: 'https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg',
  },
  { id: '2', label: 'GNO', iconUrl: '' },
  { id: '3', label: 'without icon' },
];

const Deposit: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState('1');

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
        onItemClick={(id) => {
          setActiveItemId(id);
        }}
        fallbackImage=""
      />
      <Divider />
      <Label size="lg">Choose the amount you want to deposit</Label>
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
        <Text size="lg">Maximum 124.00 DAI</Text>
      </RightJustified>
      <Divider />
      <FormButtonWrapper>
        <Button color="primary" size="lg" variant="contained">
          Deposit DAI
        </Button>
      </FormButtonWrapper>
    </Wrapper>
  );
};
export default Deposit;
