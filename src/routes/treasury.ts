import { Router } from 'express'
import { treasuryService } from '../services/treasury.js'
import { validate } from '../middleware/validate.js'
import { createSpendProposalSchema } from '../types/schemas.js'

const router = Router()

router.get('/balances', async (_req, res, next) => {
  try {
    const balances = await treasuryService.getBalances()
    res.json(balances)
  } catch (err) {
    next(err)
  }
})

router.post('/spend', validate(createSpendProposalSchema), async (req, res, next) => {
  try {
    const result = await treasuryService.createSpendProposal(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
