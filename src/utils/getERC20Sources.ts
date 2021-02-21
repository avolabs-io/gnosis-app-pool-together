import { PoolData, erc20Source } from '../providers/pools';
import { contractAddresses } from '@pooltogether/current-pool-data';
import { GetLootBoxSources, LootBoxSource } from '../ptGraphClient';
import { BigNumber } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flatten = (a: any[]) => a.reduce((a, b) => a.concat(b), []);

export const getExternalErc20Sources = (poolsGraphData: PoolData[]): erc20Source[][] =>
  poolsGraphData.map((x) =>
    x.externalErc20Awards
      .filter((x) => x.symbol !== 'PTLOOT')
      .map((x) => ({
        ...x,
        id: x.id.split('-')[1],
      })),
  );

export type lootboxErc20Balance = {
  id: string;
  decimals: string;
  symbol: string;
  balance: BigNumber;
};

export const getLootboxERC20Sources = async (
  poolsGraphData: PoolData[],
  networkId: string | number,
): Promise<lootboxErc20Balance[][]> => {
  if (!poolsGraphData || poolsGraphData.length == 0 || !contractAddresses[networkId].lootBox) return [];
  else {
    const poolTokenIds: string[][] = poolsGraphData.map((x) => flatten(x.externalErc721Awards.map((x) => x.tokenIds)));
    const queryResult = await GetLootBoxSources(
      contractAddresses[networkId].lootBox.toLowerCase(),
      flatten(poolTokenIds),
    );
    const results: LootBoxSource[] = queryResult.lootBoxes;

    return poolsGraphData.map((_x, index) => {
      let result: lootboxErc20Balance[] = [];
      poolTokenIds[index].forEach((y) => {
        const r = results.find((z) => z.tokenId == y);
        if (r && r.erc20Balances) {
          result = result.concat(
            r.erc20Balances.map((x) => ({ ...x.erc20Entity, balance: BigNumber.from(x.balance) })),
          );
        }
      });
      return result;
    });
  }
};
