"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Wrench,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Package,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";

interface Step {
  type: "thought" | "tool_call" | "tool_result";
  content?: string;
  toolName?: string;
  params?: any;
  result?: any;
}

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  steps?: Step[];
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    sender: "agent",
    text: "Hello! I am your **AI Customer Support Assistant** powered by the **Model Context Protocol (MCP)**.\n\nI can check live order statuses, lookup customer accounts in PostgreSQL, and create support tickets automatically.",
    timestamp: "12:00 PM",
  },
];

const SUGGESTIONS = [
  { label: "Where is order ORD-8942?", icon: Package, prompt: "Where is my order ORD-8942?" },
  { label: "Lookup customer cust_902", icon: User, prompt: "Lookup details for customer cust_902" },
  { label: "Create urgent support ticket", icon: ShieldCheck, prompt: "Create an urgent ticket for a damaged package" },
  { label: "What is your refund policy?", icon: HelpCircle, prompt: "What is your 30-day refund policy?" },
];

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({ "m-1": true });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const agentMsgId = `agt-${Date.now()}`;

      const agentMessage: Message = {
        id: agentMsgId,
        sender: "agent",
        text: data.reply || "No response received.",
        steps: data.steps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setExpandedSteps((prev) => ({ ...prev, [agentMsgId]: true }));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          text: "⚠️ Sorry, there was an error processing your request through the MCP server connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSteps = (msgId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-6xl mx-auto w-full glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Agent Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-6 w-6" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-100 text-base">Support Assistant Agent</h2>
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                MCP Protocol Live
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous LLM agent with direct database tool execution</p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          title="Reset Conversation"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Chat
        </button>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Suggestion Cards Banner on initial chat */}
        {messages.length <= 1 && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-5 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Suggested Actions & MCP Tool Queries:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-indigo-500/40 text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                        "{item.prompt}"
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-2`}
          >
            <div className="flex items-start gap-3 max-w-[85%]">
              {msg.sender === "agent" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className="flex flex-col space-y-2">
                {/* MCP Tool Step Execution Visualizer Trace Card */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300 shadow-inner">
                    <div
                      onClick={() => toggleSteps(msg.id)}
                      className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-slate-800/80 mb-2"
                    >
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                        <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span>MCP Agent Execution Trace</span>
                        <span className="rounded bg-indigo-900/60 px-1.5 py-0.5 text-[10px] text-indigo-200 font-mono">
                          {msg.steps.filter((s) => s.type === "tool_call").length} tool call(s)
                        </span>
                      </div>
                      {expandedSteps[msg.id] ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {expandedSteps[msg.id] && (
                      <div className="space-y-2 pt-1 font-mono text-[11px]">
                        {msg.steps.map((step, idx) => (
                          <div key={idx} className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                            {step.type === "thought" && (
                              <div className="flex items-start gap-2 text-slate-300">
                                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span><strong className="text-amber-400 font-sans">Reasoning:</strong> {step.content}</span>
                              </div>
                            )}

                            {step.type === "tool_call" && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-cyan-400">
                                  <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span><strong className="font-sans text-cyan-300">Invoking Tool:</strong> <code className="text-cyan-200 font-bold">{step.toolName}</code></span>
                                </div>
                                <pre className="mt-1 rounded bg-slate-950 p-2 text-[10px] text-cyan-200/90 overflow-x-auto border border-slate-800">
                                  {JSON.stringify(step.params, null, 2)}
                                </pre>
                              </div>
                            )}

                            {step.type === "tool_result" && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span><strong className="font-sans text-emerald-300">Tool Result:</strong> <code className="text-emerald-200">{step.toolName}</code></span>
                                </div>
                                <pre className="mt-1 rounded bg-slate-950 p-2 text-[10px] text-emerald-200/90 overflow-x-auto border border-slate-800">
                                  {JSON.stringify(step.result, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                <span className="text-[10px] text-slate-500 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Executing MCP Tool Routing & Reasoning...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="border-t border-slate-800 bg-slate-900/90 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Support Agent (e.g. Track order ORD-8942 or file support ticket)..."
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
