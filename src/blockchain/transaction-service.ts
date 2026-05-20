import { ethers } from "ethers";
import { provider } from "./provider.js";
import { decodeErc20Transfer } from "./erc20-decoder.js";

export const getTransactionInfo = async (hash: string) => {
  const transaction = await provider.getTransaction(hash);

  if (!transaction) {
    return null;
  }

  const decodedErc20Transfer = await decodeErc20Transfer(
  transaction.data,
  transaction.to,
);

const receipt = await provider.getTransactionReceipt(hash);

  return {
    hash: transaction.hash,
    blockNumber: transaction.blockNumber,
    from: transaction.from,
    to: transaction.to,
    valueWei: transaction.value.toString(),
    valueEth: ethers.formatEther(transaction.value),
    isContractCall: transaction.data !== "0x",
    data: transaction.data,
    decodedErc20Transfer,
    logs: receipt?.logs
  };
};