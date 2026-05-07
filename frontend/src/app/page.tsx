"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-violet-950 to-gray-950">
        <div className="max-w-3xl">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-5xl font-bold text-violet-400 mb-4">MemoChain</h1>
          <p className="text-xl text-gray-300 mb-2">
            AI Research Assistant with Persistent Memory
          </p>
          <p className="text-gray-500 mb-8">
            Never lose context across research sessions. Upload papers, ask questions,
            and your AI remembers everything — powered by 0G Persistent Memory.
          </p>
          {!isConnected ? (
            <div className="flex gap-3 justify-center">
              {connectors.map((c) => (
                <button
                  key={c.uid}
                  onClick={() => connect({ connector: c })}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition"
                >
                  Connect {c.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              <Link
                href="/research"
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition"
              >
                Start Researching
              </Link>
              <Link
                href="/papers"
                className="px-6 py-3 border border-violet-700 hover:border-violet-500 text-violet-400 rounded-lg font-medium transition"
              >
                My Papers
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Persistent Research Memory</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "📄",
              title: "Upload Any Paper",
              desc: "PDF analysis extracts key claims, methodology, and relevance to your interests.",
            },
            {
              icon: "💬",
              title: "Ask Anything",
              desc: "Questions answered with citations from your personal corpus — not hallucinated.",
            },
            {
              icon: "🧬",
              title: "Knowledge Graph",
              desc: "Papers and notes auto-connected by shared concepts. Never lose an idea.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-gray-950 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Built on 0G</h2>
          <p className="text-gray-400 mb-6">
            Your research context is stored permanently on 0G Persistent Memory.
            Every session, paper, and conclusion is queryable across months of work.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-violet-400 font-bold">Agent ID</div>
              <div className="text-xs text-gray-500 mt-1">Your research identity</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-violet-400 font-bold">Storage KV</div>
              <div className="text-xs text-gray-500 mt-1">Knowledge graph</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-violet-400 font-bold">Compute</div>
              <div className="text-xs text-gray-500 mt-1">AI inference</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
