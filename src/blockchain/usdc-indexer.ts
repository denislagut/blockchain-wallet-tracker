import { provider } from "./provider.js";
import { getUsdcTransferLogs } from "./erc20-events.js";
import { saveErc20Transfer } from "../db/erc20-transfer-repository.js";
import {
  getLastProcessedBlock,
  saveLastProcessedBlock,
} from "../db/indexer-state-repository.js";

const INDEXER_NAME = "usdc_transfers";
const BLOCK_RANGE = 5;

export const indexRecentUsdcTransfers = async () => {
  const latestBlock = await provider.getBlockNumber();

  const lastProcessedBlock = await getLastProcessedBlock(INDEXER_NAME);

  const fromBlock =
    lastProcessedBlock === null ? latestBlock - BLOCK_RANGE : lastProcessedBlock + 1;

  const toBlock = Math.min(fromBlock + BLOCK_RANGE - 1, latestBlock);

  if (fromBlock > toBlock) {
    return {
      found: 0,
      saved: 0,
      fromBlock,
      toBlock,
      latestBlock,
      message: "No new blocks to index",
    };
  }

  const transfers = await getUsdcTransferLogs(fromBlock, toBlock);

  for (const transfer of transfers) {
    await saveErc20Transfer(transfer);
  }

  await saveLastProcessedBlock(INDEXER_NAME, toBlock);

  return {
    found: transfers.length,
    saved: transfers.length,
    fromBlock,
    toBlock,
    latestBlock,
  };
};