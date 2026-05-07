/**
 * MemoChain AI Agent — Research Q&A with persistent memory
 * Uses 0G Compute Network for:
 *   - Paper analysis (key claims, methodology extraction)
 *   - Research Q&A with citations
 *   - Note synthesis and knowledge graph linking
 */

import { ComputeClient } from "@0g/compute-sdk";
import { getSessionHistory } from "./0g";
import type { SessionEvent } from "./0g";

const COMPUTE_RPC = process.env.NEXT_PUBLIC_0G_COMPUTE_RPC || "https://compute-testnet.0g.ai";

export interface PaperAnalysis {
  title: string;
  authors: string[];
  keyClaims: string[];
  methodology: string;
  limitations: string[];
  relevanceToInterests: string[];  // which of the researcher's interests this paper addresses
}

export interface Answer {
  text: string;
  citations: { paperId: string; title: string; excerpt: string }[];
  confidence: number;  // 0-1
}

/**
 * Analyze a paper PDF text and extract structured information
 */
export async function analyzePaper(
  paperText: string,
  title: string,
  researchInterests: string[]
): Promise<PaperAnalysis> {
  const client = new ComputeClient(COMPUTE_RPC);

  const prompt = `
You are a research paper analyzer for MemoChain.

Paper Title: ${title}
Researcher Interests: ${researchInterests.join(", ")}

Analyze this paper and return a JSON object with:
{
  "authors": ["author list"],
  "keyClaims": ["claim 1", "claim 2", ...],  // 3-5 main claims
  "methodology": "one sentence description of the method used",
  "limitations": ["limitation 1", "limitation 2"],
  "relevanceToInterests": ["which research interests this addresses"]
}

Paper content (first 4000 chars):
${paperText.slice(0, 4000)}

Return ONLY valid JSON, no markdown.
`.trim();

  try {
    const response = await client.inference({
      model: "paper-analyzer-v1",
      prompt,
      max_tokens: 1024,
    });
    const text = response.choices?.[0]?.text || response.text || "{}";
    return JSON.parse(text.trim()) as PaperAnalysis;
  } catch {
    return {
      authors: [],
      keyClaims: [],
      methodology: "Unknown",
      limitations: [],
      relevanceToInterests: [],
    };
  }
}

/**
 * Answer a research question using the researcher's full session history + paper corpus
 */
export async function answerResearchQuestion(
  researcherId: string,
  question: string,
  paperCorpus: { id: string; title: string; abstract: string; keyClaims: string[] }[]
): Promise<Answer> {
  const client = new ComputeClient(COMPUTE_RPC);

  // Load session history from 0G Log for persistent context
  const history = await getSessionHistory(researcherId, undefined, 50);
  const historySummary = history
    .slice(-10)
    .map((e: SessionEvent) => `[${e.type}]: ${JSON.stringify(e.payload).slice(0, 100)}`)
    .join("\n");

  const corpusContext = paperCorpus
    .map((p) => `Paper: ${p.title}\nAbstract: ${p.abstract}\nKey Claims: ${p.keyClaims.join("; ")}`)
    .join("\n---\n");

  const prompt = `
You are MemoChain, an AI research assistant with persistent memory.

RESEARCHER'S SESSION HISTORY (recent):
${historySummary || "(no history yet)"}

PAPER CORPUS:
${corpusContext || "(no papers uploaded yet)"}

QUESTION: ${question}

Answer the question using the paper corpus. For each claim, cite the specific paper.
If the corpus doesn't contain enough information, say "I don't have enough information in your corpus to answer this."

Return JSON:
{
  "text": "your answer in 2-4 sentences",
  "citations": [{"paperId": "...", "title": "...", "excerpt": "relevant sentence from paper"}],
  "confidence": 0.0-1.0
}

Return ONLY valid JSON.
`.trim();

  try {
    const response = await client.inference({
      model: "research-assistant-v1",
      prompt,
      max_tokens: 768,
    });
    const text = response.choices?.[0]?.text || response.text || '{"text":"Error","citations":[],"confidence":0}';
    return JSON.parse(text.trim()) as Answer;
  } catch {
    return {
      text: "I encountered an error analyzing your corpus. Please try again.",
      citations: [],
      confidence: 0,
    };
  }
}

/**
 * Suggest links between notes based on shared concepts
 */
export async function suggestNoteLinks(
  noteIds: string[],
  noteContents: { id: string; content: string; tags: string[] }[]
): Promise<{ from: string; to: string; reason: string }[]> {
  const client = new ComputeClient(COMPUTE_RPC);

  const prompt = `
Given these research notes, suggest links between them based on shared concepts or themes.

Notes:
${noteContents.map((n) => `ID: ${n.id}\nContent: ${n.content}\nTags: ${n.tags.join(", ")}`).join("\n---\n")}

Return a JSON array of link suggestions:
[{"from": "noteId1", "to": "noteId2", "reason": "both discuss scaling laws in LLMs"}]

Return ONLY valid JSON, max 5 links.
`.trim();

  try {
    const response = await client.inference({
      model: "link-suggester-v1",
      prompt,
      max_tokens: 512,
    });
    const text = response.choices?.[0]?.text || response.text || "[]";
    return JSON.parse(text.trim());
  } catch {
    return [];
  }
}
