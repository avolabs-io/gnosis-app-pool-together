import React, { useCallback, useState } from 'react';
import { Tab } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Pools, Deposit, Withdraw } from './pages';
import { TabItem } from './types';

const pageTabItems: TabItem[] = [
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
      <Tab selectedTab={selected} variant="outlined" items={pageTabItems} onChange={(x) => setSelected(x)} fullWidth />
      {selected === '0' && <Pools />}
      {selected === '1' && <Deposit />}
      {selected === '2' && <Withdraw />}
    </>
  );
};

export default App;
