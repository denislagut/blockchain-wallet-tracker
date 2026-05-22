import { ethers } from "ethers";
import { provider } from "./provider.js";
import type { TrackedToken } from "../db/tracked-token-repository.js";

const erc20TransferEventInterface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
]);

const transferTopic = ethers.id("Transfer(address,address,uint256)");

export const getErc20TransferLogs = async (
  token: TrackedToken,
  fromBlock: number,
  toBlock: number,
) => {
  const logs = await provider.getLogs({
    address: token.address,
    fromBlock,
    toBlock,
    topics: [transferTopic],
  });

  return logs.map((log) => {
    const parsed = erc20TransferEventInterface.parseLog(log);

    return {
      transactionHash: log.transactionHash,
      logIndex: log.index,
      blockNumber: log.blockNumber,
      tokenAddress: log.address,
      from: parsed?.args.from as string,
      to: parsed?.args.to as string,
      amountRaw: parsed?.args.amount.toString(),
      amountFormatted: ethers.formatUnits(parsed?.args.amount, token.decimals),
      symbol: token.symbol,
    };
  });
};