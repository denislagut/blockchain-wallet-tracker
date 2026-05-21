import { db } from "./client.js";

export const getLastProcessedBlock = async (indexerName: string) => {
  const result = await db.query(
    `
      SELECT last_processed_block
      FROM indexer_state
      WHERE indexer_name = $1
    `,
    [indexerName],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].last_processed_block as number;
};

export const saveLastProcessedBlock = async (
  indexerName: string,
  blockNumber: number,
) => {
  await db.query(
    `
      INSERT INTO indexer_state (
        indexer_name,
        last_processed_block
      )
      VALUES ($1, $2)

      ON CONFLICT(indexer_name)
      DO UPDATE SET
        last_processed_block = EXCLUDED.last_processed_block,
        updated_at = NOW()
    `,
    [indexerName, blockNumber],
  );
};