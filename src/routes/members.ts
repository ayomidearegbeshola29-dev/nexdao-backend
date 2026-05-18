import { Router } from 'express'
import { prisma } from '../config/database.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { joinedAt: 'desc' },
    })
    res.json(members)
  } catch (err) {
    next(err)
  }
})

router.get('/:address', async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { address: req.params.address },
    })
    if (!member) return res.status(404).json({ error: 'Member not found' })
    res.json(member)
  } catch (err) {
    next(err)
  }
})

export default router
