import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('[db] Connected to PostgreSQL')
  } catch (error) {
    console.error('[db] Failed to connect:', error)
    process.exit(1)
  }
}
