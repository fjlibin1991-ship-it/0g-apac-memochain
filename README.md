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
