import { Router } from 'express'
import { govService } from '../services/governance.js'
import { validate } from '../middleware/validate.js'
import { createProposalSchema, voteSchema } from '../types/schemas.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const proposals = await govService.listProposals()
    res.json(proposals)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const proposal = await govService.getProposal(req.params.id)
    if (!proposal) return res.status(404).json({ error: 'Not found' })
    res.json(proposal)
  } catch (err) {
    next(err)
  }
})

router.post('/', validate(createProposalSchema), async (req, res, next) => {
  try {
    const proposal = await govService.createProposal(req.body)
    res.status(201).json(proposal)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/vote', validate(voteSchema), async (req, res, next) => {
  const { support, signedXdr } = req.body
  try {
    const result = await govService.submitVote(req.params.id, support, signedXdr)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/votes', async (req, res, next) => {
  try {
    const votes = await govService.getProposalVotes(req.params.id)
    res.json(votes)
  } catch (err) {
    next(err)
  }
})

export default router
