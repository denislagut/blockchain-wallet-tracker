import { provider } from "./provider.js";
import { getErc20TransferLogs } from "./erc20-events.js";
import { saveErc20Transfer } from "../db/erc20-transfer-repository.js";
import { getActiveTrackedTokens } from "../db/tracked-token-repository.js";
import {
  getLastProcessedBlock,
  saveLastProcessedBlock,
} from "../db/indexer-state-repository.js";

const INDEXER_NAME = "erc20_transfers";
const BLOCK_RANGE = 5;
const MAX_BLOCKS_PER_RUN = 100;

export const indexRecentErc20Transfers = async () => {
  const latestBlock = await provider.getBlockNumber();

  const lastProcessedBlock = await getLastProcessedBlock(INDEXER_NAME);

  const fromBlock =
    lastProcessedBlock === null
      ? Math.max(0, latestBlock - BLOCK_RANGE + 1)
      : lastProcessedBlock + 1;

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

  const tokens = await getActiveTrackedTokens();

  let totalFound = 0;

  for (const token of tokens) {
    const transfers = await getErc20TransferLogs(token, fromBlock, toBlock);

    for (const transfer of transfers) {
      await saveErc20Transfer(transfer);
    }

    totalFound += transfers.length;
  }

  await saveLastProcessedBlock(INDEXER_NAME, toBlock);

  return {
    found: totalFound,
    saved: totalFound,
    fromBlock,
    toBlock,
    latestBlock,
    tokens: tokens.length,
  };
};

export const catchUpErc20Transfers = async () => {
  const chainLatestBlock =
    await provider.getBlockNumber();

  let lastProcessedBlock =
    await getLastProcessedBlock(
      INDEXER_NAME,
    );

  let fromBlock =
    lastProcessedBlock === null
      ? Math.max(0, chainLatestBlock - BLOCK_RANGE + 1)
      : lastProcessedBlock + 1;

  const latestBlock = Math.min(
    chainLatestBlock,
    fromBlock + MAX_BLOCKS_PER_RUN - 1,
  );

  let totalFound = 0;
  let totalSaved = 0;
  let batches = 0;

  const tokens =
    await getActiveTrackedTokens();

  while (fromBlock <= latestBlock) {
    const toBlock = Math.min(
      fromBlock + BLOCK_RANGE - 1,
      latestBlock,
    );

    for (const token of tokens) {
      const transfers =
        await getErc20TransferLogs(
          token,
          fromBlock,
          toBlock,
        );

      for (const transfer of transfers) {
        await saveErc20Transfer(
          transfer,
        );
      }

      totalFound += transfers.length;
      totalSaved += transfers.length;
    }

    await saveLastProcessedBlock(
      INDEXER_NAME,
      toBlock,
    );

    batches += 1;

    fromBlock =
      toBlock + 1;
  }

  return {
    chainLatestBlock,
    latestBlock,
    maxBlocksPerRun: MAX_BLOCKS_PER_RUN,
    totalFound,
    totalSaved,
    batches,
  };
};
