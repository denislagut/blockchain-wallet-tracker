import { indexRecentErc20Transfers } from "./usdc-indexer.js";
import { provider } from "./provider.js";

let isIndexing = false;
let isListening = false;
let lastBlockNumber: number | null = null;

const handleBlock = async (blockNumber: number) => {
  lastBlockNumber = blockNumber;

  if (isIndexing) {
    console.log("Indexer is already running, skip block:", blockNumber);
    return;
  }

  isIndexing = true;

  try {
    console.log("New block detected:", blockNumber);

    const result = await indexRecentErc20Transfers();

    console.log("ERC20 indexer result:", result);
  } catch (error) {
    console.error("ERC20 indexer failed:", error);
  } finally {
    isIndexing = false;
  }
};

export const startUsdcIndexerListener = () => {
  if (isListening) {
    return getUsdcIndexerListenerStatus();
  }

  provider.on("block", handleBlock);
  isListening = true;

  return getUsdcIndexerListenerStatus();
};

export const stopUsdcIndexerListener = () => {
  if (!isListening) {
    return getUsdcIndexerListenerStatus();
  }

  provider.off("block", handleBlock);
  isListening = false;

  return getUsdcIndexerListenerStatus();
};

export const getUsdcIndexerListenerStatus = () => {
  return {
    isListening,
    isIndexing,
    lastBlockNumber,
  };
};
