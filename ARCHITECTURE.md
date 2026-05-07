# MemoChain — Long-Context AI Research Assistant with Persistent Memory on 0G

## Project Overview

MemoChain is an AI research companion that never forgets. Unlike ChatGPT sessions that reset every conversation, MemoChain maintains persistent memory across all research sessions, built on 0G's Persistent Memory system + Agent ID. Every paper read, note taken, and question asked becomes a permanent, queryable knowledge unit stored on 0G.

## Technical Architecture

```
Researcher (Web / Desktop App)
  └─> MemoChain Research Agent
        ├─> Smart Contracts — researcher identity, collaborative access control
        ├─> 0G Persistent Memory (coming soon) — persistent cross-session state
        ├─> 0G Storage (KV) — knowledge graph (papers, notes, ideas)
        ├─> 0G Storage (Log) — immutable research session history
        ├─> 0G Compute Network — paper analysis and Q&A inference
        ├─> 0G Agent ID — researcher identity, expertise profile, collaboration tokens
        └─> Privacy & Security (TEE) — verified computation on private research notes

Collaborative Mode:
Researcher A → share Agent ID subspace → Researcher B inherits shared context
```

## 0G Components Used

- [x] Agent ID — researcher identity and collaborative access
- [x] 0G Storage (KV) — knowledge graph (millisecond query)
- [x] 0G Storage (Log) — immutable research session history
- [x] Compute Network — paper analysis and Q&A inference
- [x] Persistent Memory (coming soon) — cross-session AI memory

## Tech Stack

- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend: Next.js API routes
- PDF Processing: marker-pdf / pdf-parse
- 0G: Storage SDK, Compute SDK, Agent ID, Persistent Memory (when available)
- Smart Contracts: Solidity ^0.8.20 (researcher ID + access control)

## Project Structure

```
/Volumes/libin/apac/05-emerging-tech/
├── contracts/
│   ├── ResearcherNFT.sol      # Researcher Agent ID (ERC721)
│   ├── Collaboration.sol       # Shared context access control
│   └── deploy/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx           # Landing
│   │   ├── research/          # Main research interface
│   │   ├── papers/            # Paper library
│   │   └── knowledge-graph/   # Visual knowledge graph
│   ├── package.json
│   └── ...
├── src/
│   ├── lib/
│   │   ├── 0g.ts             # 0G Storage (KV + Log) integration
│   │   ├── agent.ts          # MemoChain AI agent
│   │   ├── pdf-processor.ts  # PDF extraction
│   │   └── knowledge-graph.ts # Graph operations
│   └── ...
└── README.md
```

## Key Features

1. Upload PDF papers → AI extracts key claims, methodology, relevance
2. Ask questions about your research corpus — agent answers with citations
3. Persistent memory: AI remembers papers read and conclusions months ago
4. Personal knowledge graph: papers and notes connected by concept
5. Researcher Agent ID: tokenized research identity
6. Collaborative research: share context subset with teammates via Agent ID subspace
7. Verifiable citations: every AI claim linked to specific paper + notes on 0G Log
