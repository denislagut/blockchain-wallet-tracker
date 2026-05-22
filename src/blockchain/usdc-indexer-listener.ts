import { indexRecentErc20Transfers } from "./usdc-indexer.js";
import { provider } from "./provider.js";

let isIndexing = false;

export const startUsdcIndexerListener = () => {
  provider.on("block", async (blockNumber) => {
    if (isIndexing) {
      console.log("Indexer is already running, skip block:", blockNumber);
      return;
    }

    isIndexing = true;

    try {
      console.log("New block detected:", blockNumber);

      const result = await indexRecentErc20Transfers();

      console.log("USDC indexer result:", result);
    } catch (error) {
      console.error("USDC indexer failed:", error);
    } finally {
      isIndexing = false;
    }
  });
};