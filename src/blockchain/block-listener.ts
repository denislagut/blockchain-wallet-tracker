import { provider } from "./provider.js";

export const listenNewBlocks = () => {
    provider.on("block", async (blockNumber) => {
        const block = await provider.getBlock(blockNumber);

        console.log("New block:", {
            number: block?.number,
            hash: block?.hash,
            transactionCount: block?.transactions.length,
        });
    });
};