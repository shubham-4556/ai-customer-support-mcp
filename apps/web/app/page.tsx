"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { AgentChat } from "../components/AgentChat";
import { TicketManager } from "../components/TicketManager";
import { McpConsole } from "../components/McpConsole";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { Footer } from "../components/Footer";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agent" | "tickets" | "mcp" | "architecture">("agent");
  const [openTicketsCount, setOpenTicketsCount] = useState(1);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openTicketsCount={openTicketsCount}
        />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
          
          {/* Top Hero Banner */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Next-Gen Customer Operations Platform
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Autonomous AI Customer Support <br className="hidden sm:inline" />
                  <span className="gradient-text">Powered by Model Context Protocol</span>
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Seamlessly connect LLMs to real-time PostgreSQL database tools, order tracking, and support ticketing using standardized MCP protocol agents.
                </p>
              </div>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 shadow-md">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Real-time MCP Tool Tracing</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>PostgreSQL Database Auth</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 shadow-md">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Automated Support Ticketing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tab Component Render */}
          <div className="transition-all duration-300">
            {activeTab === "agent" && <AgentChat />}
            {activeTab === "tickets" && <TicketManager onTicketCountChange={setOpenTicketsCount} />}
            {activeTab === "mcp" && <McpConsole />}
            {activeTab === "architecture" && <ArchitectureDiagram />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}