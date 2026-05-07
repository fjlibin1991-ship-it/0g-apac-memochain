# 0G APAC Hackathon — Emerging Tech Track

## Project Name

**MemoChain** — Long-Context AI Research Assistant with Persistent Memory on 0G

## 1. Concept & Vision

MemoChain is an AI research companion that never forgets. Unlike ChatGPT sessions that reset every conversation, MemoChain maintains a **persistent memory** across all research sessions, built on 0G's upcoming Persistent Memory system + Agent ID. Every paper you read, note you take, and question you ask becomes a permanent, queryable knowledge unit stored on 0G. The AI agent evolves with you — learning your research interests, remembering where you left off, and connecting ideas across months of work. Research sessions can be shared via token-gated Agent ID, enabling collaborative research with persistent shared context.

## 2. Problem Statement

Researchers read hundreds of papers across months or years. Current tools (Zotero, Notion, ChatGPT) treat each session as fresh — they cannot remember that "you read the attention mechanism paper in January 2025 and concluded X." Long-context windows are expensive and forget everything after the context window fills. There is no persistent, personal research memory that travels with the researcher.

## 3. Solution

- **Persistent Memory (0G Persistent Memory)**: Research session state (papers read, notes, questions, conclusions) stored permanently on 0G. The AI agent loads this context on every session — truly continuous intelligence.
- **Agent ID for Researcher**: The researcher's identity, reading history, expertise profile, and research trajectory stored as an 0G Agent ID — tokenized, exportable, shareable.
- **Paper Analysis (0G Compute Network)**: Upload a paper PDF; the Compute Network runs an LLM to extract key claims, methodology, and relevance to your research interests.
- **Knowledge Graph (0G Storage KV)**: Papers, notes, and ideas indexed as nodes in a personal knowledge graph — queryable in milliseconds.
- **Cross-Session Context**: Ask "what was my conclusion about scaling laws after reading the Chinchilla paper?" and the agent retrieves your exact notes from months ago.
- **Collaborative Research**: Share your Agent ID (or a subset) with collaborators — they inherit your research context without revealing everything.

## 4. Technical Architecture

```
Researcher (Web / Desktop App)
  └─> MemoChain Research Agent
        ├─> Smart Contracts — researcher identity, collaborative access control
        ├─> 0G Persistent Memory (coming soon) — persistent cross-session state
        ├─> 0G Storage (KV) — knowledge graph (papers, notes, ideas)
        ├─> 0G Storage (Log) — immutable research session history
        ├─> 0G Compute Network — paper analysis, note synthesis, Q&A inference
        ├─> 0G Agent ID — researcher identity, expertise profile, collaboration tokens
        └─> Privacy & Security (TEE) — verified computation on private research notes

Web3 Researchers (Collaborative Mode)
  └─> Shared Agent ID subspace — cross-team research context
```

## 5. Tech Stack

- Frontend: React + TypeScript + Tailwind
- Backend: Next.js API routes
- PDF Processing: marker-pdf / pdf-parse
- 0G Modules: Storage SDK, Compute Network, Agent ID, Persistent Memory (when available)
- Smart Contracts: Solidity (researcher ID + access control)

## 6. 0G Components Used

- [x] Agent ID — researcher identity and collaborative access
- [x] 0G Storage (KV) — knowledge graph (millisecond query)
- [x] 0G Storage (Log) — immutable research session history
- [x] Compute Network — paper analysis and Q&A inference
- [x] Persistent Memory (coming soon) — cross-session AI memory

## 7. Key Features

1. Upload PDF papers → AI extracts key claims, methodology, relevance score
2. Ask questions about your research corpus — agent answers with citations
3. Persistent memory: AI remembers papers read and conclusions drawn months ago
4. Personal knowledge graph: papers and notes connected by concept
5. Researcher Agent ID: tokenized research identity, exportable to other apps
6. Collaborative research mode: share context subset with teammates via Agent ID subspace
7. Verifiable citations: every AI claim linked to specific paper + your notes on 0G Log

## 8. Submission Requirements

- [x] Project name, description, repo link
- [x] Smart contract deployed (researcher identity + access control)
- [x] 0G Storage integration proof (knowledge graph + session history on 0G)
- [x] Demo video showing paper upload + persistent Q&A
- [x] README with setup/run instructions

## 9. Team

- Builder: 小风
