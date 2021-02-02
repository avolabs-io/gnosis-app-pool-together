import React, { useCallback, useState } from 'react';
import { Tab, IconType, Select, Text, TextField, Divider, Button, Title } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import useFitText from 'use-fit-text';
import styled from 'styled-components';
import media from 'styled-media-query';
import PoolCard, { PoolCardProps } from './components/PoolCard';

type Item = {
  id: string;
  icon?: keyof IconType;
  label: string;
  disabled?: boolean;
};

const cards: PoolCardProps[] = [
  {
    tokenImageUrl: 'https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg',
    tokenSymbol: 'DAI',
    prizeValue: '4,255',
    userBalance: '23.50',
    countdown: {
      days: 4,
      hours: 3,
      minutes: 7,
    },
  },
  {
    tokenImageUrl: 'https://app.pooltogether.com/_next/static/images/token-uni-451e466d1b684adf13ce4990aee5b04b.png',
    tokenSymbol: 'UNI',
    prizeValue: '1,052',
    userBalance: '0.00',
    countdown: {
      days: 4,
      hours: 3,
      minutes: 7,
    },
  },
  {
    tokenImageUrl:
      'https://app.pooltogether.com/_next/static/images/usdc-new-transparent-61b9e782ef440264b641b5723a503473.png',
    tokenSymbol: 'USDC',
    prizeValue: '1,535',
    userBalance: '137.00',
    countdown: {
      days: 0,
      hours: 10,
      minutes: 8,
    },
  },
];

const items: Item[] = [
  {
    id: '0',
    icon: 'rocket',
    label: 'Pools',
  },
  {
    id: '1',
    icon: 'received',
    label: 'Deposit',
  },
  {
    id: '2',
    icon: 'sent',
    label: 'Withdraw',
  },
];

type SelectItem = {
  id: string;
  label: string;
  subLabel?: string;
  iconUrl?: string;
};
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

const Wrapper = styled.div`
  max-width: 750px;
  min-width: 150px;
  margin-top: 45px;
  margin-left: auto;
  margin-right: auto;
  font-family: Averta, Roboto;
`;

const CardHeading = styled.h4`
  font-size: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 auto 0;
  ${media.lessThan('small')`
  font-size:0.8rem;
  `}
`;
const Label = styled(Text)`
  margin-bottom: 16px;
`;

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState<string>('0');

  const [activeItemId, setActiveItemId] = useState('1');

  const submitTx = useCallback(async () => {
    setSubmitting(true);
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
            data: '0x',
          },
        ],
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  }, [safe, sdk]);

  return (
    <>
      <Tab selectedTab={selected} variant="outlined" items={items} onChange={(x) => setSelected(x)} fullWidth />
      {selected === '0' && cards.map((val) => <PoolCard key={val.prizeValue} {...val} />)}
      {selected === '1' && (
        <Wrapper>
          <div style={{ marginBottom: '24px' }}>
            <Title size="sm" withoutMargin>
              Purchase Tickets
            </Title>
          </div>

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
                <CardHeading>MAX</CardHeading>
              </Button>
            }
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginLeft: 'auto' }}>
            <Text size="lg">Maximum 124.00 DAI</Text>
          </div>
          <Divider />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '24px' }}>
            <Button color="primary" size="lg" variant="contained">
              Deposit DAI
            </Button>
          </div>
        </Wrapper>
      )}
      {selected === '2' && (
        <Wrapper>
          <div style={{ marginBottom: '24px' }}>
            <Title size="sm" withoutMargin>
              Redeem Tickets
            </Title>
          </div>

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
          <Divider />
          <Label size="lg">Choose the amount you wish to redeem</Label>
          <TextField
            id="standard-name"
            label="Amount"
            value=""
            onChange={() => {}}
            endAdornment={
              <Button color="secondary" size="md">
                <CardHeading>MAX</CardHeading>
              </Button>
            }
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginLeft: 'auto' }}>
            <Text size="lg">Maximum 23.50 DAI</Text>
          </div>
          <Divider />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '24px' }}>
            <Button color="secondary" size="lg" variant="contained">
              Withdraw DAI
            </Button>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default App;
