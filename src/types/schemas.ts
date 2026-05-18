import { z } from 'zod'

export const createProposalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  proposer: z.string().min(1),
  quorum: z.string().min(1),
  deadline: z.string().datetime(),
})

export const voteSchema = z.object({
  support: z.boolean(),
  signedXdr: z.string().min(1),
})

export const createSpendProposalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  recipient: z.string().min(1),
  amount: z.string().min(1),
  asset: z.string().min(1),
})
