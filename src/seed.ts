import { prisma } from './config/database.js'

async function seed() {
  console.log('[seed] Starting database seed...')

  await prisma.treasuryBalance.createMany({
    data: [
      { asset: 'XLM', balance: BigInt(100000), usdValue: 8500 },
      { asset: 'USDC', balance: BigInt(50000), usdValue: 50000 },
      { asset: 'NEXD', balance: BigInt(1000000), usdValue: 25000 },
    ],
  })

  console.log('[seed] Treasury balances created')

  await prisma.member.createMany({
    data: [
      { address: 'GABCDEF1234567890abcdef1234567890abcdef1234', votingPower: BigInt(1000) },
      { address: 'GBCDEF1234567890abcdef1234567890abcdef12345', votingPower: BigInt(500) },
      { address: 'GCDEF1234567890abcdef1234567890abcdef123456', votingPower: BigInt(250) },
    ],
  })

  console.log('[seed] Members created')

  console.log('[seed] Database seed complete')
}

seed()
  .catch((e) => {
    console.error('[seed] Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
