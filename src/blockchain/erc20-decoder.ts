import { ethers } from "ethers";

const erc20Interface = new ethers.Interface([
  "function transfer(address to, uint256 amount)",
]);

export const decodeErc20Transfer = (data: string) => {
  try {
    const decoded = erc20Interface.parseTransaction({ data });

    if (decoded?.name !== "transfer") {
      return null;
    }

    return {
      method: decoded.name,
      to: decoded.args.to as string,
      amount: decoded.args.amount.toString(),
    };
  } catch {
    return null;
  }
};