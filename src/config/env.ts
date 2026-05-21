import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3000,
  sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL,
  databaseUrl: process.env.DATABASE_URL
};

if (!env.sepoliaRpcUrl) {
  throw new Error("SEPOLIA_RPC_URL is not defined");
}

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}