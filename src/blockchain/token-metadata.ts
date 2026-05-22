import { ethers } from "ethers";
import { provider } from "./provider.js";

const erc20MetadataAbi = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

export const getTokenMetadata = async (address: string) => {
  const tokenContract = new ethers.Contract(
    address,
    erc20MetadataAbi,
    provider,
  );

  const [symbol, decimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.decimals(),
  ]);

  return {
    address: address.toLowerCase(),
    symbol: String(symbol),
    decimals: Number(decimals),
  };
};