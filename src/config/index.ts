import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://nexdao:nexdao@localhost:5432/nexdao',
  stellarRpcUrl: process.env.STELLAR_RPC_URL ?? 'https://soroban-testnet.stellar.org',
  stellarNetwork: process.env.STELLAR_NETWORK ?? 'testnet',
  governanceContractId: process.env.GOVERNANCE_CONTRACT_ID ?? '',
  treasuryContractId: process.env.TREASURY_CONTRACT_ID ?? '',
  tokenContractId: process.env.TOKEN_CONTRACT_ID ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
  logLevel: process.env.LOG_LEVEL ?? 'dev',
}
