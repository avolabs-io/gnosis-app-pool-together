# PoolTogether Safe App

<p align="center"><img src="public/pool-together.png" width="200px"/></p>

This Safe App brings no-loss prize games to [Gnosis Safe](https://gnosis-safe.io/) users by allowing them to use the [PoolTogether](https://docs.pooltogether.com/) protocol.

Read more about Safe Apps [here](https://docs.gnosis.io/safe/docs/sdks_safe_apps/).

## Features

Using this Safe App users can buy tickets for community approved prize pools, giving them a chance to win the weekly prize for those pools. They can also withdraw their tickets, and view the current dollar estimate of the prizes.

## Local Development

Install dependencies and start a local dev server.

```
yarn install
cp .env.sample .env
yarn start
```

Then:

- If HTTPS is used (by default enabled)
  - Open your Safe app locally (by default via https://localhost:3000/) and accept the SSL error.
- Go to Safe Multisig web interface
  - [Mainnet](https://app.gnosis-safe.io)
  - [Rinkeby](https://rinkeby.gnosis-safe.io/app)
- Create your test safe
- Go to Apps -> Manage Apps -> Add Custom App
- Paste your localhost URL, default is https://localhost:3000/
- You should see PoolTogether as a new app

## Supported Networks

Currently Rinkeby and Mainnet only. We pull in data from the PoolTogether hosted subgraphs for these networks. We use [ethers-multicall](https://github.com/cavanmflynn/ethers-multicall) for batching of RPC calls, so for now any future supported network would need to be one that has a multicall contract deployed to it.

## Dependencies

We use the following dependencies for interacting with Gnosis Safe:

- [Safe Apps SDK](https://github.com/gnosis/safe-apps-sdk)
- [safe-react-components](https://github.com/gnosis/safe-react-components)
- [safe-app-ethers-provider](https://github.com/gnosis/safe-apps-sdk/tree/master/packages/safe-apps-ethers-provider)

We use [Apollo](https://github.com/apollographql/apollo-client) for graph queries, and [ethers](https://docs.ethers.io/v5/) for RPC calls.

On the PoolTogether side we use the following dependencies:

- [current-pool-data](https://github.com/pooltogether/current-pool-data) for a list of community approved pools.
- [pooltogether-pool-contracts](https://github.com/pooltogether/pooltogether-pool-contracts) for the ABIs for the PoolTogether contracts.

We use [Chainlink](https://docs.chain.link/docs/ethereum-addresses) as our oracle for Eth to Usd prices. We use the Rinkeby and Mainnet oracles.

### Resources

- PoolTogether [subgraph](https://thegraph.com/explorer/subgraph/pooltogether/pooltogether-staging-v3_1_0)
- PoolTogether lootbox [subgraph](https://thegraph.com/explorer/subgraph/pooltogether/lootbox-v1_0_0)
- Uniswap [subgraph](https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2)
