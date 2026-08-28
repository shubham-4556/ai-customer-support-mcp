"use client";

import React from "react";
import { Bot, Cpu, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#090d16]/90 py-6 mt-12 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">AI Customer Support + MCP</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">Next.js + TypeScript + Model Context Protocol</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" /> MCP Standard v1.0
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
