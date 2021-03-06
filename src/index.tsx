import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme, Loader, Title } from '@gnosis.pm/safe-react-components';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';

import { EthersProvider } from './providers/ethers';
import { PoolsProvider } from './providers/pools';
import { NavigationProvider } from './providers/navigation';
import { TicketsProvider } from './providers/tickets';
import { PoolsChainProvider } from './providers/pools-chain';
import { PoolsERC20BalanceProvider } from './providers/pools-erc-balance';
import { ExchangeProvider } from './providers/exchange';
import { PrizeProvider } from './providers/prize-values';

import GlobalStyle from './GlobalStyle';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider
        loader={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      >
        <EthersProvider>
          <PoolsProvider>
            <TicketsProvider>
              <PoolsChainProvider>
                <PoolsERC20BalanceProvider>
                  <ExchangeProvider>
                    <PrizeProvider>
                      <NavigationProvider>
                        <App />
                      </NavigationProvider>
                    </PrizeProvider>
                  </ExchangeProvider>
                </PoolsERC20BalanceProvider>
              </PoolsChainProvider>
            </TicketsProvider>
          </PoolsProvider>
        </EthersProvider>
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
