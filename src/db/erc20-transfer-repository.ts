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

//______________________________________________GET
export const getRecentErc20Transfers = async (limit = 50) => {
  const result = await db.query(
    `
      SELECT
        id,
        transaction_hash,
        block_number,
        token_address,
        from_address,
        to_address,
        amount_raw,
        amount_formatted,
        symbol,
        created_at
      FROM erc20_transfers
      ORDER BY block_number DESC, id DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows;
};

//______________________________________________WALLET
export const getTransfersByWallet = async (walletAddress: string, limit = 50) => {
  const normalizedAddress = walletAddress.toLowerCase();

  const result = await db.query(
    `
      SELECT
        id,
        transaction_hash,
        block_number,
        token_address,
        from_address,
        to_address,
        amount_raw,
        amount_formatted,
        symbol,
        created_at
      FROM erc20_transfers
      WHERE LOWER(from_address) = $1
         OR LOWER(to_address) = $1
      ORDER BY block_number DESC, id DESC
      LIMIT $2
    `,
    [normalizedAddress, limit],
  );

  return result.rows;
};

export const getWalletStats = async (walletAddress: string) => {
  const normalizedAddress = walletAddress.toLowerCase();

  const result = await db.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE LOWER(from_address) = $1) AS sent_count,
        COUNT(*) FILTER (WHERE LOWER(to_address) = $1) AS received_count,
        COALESCE(SUM(amount_formatted::numeric) FILTER (WHERE LOWER(from_address) = $1), 0) AS sent_amount,
        COALESCE(SUM(amount_formatted::numeric) FILTER (WHERE LOWER(to_address) = $1), 0) AS received_amount
      FROM erc20_transfers
      WHERE LOWER(from_address) = $1
         OR LOWER(to_address) = $1
    `,
    [normalizedAddress],
  );

  return result.rows[0];
};

//______________________________________________SAVE
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
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)

    ON CONFLICT(transaction_hash)
    DO NOTHING
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
    ]
    );
};