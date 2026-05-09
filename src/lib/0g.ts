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
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const key = `${PAPER_PREFIX}${paper.id}`;
    await client.set({ key, value: JSON.stringify(paper) });
    return key;
  } catch (err) {
    console.error("[0G] uploadPaper failed:", err);
    throw new Error(`Failed to upload paper: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

export async function getPaper(paperId: string): Promise<PaperNode | null> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const result = await client.get(`${PAPER_PREFIX}${paperId}`);
    if (!result || !result.value) return null;
    return JSON.parse(result.value) as PaperNode;
  } catch (err) {
    console.error("[0G] getPaper failed:", err);
    return null;
  }
}

export async function searchPapersByInterest(interests: string[]): Promise<PaperNode[]> {
  try {
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
  } catch (err) {
    console.error("[0G] searchPapersByInterest failed:", err);
    return [];
  }
}

export async function saveNote(note: NoteNode): Promise<string> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const key = `${NOTE_PREFIX}${note.id}`;
    await client.set({ key, value: JSON.stringify(note) });
    return key;
  } catch (err) {
    console.error("[0G] saveNote failed:", err);
    throw new Error(`Failed to save note: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

export async function getNote(noteId: string): Promise<NoteNode | null> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const result = await client.get(`${NOTE_PREFIX}${noteId}`);
    if (!result || !result.value) return null;
    return JSON.parse(result.value) as NoteNode;
  } catch (err) {
    console.error("[0G] getNote failed:", err);
    return null;
  }
}

export async function getResearcherNotes(researcherId: string): Promise<NoteNode[]> {
  try {
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
  } catch (err) {
    console.error("[0G] getResearcherNotes failed:", err);
    return [];
  }
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
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    await client.append(SESSION_LOG_KEY, JSON.stringify(event));
  } catch (err) {
    console.error("[0G] appendSessionEvent failed:", err);
    // Session events are non-critical - swallow errors to avoid breaking research flow
  }
}

export async function getSessionHistory(
  researcherId: string,
  since?: number,
  limit = 100
): Promise<SessionEvent[]> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const entries = await client.readLog(SESSION_LOG_KEY, limit);
    let events = entries.map((e: string) => JSON.parse(e) as SessionEvent);
    events = events.filter((e) => e.researcherId === researcherId);
    if (since) events = events.filter((e) => e.timestamp >= since);
    return events.sort((a, b) => a.timestamp - b.timestamp);
  } catch (err) {
    console.error("[0G] getSessionHistory failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Cross-Session Persistent Memory (KV Layer — researcher long-term profile)
// ---------------------------------------------------------------------------

export interface ResearcherProfile {
  researcherId: string;
  interests: string[];          // research interests for corpus filtering
  lastSeen: number;
  papersIndexed: number;
  totalQuestions: number;
  topCitations: string[];       // most-cited paper IDs across sessions
}

const PROFILE_PREFIX = "memochain:profile:";

export async function getOrCreateProfile(researcherId: string): Promise<ResearcherProfile> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    const key = `${PROFILE_PREFIX}${researcherId}`;
    const result = await client.get(key);
    if (result?.value) {
      return JSON.parse(result.value) as ResearcherProfile;
    }
    // First time — create default profile
    const profile: ResearcherProfile = {
      researcherId,
      interests: ["AI", "machine learning", "LLM"],
      lastSeen: Date.now(),
      papersIndexed: 0,
      totalQuestions: 0,
      topCitations: [],
    };
    await client.set({ key, value: JSON.stringify(profile) });
    return profile;
  } catch (err) {
    console.error("[0G] getOrCreateProfile failed:", err);
    // Return a fallback profile to avoid breaking the research flow
    return {
      researcherId,
      interests: ["AI", "machine learning", "LLM"],
      lastSeen: Date.now(),
      papersIndexed: 0,
      totalQuestions: 0,
      topCitations: [],
    };
  }
}

export async function updateProfile(profile: ResearcherProfile): Promise<void> {
  try {
    const client = new StorageClient(STORAGE_RPC, STORAGE_CONTRACT);
    profile.lastSeen = Date.now();
    await client.set({ key: `${PROFILE_PREFIX}${profile.researcherId}`, value: JSON.stringify(profile) });
  } catch (err) {
    console.error("[0G] updateProfile failed:", err);
  }
}

export async function recordQuestionAsked(
  researcherId: string,
  citedPaperIds: string[]
): Promise<void> {
  try {
    const profile = await getOrCreateProfile(researcherId);
    profile.totalQuestions++;
    // Update top citations (simple frequency count)
    for (const pid of citedPaperIds) {
      if (!profile.topCitations.includes(pid)) {
        profile.topCitations.push(pid);
      }
    }
    if (profile.topCitations.length > 10) {
      profile.topCitations = profile.topCitations.slice(-10);
    }
    await updateProfile(profile);
  } catch (err) {
    console.error("[0G] recordQuestionAsked failed:", err);
  }
}
