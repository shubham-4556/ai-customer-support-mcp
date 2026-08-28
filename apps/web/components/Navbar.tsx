"use client";

import React from "react";
import { Bot, Cpu, Ticket, Terminal, Activity, Layers, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "agent" | "tickets" | "mcp" | "architecture";
  setActiveTab: (tab: "agent" | "tickets" | "mcp" | "architecture") => void;
  openTicketsCount: number;
}

export function Navbar({ activeTab, setActiveTab, openTicketsCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("agent")}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090d16]">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">AI Support</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  <Cpu className="w-3 h-3" /> MCP Enabled
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Model Context Protocol Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab("agent")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === "agent"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
            </button>

            <button
              onClick={() => setActiveTab("tickets")}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === "tickets"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Ticket className="w-4 h-4" />
              Support Tickets
              {openTicketsCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                  {openTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("mcp")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === "mcp"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Terminal className="w-4 h-4" />
              MCP Tools
            </button>

            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === "architecture"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              Architecture
            </button>
          </nav>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px]">MCP Server: Connected</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">v0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
