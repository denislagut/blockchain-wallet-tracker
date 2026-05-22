import { ethers } from "ethers";
import Fastify from "fastify";
import { provider } from "./blockchain/provider";
import { env } from "./config/env.js"
import { request } from "node:http";
import { timeStamp } from "node:console";   

//Блокчейн
import { listenNewBlocks } from "./blockchain/block-listener.js";
import { getTransactionInfo } from "./blockchain/transaction-service.js"
import { getErc20TransferLogs } from "./blockchain/erc20-events.js";
import { indexRecentErc20Transfers, catchUpErc20Transfers } from "./blockchain/usdc-indexer.js";
import { startUsdcIndexerListener } from "./blockchain/usdc-indexer-listener.js";
import { getTokenMetadata } from "./blockchain/token-metadata.js";

//База данных
import { db } from "./db/client.js";
import { initDb } from "./db/init.js";
import {
  saveErc20Transfer,
  getRecentErc20Transfers,
  getTransfersByWallet,
  getWalletStats,
} from "./db/erc20-transfer-repository.js";
import {
  addTrackedToken,
  getAllTrackedTokens,
  setTrackedTokenActive,
} from "./db/tracked-token-repository.js";

//listenNewBlocks();

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.get("/db/health", async () => {
  const result = await db.query("SELECT NOW()");

  return {
    status: "ok",
    time: result.rows[0].now,
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

app.get("/transaction/:hash", async (request, reply) => {
  const { hash } = request.params as { hash: string };

  const transaction = await getTransactionInfo(hash);

  if (!transaction) {
    return reply.status(404).send({
      error: "Transaction not found",
    });
  }

  return transaction;
});

app.get("/transfers", async () => {
  const transfers = await getRecentErc20Transfers();

  return {
    count: transfers.length,
    transfers,
  };
});

app.get("/wallet/:address/transfers", async (request) => {
  const { address } = request.params as { address: string };

  const transfers = await getTransfersByWallet(address);

  return {
    wallet: address,
    count: transfers.length,
    transfers,
  };
});

app.get("/wallet/:address/stats", async (request) => {
  const { address } = request.params as { address: string };

  const stats = await getWalletStats(address);

  return {
    wallet: address,
    stats,
  };
});

app.post("/indexer/erc20/recent", async () => {
  const result = await indexRecentErc20Transfers();

  return {
    status: "ok",
    ...result,
  };
});

app.post("/indexer/erc20/catch-up", async () => {
  const result = await catchUpErc20Transfers();

  return {
    status: "ok",
    ...result,
  };
});


app.get("/tokens", async () => {
  const tokens = await getAllTrackedTokens();

  return {
    count: tokens.length,
    tokens,
  };
});

app.post("/tokens", async (request, reply) => {
  const body = request.body as {
    address: string;
  };

  try {
    const metadata = await getTokenMetadata(body.address);

    const token = await addTrackedToken(metadata);

    return {
      status: "ok",
      token,
    };
  } catch (error) {
    request.log.error(error);

    return reply.status(400).send({
      error: "Could not read ERC20 token metadata",
    });
  }
});

app.patch("/tokens/:address/enable", async (request, reply) => {
  const { address } = request.params as { address: string };

  const token = await setTrackedTokenActive(address, true);

  if (!token) {
    return reply.status(404).send({
      error: "Token not found",
    });
  }

  return {
    status: "ok",
    token,
  };
});

app.patch("/tokens/:address/disable", async (request, reply) => {
  const { address } = request.params as { address: string };

  const token = await setTrackedTokenActive(address, false);

  if (!token) {
    return reply.status(404).send({
      error: "Token not found",
    });
  }

  return {
    status: "ok",
    token,
  };
});

const start = async () => {
  try {
    await initDb();

    //startUsdcIndexerListener();

    await app.listen({
      port: env.port,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

// provider.on("block", async (blockNumber) => {
//   const block = await provider.getBlock(blockNumber, true);

//   const firstTxHash = block?.transactions[0];

//   if (!firstTxHash) {
//     return
//   }

//   const transaction = await provider.getTransaction(firstTxHash);

//   console.log({
//     hash: firstTxHash,
//     from: transaction?.from,
//     to: transaction?.to,
//     value: transaction?.value.toString(),
//   });
// });