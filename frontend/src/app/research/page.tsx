"use client";

import { useState, useRef } from "react";
import { analyzePaper } from "../../../../src/lib/agent";
import { uploadPaper, appendSessionEvent } from "../../../../src/lib/0g";

export default function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ text: string; citations: { paperId: string; title: string; excerpt: string }[] } | null>(null);
  const [papers, setPapers] = useState<{ id: string; title: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    // Read PDF text (simplified — real impl would use pdf-parse)
    const text = await file.text().catch(() => "Sample paper text for analysis");
    const title = file.name.replace(".pdf", "");

    try {
      const analysis = await analyzePaper(text, title, ["AI", "LLM", "machine learning"]);
      const paperId = "paper_" + Date.now();
      await uploadPaper({
        id: paperId,
        title,
        authors: analysis.authors || [],
        abstract: "",
        keyClaims: analysis.keyClaims || [],
        methodology: analysis.methodology || "",
        uploadedAt: Date.now(),
        researcherId: "0x...",
        ipfsUri: "",
      });
      await appendSessionEvent({
        researcherId: "0x...",
        type: "paper_upload",
        payload: { paperId, title, claimsCount: analysis.keyClaims?.length || 0 },
        timestamp: Date.now(),
      });
      setPapers((prev) => [...prev, { id: paperId, title }]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    // Simulate AI answer (real impl calls agent.answerResearchQuestion)
    setAnswer({
      text: `Based on your ${papers.length} uploaded paper${papers.length !== 1 ? "s" : ""}, here's my analysis of: "${question}". This conclusion draws on the key claims extracted from your corpus.`,
      citations: papers.map((p) => ({ paperId: p.id, title: p.title, excerpt: "Key claim from this paper..." })),
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex-shrink-0">
        <h2 className="text-sm font-bold text-violet-400 mb-4 uppercase tracking-wider">Papers ({papers.length})</h2>
        <div className="space-y-2">
          {papers.map((p) => (
            <div key={p.id} className="text-sm text-gray-300 bg-gray-800 rounded px-3 py-2 truncate">
              📄 {p.title}
            </div>
          ))}
          {papers.length === 0 && (
            <p className="text-xs text-gray-600">No papers yet. Upload your first paper.</p>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-4 w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:border-violet-500 hover:text-violet-400 transition disabled:opacity-50"
        >
          {uploading ? "Analyzing..." : "+ Upload PDF"}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Research Assistant</h1>

        {/* Question */}
        <div className="flex gap-3 mb-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your papers... e.g. 'What were the main conclusions about scaling laws?'"
            rows={2}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition self-end"
          >
            Ask
          </button>
        </div>

        {/* Answer */}
        {answer && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-300 leading-relaxed mb-4">{answer.text}</div>
            <div className="border-t border-gray-800 pt-4">
              <div className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Citations</div>
              {answer.citations.map((c, i) => (
                <div key={i} className="text-sm text-gray-400 mb-2">
                  <span className="text-violet-300">[{i + 1}]</span> <strong>{c.title}</strong>
                  <div className="text-xs text-gray-600 ml-4">"{c.excerpt}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context notice */}
        <div className="mt-auto pt-8 text-xs text-gray-600">
          Research context stored permanently on 0G Persistent Memory · Session {papers.length} paper{papers.length !== 1 ? "s" : ""} indexed
        </div>
      </div>
    </main>
  );
}
