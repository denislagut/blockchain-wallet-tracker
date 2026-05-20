import { ethers } from "ethers";
import { provider } from "./provider.js";

const erc20TransferEventInterface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
]);

const transferTopic = ethers.id("Transfer(address,address,uint256)");

const USDC_SEPOLIA_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

export const getUsdcTransferLogs = async () => {
  const latestBlock = await provider.getBlockNumber();

  const logs = await provider.getLogs({
    address: USDC_SEPOLIA_ADDRESS,
    fromBlock: latestBlock - 5,
    toBlock: latestBlock,
    topics: [transferTopic],
  });

  return logs.map((log) => {
    const parsed = erc20TransferEventInterface.parseLog(log);

    return {
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
      tokenAddress: log.address,
      from: parsed?.args.from as string,
      to: parsed?.args.to as string,
      amountRaw: parsed?.args.amount.toString(),
      amountFormatted: ethers.formatUnits(parsed?.args.amount, 6),
      symbol: "USDC",
    };
  });
};