import { db } from "./client.js";

export type TrackedToken = {
  address: string;
  symbol: string;
  decimals: number;
  is_active?: boolean;
  created_at?: string;
};

export const getActiveTrackedTokens = async (): Promise<TrackedToken[]> => {
  const result = await db.query(
    `
      SELECT
        address,
        symbol,
        decimals
      FROM tracked_tokens
      WHERE is_active = true
    `,
  );

  return result.rows;
};

export const getAllTrackedTokens = async (): Promise<TrackedToken[]> => {
  const result = await db.query(
    `
      SELECT
        address,
        symbol,
        decimals,
        is_active,
        created_at
      FROM tracked_tokens
      ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

export const addTrackedToken = async (token: {
  address: string;
  symbol: string;
  decimals: number;
}): Promise<TrackedToken> => {
  const result = await db.query(
    `
      INSERT INTO tracked_tokens (
        address,
        symbol,
        decimals
      )
      VALUES ($1, $2, $3)

      ON CONFLICT(address)
      DO UPDATE SET
        symbol = EXCLUDED.symbol,
        decimals = EXCLUDED.decimals,
        is_active = true

      RETURNING
        address,
        symbol,
        decimals,
        is_active,
        created_at
    `,
    [
      token.address.toLowerCase(),
      token.symbol,
      token.decimals,
    ],
  );

  return result.rows[0];
};

export const setTrackedTokenActive = async (
  address: string,
  isActive: boolean,
): Promise<TrackedToken | null> => {
  const result = await db.query(
    `
      UPDATE tracked_tokens
      SET is_active = $2
      WHERE address = $1
      RETURNING
        address,
        symbol,
        decimals,
        is_active,
        created_at
    `,
    [address.toLowerCase(), isActive],
  );

  return result.rows[0] ?? null;
};