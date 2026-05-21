import { db } from "./client.js";

export const initDb = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS erc20_transfers (
      id SERIAL PRIMARY KEY,
      transaction_hash TEXT NOT NULL,
      block_number INTEGER NOT NULL,
      token_address TEXT NOT NULL,
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      amount_raw TEXT NOT NULL,
      amount_formatted TEXT NOT NULL,
      symbol TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};