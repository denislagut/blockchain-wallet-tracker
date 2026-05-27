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

      console.log("ERC20 indexer result:", result);
    } catch (error) {
      console.error("ERC20 indexer failed:", error);
    } finally {
      isIndexing = false;
    }
  });
};