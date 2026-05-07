/**
 * 0G Storage Integration — MemoChain
 * Uses 0G Storage SDK for:
 *   - KV layer: knowledge graph (papers, notes, ideas) — millisecond query
 *   - Log layer: immutable research session history
 */

import { StorageClient } from "@0g/storage-sdk";

const STORAGE_RPC = process.env.NEXT_PUBLIC_0G_STORAGE_RPC || "https://rpc-testnet.0g.ai";
const STORAGE_CONTRACT = process.env.NEXT_PUBLIC_0G_STORAGE_CONTRACT || "0x...";

// ---------------------------------------------------------------------------
// Knowledge Graph (KV Layer)
// ---------------------------------------------------------------------------

export interface PaperNode {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keyClaims: string[];
  methodology: string;
  relevanceScore?: number;  // to researcher's interests
  uploadedAt: number;
  researcherId: string;
  ipfsUri: string;  // full PDF + metadata on IPFS
}

export interface NoteNode {
  id: string;
  researcherId: string;
  paperId?: string;
  content: string;
  tags: string[];
  linkedPaperIds: string[];  // concept connections
  createdAt: number;
}

export interface KnowledgeGraph {
  papers: PaperNode[];
  notes: NoteNode[];
}

const PAPER_PREFIX = "memochain:paper:";
const NOTE_PREFIX = "memochain:note:";

export async function uploadPaper(paper: PaperNode): Promise<string> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const key = `${PAPER_PREFIX}${paper.id}`;
  await client.set({ key, value: JSON.stringify(paper) });
  return key;
}

export async function getPaper(paperId: string): Promise<PaperNode | null> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const result = await client.get(`${PAPER_PREFIX}${paperId}`);
  if (!result || !result.value) return null;
  return JSON.parse(result.value) as PaperNode;
}

export async function searchPapersByInterest(interests: string[]): Promise<PaperNode[]> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const keys = await client.keys(PAPER_PREFIX, 200);
  const results: PaperNode[] = [];
  for (const key of keys) {
    const paper = await getPaper(key.replace(PAPER_PREFIX, ""));
    if (paper) {
      const matchScore = paper.keyClaims.filter((claim) =>
        interests.some((i) => claim.toLowerCase().includes(i.toLowerCase()))
      ).length;
      if (matchScore > 0) {
        paper.relevanceScore = matchScore;
        results.push(paper);
      }
    }
  }
  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

export async function saveNote(note: NoteNode): Promise<string> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const key = `${NOTE_PREFIX}${note.id}`;
  await client.set({ key, value: JSON.stringify(note) });
  return key;
}

export async function getNote(noteId: string): Promise<NoteNode | null> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const result = await client.get(`${NOTE_PREFIX}${noteId}`);
  if (!result || !result.value) return null;
  return JSON.parse(result.value) as NoteNode;
}

export async function getResearcherNotes(researcherId: string): Promise<NoteNode[]> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const keys = await client.keys(NOTE_PREFIX, 500);
  const notes: NoteNode[] = [];
  for (const key of keys) {
    const note = await getNote(key.replace(NOTE_PREFIX, ""));
    if (note && note.researcherId === researcherId) {
      notes.push(note);
    }
  }
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

// ---------------------------------------------------------------------------
// Session History (Log Layer)
// ---------------------------------------------------------------------------

export interface SessionEvent {
  researcherId: string;
  type: "paper_upload" | "question_asked" | "note_created" | "citation_made" | "context_shared";
  payload: Record<string, unknown>;  // event-specific data
  timestamp: number;
}

const SESSION_LOG_KEY = "memochain:session_log";

export async function appendSessionEvent(event: SessionEvent): Promise<void> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  await client.append(SESSION_LOG_KEY, JSON.stringify(event));
}

export async function getSessionHistory(
  researcherId: string,
  since?: number,
  limit = 100
): Promise<SessionEvent[]> {
  const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
  const entries = await client.readLog(SESSION_LOG_KEY, limit);
  let events = entries.map((e: string) => JSON.parse(e) as SessionEvent);
  events = events.filter((e) => e.researcherId === researcherId);
  if (since) events = events.filter((e) => e.timestamp >= since);
  return events.sort((a, b) => a.timestamp - b.timestamp);
}
