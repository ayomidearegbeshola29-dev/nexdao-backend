# NexDAO Backend

> Node.js + Express API layer for NexDAO. Bridges the frontend dashboard with Soroban governance and treasury contracts via Stellar RPC.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Stellar SDK](https://img.shields.io/badge/Stellar_SDK-12-000000?logo=stellar)](https://github.com/stellar/stellar-sdk)
[![Zod](https://img.shields.io/badge/Zod-3.22-3E67B1?logo=zod)](https://zod.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database](#database)
- [Services](#services)
- [Middleware](#middleware)
- [Soroban Integration](#soroban-integration)
- [Webhook Listener](#webhook-listener)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The NexDAO backend serves as the bridge between the frontend governance dashboard and the Stellar blockchain. It provides:

- **REST API** — CRUD operations for proposals, votes, treasury, and members
- **Soroban Integration** — Transaction building and submission to Stellar RPC
- **Database Persistence** — PostgreSQL via Prisma ORM
- **Real-time Events** — Webhook listener for on-chain events (SSE push to frontend)
- **Validation** — Request validation with Zod schemas
- **Security** — Helmet, CORS, and compression middleware

### Project Status

| Component | Status | Issue |
|-----------|--------|-------|
| Proposals API | ✅ Complete | — |
| Voting API | ✅ Complete | — |
| Treasury API | 🚧 In Progress | #2 |
| Members API | ✅ Complete | — |
| Health Check | ✅ Complete | — |
| Soroban RPC | 🚧 In Progress | #4 |
| Webhook Listener | 📋 Planned | #4 |
| SSE Push | 📋 Planned | #4 |
| Authentication | 📋 Planned | — |
| Tests | 📋 Planned | — |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Express Server                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Helmet   │  │   CORS   │  │ Morgan   │  │   Compression    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        Router                             │   │
│  │  ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │   │
│  │  │ /api/proposals  │ │ /api/treasury  │ │ /api/members │ │   │
│  │  └────────────────┘ └────────────────┘ └──────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                       Services                             │   │
│  │  ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │   │
│  │  │   governance    │ │   treasury     │ │ webhookListener│ │   │
│  │  └────────────────┘ └────────────────┘ └──────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                              │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │               Prisma ORM → PostgreSQL              │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │         Stellar SDK → Soroban RPC → Soroban       │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Frontend ──REST──►  /api/proposals  ──► govService ──► Prisma ──► PostgreSQL
                    /api/proposals/:id/vote ──► govService ──► Soroban RPC ──► Stellar
                    /api/treasury/balances ──► treasuryService ──► Prisma
                    /api/members ──► memberService ──► Prisma

webhookListener ──poll──► Soroban RPC getEvents() ──SSE──► Frontend
```

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| [Node.js](https://nodejs.org/) | Runtime | 20+ |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | 5.3+ |
| [Express](https://expressjs.com/) | Web framework | 4.18 |
| [Prisma](https://www.prisma.io/) | ORM | 5.x |
| [PostgreSQL](https://www.postgresql.org/) | Database | 16 |
| [@stellar/stellar-sdk](https://github.com/stellar/stellar-sdk) | Stellar blockchain | 12.x |
| [Zod](https://zod.dev/) | Schema validation | 3.22 |
| [Helmet](https://helmetjs.github.io/) | Security headers | 7.x |
| [Morgan](https://github.com/expressjs/morgan) | HTTP logging | 1.x |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript execution | 4.x |
| [Vitest](https://vitest.dev/) | Testing | 1.x |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm 9+ or yarn or pnpm
- A Stellar testnet account (optional for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/ayomidearegbeshola29-dev/nexdao-backend.git
cd nexdao-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL and Stellar RPC endpoint
# DATABASE_URL=postgresql://nexdao:nexdao@localhost:5432/nexdao

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# (Optional) Seed the database
npm run db:seed

# Start development server
npm run dev
```

The API will be available at [http://localhost:3001](http://localhost:3001).

### Environment Variables

```env
DATABASE_URL=postgresql://nexdao:nexdao@localhost:5432/nexdao
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK=testnet
GOVERNANCE_CONTRACT_ID=
TREASURY_CONTRACT_ID=
TOKEN_CONTRACT_ID=
FRONTEND_URL=http://localhost:3000
PORT=3001
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=dev
```

---

## Project Structure

```
nexdao-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── index.ts           # App configuration
│   │   └── database.ts       # Prisma client & connection
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling & AppError class
│   │   └── validate.ts        # Zod validation middleware
│   ├── routes/
│   │   ├── proposals.ts       # Proposal CRUD + voting
│   │   ├── treasury.ts        # Treasury balances + spending
│   │   └── members.ts         # Member directory
│   ├── services/
│   │   ├── governance.ts      # Governance contract interactions
│   │   ├── treasury.ts        # Treasury contract interactions
│   │   └── webhookListener.ts # On-chain event listener
│   ├── types/
│   │   └── schemas.ts         # Zod validation schemas
│   ├── seed.ts                # Database seed script
│   └── index.ts               # Express server entry point
├── .env.example               # Environment template
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

---

## API Reference

### Health

```
GET /healthz
```

Response:
```json
{ "ok": true, "timestamp": "2025-01-15T10:30:00.000Z" }
```

### Proposals

#### List all proposals

```
GET /api/proposals
```

Response: `Proposal[]`

#### Get proposal by ID

```
GET /api/proposals/:id
```

Response: `Proposal` (includes votes)

#### Create proposal

```
POST /api/proposals

Body:
{
  "title": "Treasury Spend: Community Grant",
  "description": "Allocate 5000 USDC for community development...",
  "proposer": "GABCDEF...",
  "quorum": "1000000",
  "deadline": "2025-02-15T00:00:00.000Z"
}
```

Response: `Proposal` (201)

#### Cast vote

```
POST /api/proposals/:id/vote

Body:
{
  "support": true,
  "signedXdr": "AAAAAgAAAQAAAQAAAAAA..."
}
```

Response:
```json
{ "success": true, "proposalId": "..." }
```

#### Get proposal votes

```
GET /api/proposals/:id/votes
```

Response: `Vote[]`

### Treasury

#### Get balances

```
GET /api/treasury/balances
```

Response:
```json
[
  { "asset": "XLM", "balance": "100000", "usdValue": "8500" },
  { "asset": "USDC", "balance": "50000", "usdValue": "50000" }
]
```

#### Create spend proposal

```
POST /api/treasury/spend

Body:
{
  "title": "Community Grant",
  "description": "Funding for developer workshop",
  "recipient": "GXYZ...",
  "amount": "5000",
  "asset": "USDC"
}
```

### Members

#### List members

```
GET /api/members
```

#### Get member by address

```
GET /api/members/:address
```

---

## Database

### Schema

```prisma
model Proposal {
  id          String          @id @default(cuid())
  title       String
  description String
  proposer    String
  status      ProposalStatus  @default(active)
  votesFor    BigInt          @default(0)
  votesAgainst BigInt         @default(0)
  quorum      BigInt
  deadline    DateTime
  createdAt   DateTime        @default(now())
  votes       Vote[]
}

model Vote {
  id          String   @id @default(cuid())
  proposalId  String
  voter       String
  support     Boolean
  weight      BigInt
  timestamp   DateTime @default(now())
  proposal    Proposal @relation(fields: [proposalId], references: [id])
  @@unique([proposalId, voter])
}

model Member {
  id          String    @id @default(cuid())
  address     String    @unique
  votingPower BigInt    @default(0)
  proposalsCreated Int  @default(0)
  votesCast   Int       @default(0)
  joinedAt    DateTime  @default(now())
}

model TreasuryBalance {
  id      String  @id @default(cuid())
  asset   String  @unique
  balance BigInt  @default(0)
  usdValue Float   @default(0)
}

enum ProposalStatus { active, passed, rejected, executed }
```

### Migrations

```bash
# Push schema to database (dev)
npx prisma db push

# Create a migration
npx prisma migrate dev --name add_proposal_model

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

---

## Services

### Governance Service

The governance service handles all proposal and voting logic:

- **listProposals** — Fetch all proposals from PostgreSQL
- **getProposal** — Fetch single proposal with votes
- **createProposal** — Create new governance proposal
- **submitVote** — Submit a vote (stores in DB and submits to Soroban RPC)
- **getProposalVotes** — Fetch all votes for a proposal

### Treasury Service

The treasury service manages DAO funds:

- **getBalances** — Fetch current treasury balances
- **createSpendProposal** — Create a treasury spend proposal

### Webhook Listener

Listens for on-chain events from the Soroban governance contract and pushes real-time updates to connected frontend clients via SSE.

---

## Middleware

| Middleware | Purpose |
|------------|---------|
| `helmet` | Security headers (XSS, content-type sniffing, etc.) |
| `cors` | Cross-Origin Resource Sharing configuration |
| `compression` | Gzip/brotli response compression |
| `morgan` | HTTP request logging |
| `errorHandler` | Centralized error handling with AppError class |
| `validate` | Zod schema validation for request body/query/params |

---

## Soroban Integration

The backend integrates with Stellar's Soroban smart contracts platform:

### Current Implementation

- Stellar SDK Server initialized from environment config
- Transaction submission via `rpc.submitTransaction()`
- Mock mode enabled when contract IDs are not configured

### Planned Implementation (Wave #4)

- **getContractData** — Read proposal state from governance contract
- **getEvents** — Poll Soroban RPC for on-chain events
- **SSE Push** — Real-time vote and proposal updates to frontend

```typescript
import { Server } from '@stellar/stellar-sdk'

const rpc = new Server('https://soroban-testnet.stellar.org')

// Submit a pre-signed transaction
const result = await rpc.submitTransaction(signedXdr)
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npx vitest

# Run linting
npm run lint
```

Test examples (coming soon):

```typescript
import { describe, it, expect } from 'vitest'
import { govService } from './services/governance'

describe('governance service', () => {
  it('should list proposals', async () => {
    const proposals = await govService.listProposals()
    expect(Array.isArray(proposals)).toBe(true)
  })
})
```

---

## Deployment

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Manual

```bash
# Build
npm run build

# Start production server
npm start
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/ayomidearegbeshola29-dev/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/ayomidearegbeshola29-dev/.github/blob/main/CODE_OF_CONDUCT.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Good First Issues

Check out our [issue tracker](https://github.com/ayomidearegbeshola29-dev/nexdao-backend/issues) for `good-first-issue` labeled tasks.

---

## License

This project is [MIT](LICENSE) licensed — the governance layer every Stellar project deserves.

---

<p align="center">
  Built with ❤️ for the Stellar ecosystem
</p>
