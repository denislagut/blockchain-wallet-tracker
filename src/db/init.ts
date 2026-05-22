import { db } from "./client.js";

export const initDb = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS erc20_transfers (
      id SERIAL PRIMARY KEY,
      transaction_hash TEXT NOT NULL,
      log_index INTEGER NOT NULL DEFAULT 0,
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

  await db.query(`
    CREATE TABLE IF NOT EXISTS indexer_state (
      indexer_name TEXT PRIMARY KEY,
      last_processed_block INTEGER NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS tracked_tokens (
      address TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      decimals INTEGER NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};