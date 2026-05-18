import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { config } from './config/index.js'
import { connectDatabase } from './config/database.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import proposalsRouter from './routes/proposals.js'
import treasuryRouter from './routes/treasury.js'
import membersRouter from './routes/members.js'
import { startWebhookListener } from './services/webhookListener.js'

const app = express()

app.use(helmet())
app.use(compression())
app.use(cors({ origin: config.corsOrigins }))
app.use(morgan(config.logLevel))
app.use(express.json())

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

app.use('/api/proposals', proposalsRouter)
app.use('/api/treasury', treasuryRouter)
app.use('/api/members', membersRouter)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  await connectDatabase()
  startWebhookListener()
  app.listen(config.port, () => {
    console.log(`NexDAO backend running on :${config.port}`)
  })
}

start().catch((err) => {
  console.error('[fatal] Failed to start server:', err)
  process.exit(1)
})

export default app
