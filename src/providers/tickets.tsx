import React, { createContext, useContext } from 'react';
import { useEffect } from 'react';
import { usePoolData } from './pools';
import { useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { BigNumber, constants } from 'ethers';
import throttle from 'lodash.throttle';
import { GetUserAccountBalances, UserAccount } from '../ptGraphClient';
type TicketsContextType = {
  ticketBalances: BigNumber[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshTicketBalances: any;
};

export const TicketsContext = createContext<TicketsContextType>({
  ticketBalances: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshTicketBalances: () => {},
});

export const TicketsProvider: React.FC = ({ children }) => {
  const { safe } = useSafeAppsSDK();
  const pools = usePoolData();

  const [ticketBalances, setTicketBalances] = useState<BigNumber[]>([]);

  const refreshTicketBalancesImmediately = async () => {
    const result: BigNumber[] = [];
    const r = await GetUserAccountBalances(safe.safeAddress.toLowerCase());
    if (!r.accounts || r.accounts.length == 0) return;
    const userAccount: UserAccount = r.accounts[0];
    const tokenBalances = userAccount.controlledTokenBalances;

    if (!tokenBalances || tokenBalances.length == 0) return;
    for (const pool of pools) {
      const t = tokenBalances.find((x) => x.controlledToken.id == pool.ticketAddress.toLowerCase());
      if (t) {
        const { balance } = t;
        result.push(BigNumber.from(balance));
      } else {
        result.push(constants.Zero);
      }
    }
    setTicketBalances(result);
  };

  const throttledRefresh = throttle(refreshTicketBalancesImmediately, 2000);

  const refreshTicketBalances = () => {
    if (pools.length == 0) return;
    throttledRefresh();
  };

  useEffect(() => refreshTicketBalances(), [pools]);

  return (
    <TicketsContext.Provider
      value={{
        ticketBalances,
        refreshTicketBalances,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTicketBalances = (): TicketsContextType => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
