import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoChain — AI Research Assistant with Persistent Memory",
  description: "Never lose context across research sessions. Powered by 0G Persistent Memory.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
