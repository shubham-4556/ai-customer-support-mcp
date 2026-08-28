"use client";

import React from "react";
import { Layers, Bot, Database, Server, Cpu, ArrowRight, CheckCircle2, Shield, Network } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Model Context Protocol (MCP) Architecture</h2>
            <p className="text-xs text-slate-400">Decoupled standard for connecting AI agents to custom enterprise databases & tool servers</p>
          </div>
        </div>

        {/* Component Topology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Card 1: Web App */}
          <div className="relative glass-panel rounded-2xl p-4 border border-indigo-500/30 bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">FRONTEND</span>
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Next.js Web Client</h3>
            <p className="text-[11px] text-slate-400">React + Tailwind UI, real-time message stream & tool execution visualizer.</p>
            <div className="font-mono text-[10px] text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800">
              apps/web (Port 3000)
            </div>
          </div>

          {/* Card 2: Express API */}
          <div className="relative glass-panel rounded-2xl p-4 border border-cyan-500/30 bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">API GATEWAY</span>
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Express API</h3>
            <p className="text-[11px] text-slate-400">JWT auth middleware, rate-limiting, and REST support ticket endpoints.</p>
            <div className="font-mono text-[10px] text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800">
              apps/api (Port 5000)
            </div>
          </div>

          {/* Card 3: MCP Server */}
          <div className="relative glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">MCP ENGINE</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">MCP Tool Server</h3>
            <p className="text-[11px] text-slate-400">Registers tools (get_order, get_customer, create_ticket) & orchestrates LLM reasoning.</p>
            <div className="font-mono text-[10px] text-emerald-300 bg-slate-950 p-2 rounded border border-slate-800">
              apps/mcp
            </div>
          </div>

          {/* Card 4: Database */}
          <div className="relative glass-panel rounded-2xl p-4 border border-amber-500/30 bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">STORAGE</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">PostgreSQL DB</h3>
            <p className="text-[11px] text-slate-400">Persistent tables for users, customers, orders, and support tickets.</p>
            <div className="font-mono text-[10px] text-amber-300 bg-slate-950 p-2 rounded border border-slate-800">
              packages/db
            </div>
          </div>

        </div>

        {/* Step-by-Step Flow List */}
        <div className="space-y-3 border-t border-slate-800/80 pt-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" /> How MCP Protocol Executes Request:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">1</span>
                Tool Discovery & Prompt Analysis
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When the user enters a prompt, the AI Agent fetches registered MCP tool schemas (JSON-RPC) to evaluate if database access is needed.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-[10px] text-white">2</span>
                Secure Tool Invocation
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The agent constructs precise function arguments (e.g. <code>orderId: "ORD-8942"</code>) and passes them safely to the MCP server.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">3</span>
                Synthesized Customer Output
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tool execution results return to the LLM context, enabling it to render an accurate, real-time response with live tracking info.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
