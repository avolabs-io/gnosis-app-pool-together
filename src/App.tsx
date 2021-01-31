import React, { useCallback, useState } from 'react';
import { Tab, IconType } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import useFitText from 'use-fit-text';
import PoolCard from './components/PoolCard';

type Item = {
  id: string;
  icon?: keyof IconType;
  label: string;
  disabled?: boolean;
};

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

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState<string>('0');

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
      <PoolCard />
    </>
  );
};

export default App;
