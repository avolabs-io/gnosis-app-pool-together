import React, { createContext, useContext, useEffect, useState } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useNetworkProvider } from './ethers';
import { contractAddresses } from '@pooltogether/current-pool-data';
import { GetPoolsById } from '../ptGraphClient';
import PrizePoolAbi from '../abis/prize-pool';
import ERC20Abi from '../abis/erc20';
import { ethers } from 'ethers';

const PoolsContext = createContext<PoolData[]>([]);

type PoolGraphData = {
    underlyingCollateralSymbol: string;
    underlyingCollateralToken: string;
    id: string;
    contract: ethers.Contract,
}

type PoolData = {
    underlyingCollateralSymbol: string;
    underlyingCollateralToken: string;
    id: string;
    contract: ethers.Contract;
    underlyingCollateralContract: ethers.Contract;
}

export const PoolsProvider: React.FC = ({children}) => {
    const provider = useNetworkProvider();
    const [poolsData, setPoolsData] = useState<PoolData[]>([]);

    useEffect(() => {
        (async () => {
            console.log('hey!');
            const network = await provider.getNetwork();
            const addresses = contractAddresses[network.chainId.toString()];
            console.log(network.chainId.toString());
            const poolAddresses = Object.keys(addresses)
            .filter(x => !!addresses[x].prizePool)
            .map(x => addresses[x].prizePool.toLowerCase());
            const updatePoolGraphData = async () => {
                const queryResult = await GetPoolsById(poolAddresses);
                const queryArr: PoolGraphData[] = queryResult.prizePools;
                console.log(queryResult);
                const p = queryArr.map(result => ({
                    ...result,
                    contract: new ethers.Contract(result.id, PrizePoolAbi, provider),
                    underlyingCollateralContract: new ethers.Contract(result.underlyingCollateralToken, ERC20Abi, provider)
                }))
                setPoolsData(p);
            }
            updatePoolGraphData();
        })();
    }, [provider]);

    return <PoolsContext.Provider value={poolsData}>{children}</PoolsContext.Provider>;
}

export const usePoolData = () => {
    const context = useContext(PoolsContext);
    if(context === undefined){
        throw new Error('No network provider!');
    }
    return context;
}