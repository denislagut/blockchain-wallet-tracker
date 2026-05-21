import { db } from "./client.js";

type Erc20Transfer = {
  transactionHash: string;
  blockNumber: number;
  tokenAddress: string;
  from: string;
  to: string;
  amountRaw: string;
  amountFormatted: string;
  symbol: string;
};

export const saveErc20Transfer = async (transfer: Erc20Transfer) => {
  await db.query(
    `
      INSERT INTO erc20_transfers (
        transaction_hash,
        block_number,
        token_address,
        from_address,
        to_address,
        amount_raw,
        amount_formatted,
        symbol
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      transfer.transactionHash,
      transfer.blockNumber,
      transfer.tokenAddress,
      transfer.from,
      transfer.to,
      transfer.amountRaw,
      transfer.amountFormatted,
      transfer.symbol,
    ],
  );
};