import React from 'react';
import { Tab } from '@gnosis.pm/safe-react-components';
import { useNavigation } from './providers/navigation';
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
  const { navigation, setNavigation } = useNavigation();

  const { selectedPage, initiallySelectedPool } = navigation;
  const setSelectedPage = (page: string) => {
    setNavigation({
      initiallySelectedPool,
      selectedPage: page,
    });
  };
  return (
    <>
      <Tab
        selectedTab={selectedPage}
        variant="outlined"
        items={pageTabItems}
        onChange={(x) => setSelectedPage(x)}
        fullWidth
      />
      {selectedPage === '0' && <Pools />}
      {selectedPage === '1' && <Deposit />}
      {selectedPage === '2' && <Withdraw />}
    </>
  );
};

export default App;
