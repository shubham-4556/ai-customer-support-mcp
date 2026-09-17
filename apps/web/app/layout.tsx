import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AI Customer Support | Model Context Protocol (MCP) Dashboard",
  description: "Next-gen AI customer support platform powered by Model Context Protocol (MCP) tool routing, live ticket management, and automated resolution workflows.",
  keywords: ["AI Customer Support", "Model Context Protocol", "MCP Tools", "Next.js", "AI Agent"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Background Radial Glow Effects */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="pointer-events-none absolute top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-600/10 blur-[140px] rounded-full" />
          <div className="pointer-events-none absolute bottom-10 -right-40 w-[600px] h-[600px] bg-emerald-600/10 blur-[140px] rounded-full" />

          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}