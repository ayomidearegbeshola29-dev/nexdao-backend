import { config } from '../config/index.js'

export function startWebhookListener() {
  const contractId = config.governanceContractId
  if (!contractId) {
    console.warn('[webhook] GOVERNANCE_CONTRACT_ID not set — skipping listener')
    return
  }

  console.log(`[webhook] Listening for events on contract ${contractId}`)

  // TODO: Implement SSE or WebSocket push to frontend
  // Approach:
  //   1. Poll Soroban RPC getEvents() every ~5s for new VoteEvent / ProposalCreatedEvent
  //   2. Store latest ledger cursor in memory
  //   3. Push new events to connected SSE clients
  //
  // Example event types to listen for:
  //   - { type: "proposal_created", proposal_id, title, proposer, deadline }
  //   - { type: "vote_cast", proposal_id, voter, support, weight }
  //   - { type: "proposal_executed", proposal_id, success }
}
