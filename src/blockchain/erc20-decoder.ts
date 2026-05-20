import { ethers } from "ethers";
import { provider } from "./provider.js";

const erc20TransferInterface = new ethers.Interface([
  "function transfer(address to, uint256 amount)",
]);

const erc20MetadataAbi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const decodeErc20Transfer = async (
  data: string,
  tokenAddress: string | null,
) => {
  try {
    const decoded = erc20TransferInterface.parseTransaction({ data });

    if (decoded?.name !== "transfer") {
      return null;
    }

    const amount = decoded.args.amount as bigint;

    if (!tokenAddress) {
      return {
        method: decoded.name,
        to: decoded.args.to as string,
        amountRaw: amount.toString(),
        amountFormatted: null,
        symbol: null,
        decimals: null,
      };
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      erc20MetadataAbi,
      provider,
    );

    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();

    return {
      method: decoded.name,
      to: decoded.args.to as string,
      amountRaw: amount.toString(),
      amountFormatted: ethers.formatUnits(amount, decimals),
      symbol,
      decimals: Number(decimals),
    };
  } catch {
    return null;
  }
};