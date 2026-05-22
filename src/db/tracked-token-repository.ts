import { db } from "./client.js";

export type TrackedToken = {
  address: string;
  symbol: string;
  decimals: number;
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