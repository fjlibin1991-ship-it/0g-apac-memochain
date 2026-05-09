# MemoChain — AI Research Assistant with Persistent Memory on 0G

> Never lose context across research sessions. Upload papers, ask questions, build a knowledge graph — powered by 0G Persistent Memory.

**Track:** Emerging Tech  
**0G Components:** Agent ID, 0G Storage (KV + Log), Compute Network, Persistent Memory (coming soon)

## What It Does

MemoChain is an AI research companion that never forgets. Unlike ChatGPT which resets every session, MemoChain maintains a persistent memory across all your research work — stored permanently on 0G. Upload a paper and the AI extracts key claims. Ask a question and it answers with citations from your personal corpus. Your knowledge graph grows automatically.

## Architecture

```
Researcher uploads PDF
  └─> 0G Compute Network → paper analysis (key claims, methodology)
        ├─> 0G Storage KV → knowledge graph (papers, notes, concepts)
        ├─> 0G Storage Log → immutable session history
        └─> Smart Contract (0G Chain) → researcher Agent ID NFT

Researcher asks question
  └─> Load session history from 0G Storage Log (persistent memory)
        ├─> Search knowledge graph on 0G Storage KV
        └─> 0G Compute Network → answer with citations from corpus
```

## Tech Stack

- Smart Contracts: Solidity ^0.8.20 (0G EVM)
- Frontend: Next.js + React + TypeScript + Tailwind CSS + Wagmi + Viem
- PDF Processing: pdf-parse + marker-pdf
- 0G: Storage SDK, Compute SDK, Agent ID, Persistent Memory

## Key Contracts

- `ResearcherNFT.sol` — ERC721 token (Agent ID) for researcher identity
- `Collaboration.sol` — Access control for sharing research context subspaces

## Key Features

1. Upload PDF → AI extracts key claims, methodology, relevance score
2. Q&A with citations — every claim traced to a specific paper in your corpus
3. Persistent memory — AI remembers what you read and concluded months ago
4. Knowledge graph — papers and notes auto-linked by shared concepts
5. Researcher Agent ID — tokenized, portable research identity
6. Collaborative research — share context subset with teammates

## Research Assistant Flow

```
Upload PDF
  └─> pdf-parse extracts text
        └─> 0G Compute Network (AI) → extracts key claims, methodology, relevance score
              ├─> 0G Storage KV → Paper node stored (knowledge graph)
              └─> 0G Storage Log → "paper_upload" session event
                    └─> ResearcherProfile updated (papersIndexed++)

Ask Question
  └─> Load session history from 0G Storage Log
        ├─> Load papers from 0G Storage KV (personal corpus)
        └─> 0G Compute Network (AI) → answers with citations from your corpus
              └─> Response surfaced with inline citations

Result: Persistent memory across sessions — the AI remembers what you read and concluded.
```

## Collaboration Features

Researcher A can grant Researcher B read access to a subset of their knowledge graph:

```
Researcher A calls grantShare(researcherB, permissionLevel=2)
  └─> Collaboration contract stores Share{fromA, toB, level, active}
        └─> shareIndex[A][B] = shareId

Researcher B queries getPermission(A, B)
  └─> Returns permission level (0= none, 1= summaries, 2= notes, 3= full context)

Researcher A calls revokeShare(researcherB)
  └─> shares[shareId].active = false
        └─> getPermission(A, B) returns 0

Share is replaced (not duplicated) if researcher A shares again with same researcher.
```

## 0G Components

| Component | Used For |
|-----------|----------|
| **0G Storage KV** | Knowledge graph nodes (papers, notes) — millisecond query |
| **0G Storage Log** | Immutable session history — enables persistent memory across sessions |
| **0G Compute Network** | AI inference for paper analysis and Q&A with citations |
| **0G Agent ID** | ResearcherNFT — portable, tokenized research identity |

## ResearcherNFT for Reputation

The ResearcherNFT (Agent ID) serves as the researcher's on-chain identity:
- ERC721 token representing the researcher's Agent ID
- Tracks papers indexed and questions asked
- Portable reputation that travels with the researcher across applications
- Enables collaborative research via Collaboration.sol

## Demo Flow

```
1. Connect wallet → ResearcherNFT minted as Agent ID
2. Upload PDF → AI extracts key claims → stored on 0G Storage KV
3. Ask question → AI answers with citations from your personal corpus
4. Build knowledge graph → papers and notes auto-linked by shared concepts
5. Share with collaborator → grantShare creates a read-only subspace
6. Session history persists → next session AI remembers everything
```

## Setup

```bash
cd frontend
npm install
npm run dev
```

Set environment variables:
```env
NEXT_PUBLIC_0G_STORAGE_RPC=https://rpc-testnet.0g.ai
NEXT_PUBLIC_0G_COMPUTE_RPC=https://compute-testnet.0g.ai
```

## 0G Integration

- **Agent ID**: ResearcherNFT is the researcher's on-chain identity
- **0G Storage KV**: Knowledge graph nodes (papers, notes) for millisecond query
- **0G Storage Log**: Immutable session history enables true persistent memory
- **0G Compute Network**: Paper analysis and Q&A inference
- **Persistent Memory (coming soon)**: Full cross-session AI memory layer

## Submission Checklist

- [x] Project description and repo
- [x] Smart contracts (ResearcherNFT, Collaboration)
- [x] 0G Storage integration (KV + Log)
- [x] 0G Agent ID integration
- [x] Frontend with research interface
- [ ] Deploy contracts to 0G testnet
- [ ] Demo video
