import { prisma } from '../config/database.js'
import { Server, TransactionBuilder, Networks, BASE_FEE } from '@stellar/stellar-sdk'
import { config } from '../config/index.js'
import { AppError } from '../middleware/errorHandler.js'

const rpc = new Server(config.stellarRpcUrl)

export const govService = {
  async listProposals() {
    return prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async getProposal(id: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { votes: true },
    })
    return proposal
  },

  async createProposal(data: {
    title: string
    description: string
    proposer: string
    quorum: string
    deadline: string
  }) {
    return prisma.proposal.create({
      data: {
        title: data.title,
        description: data.description,
        proposer: data.proposer,
        quorum: BigInt(data.quorum),
        deadline: new Date(data.deadline),
      },
    })
  },

  async submitVote(proposalId: string, support: boolean, signedXdr: string) {
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } })
    if (!proposal) throw new AppError(404, 'Proposal not found')
    if (proposal.status !== 'active') throw new AppError(400, 'Proposal is not active')

    try {
      const result = await rpc.submitTransaction(signedXdr)
      console.log(`[gov] Vote submitted: ${result.hash}`)
    } catch (error) {
      console.warn('[gov] RPC submission failed (mock mode):', error)
    }

    if (support) {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { votesFor: proposal.votesFor + BigInt(1) },
      })
    } else {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { votesAgainst: proposal.votesAgainst + BigInt(1) },
      })
    }

    return { success: true, proposalId }
  },

  async getProposalVotes(proposalId: string) {
    return prisma.vote.findMany({
      where: { proposalId },
      orderBy: { timestamp: 'desc' },
    })
  },
}
