import { ethers } from "ethers";
import Fastify from "fastify";
import { provider } from "./blockchain/provider";
import { request } from "node:http";
import { timeStamp } from "node:console";   
import { listenNewBlocks } from "./blockchain/block-listener.js";

//listenNewBlocks();

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.get("/block-number", async () => {
    const blockNumber = await provider.getBlockNumber();
    return{
        network: "sepolia",
        blockNumber,
    };
});

app.get("/block-latest", async () => {
    const latestBlockNumber = await provider.getBlockNumber();

    const block = await provider.getBlock(latestBlockNumber, true);

    return{
        number: block?.number,
        hash: block?.hash,
        timestamp: block?.timestamp,
        transactionCount: block?.transactions.length,
        transactions: block?.transactions[0],
    };
});

app.get("/block/:number", async (request) => {
    const { number } = request.params as { number:string };

    const blockNumber = Number(number);

    const block = await provider.getBlock(blockNumber, true);

    return{
        number: block?.number,
        hash: block?.hash, 
        timestamp: block?.timestamp, 
        transactionCount: block?.transactions.length,
    };
});

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);

    const firstTxHash = block?.transactions[0];

    if(!firstTxHash){
        return
    }

    const transaction = await provider.getTransaction(firstTxHash);

    console.log({
    from: transaction?.from,
    to: transaction?.to,
    value: transaction?.value.toString(),
});
});