import { prisma } from '../config/database.js'
import { Server } from '@stellar/stellar-sdk'
import { config } from '../config/index.js'

const rpc = new Server(config.stellarRpcUrl)

export const treasuryService = {
  async getBalances() {
    const balances = await prisma.treasuryBalance.findMany()
    if (balances.length === 0) {
      return [
        { asset: 'XLM', balance: '0', usdValue: '0' },
        { asset: 'USDC', balance: '0', usdValue: '0' },
      ]
    }
    return balances.map((b) => ({
      asset: b.asset,
      balance: b.balance.toString(),
      usdValue: b.usdValue.toString(),
    }))
  },

  async createSpendProposal(data: {
    title: string
    description: string
    recipient: string
    amount: string
    asset: string
  }) {
    console.log('[treasury] Spend proposal:', data)
    return { success: true, message: 'Spend proposal created (mock)' }
  },
}
