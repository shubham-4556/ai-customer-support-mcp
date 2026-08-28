"use client";

import React, { useState } from "react";
import { Terminal, Play, CheckCircle2, Cpu, Code2, Clock, Wrench } from "lucide-react";

interface McpTool {
  name: string;
  description: string;
  schema: any;
  defaultParams: any;
}

const TOOLS: McpTool[] = [
  {
    name: "get_order_status",
    description: "Get the current shipping status, tracking ID, and delivery ETA for an order.",
    schema: {
      type: "object",
      properties: { orderId: { type: "string", description: "Order ID e.g. ORD-8942" } },
      required: ["orderId"],
    },
    defaultParams: { orderId: "ORD-8942" },
  },
  {
    name: "get_customer",
    description: "Find customer account profile, tier, and active ticket statistics by ID.",
    schema: {
      type: "object",
      properties: { customerId: { type: "string", description: "Customer ID e.g. cust_902" } },
      required: ["customerId"],
    },
    defaultParams: { customerId: "cust_902" },
  },
  {
    name: "create_support_ticket",
    description: "Create a support ticket in PostgreSQL database with subject, message, and priority.",
    schema: {
      type: "object",
      properties: {
        customerId: { type: "string" },
        subject: { type: "string" },
        message: { type: "string" },
      },
      required: ["customerId", "subject", "message"],
    },
    defaultParams: {
      customerId: "cust_902",
      subject: "Urgent package replacement request",
      message: "Order ORD-8942 item arrived damaged during transit.",
    },
  },
];

export function McpConsole() {
  const [selectedTool, setSelectedTool] = useState<McpTool>(TOOLS[0]);
  const [paramInput, setParamInput] = useState<string>(
    JSON.stringify(TOOLS[0].defaultParams, null, 2)
  );
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const handleSelectTool = (t: McpTool) => {
    setSelectedTool(t);
    setParamInput(JSON.stringify(t.defaultParams, null, 2));
    setExecutionResult(null);
    setLatency(null);
  };

  const handleRunTool = async () => {
    setExecuting(true);
    const start = performance.now();

    try {
      let parsedParams;
      try {
        parsedParams = JSON.parse(paramInput);
      } catch (e) {
        setExecutionResult({ error: "Invalid JSON format in parameter input" });
        setExecuting(false);
        return;
      }

      // Simulate network request to tool handler or invoke endpoint
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: selectedTool.name === "get_order_status"
            ? `Track order ${parsedParams.orderId || 'ORD-8942'}`
            : selectedTool.name === "get_customer"
            ? `Lookup customer ${parsedParams.customerId || 'cust_902'}`
            : `Create ticket for ${parsedParams.subject || 'issue'}`,
        }),
      });

      const data = await res.json();
      const end = performance.now();
      setLatency(Math.round(end - start));

      const toolResultStep = data.steps?.find((s: any) => s.type === "tool_result");
      setExecutionResult(
        toolResultStep
          ? { status: "200 OK", toolName: selectedTool.name, result: toolResultStep.result }
          : { status: "200 OK", rawOutput: data }
      );
    } catch (err: any) {
      setExecutionResult({ error: err.message || "Failed to execute tool" });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                MCP Tools Playground
              </h2>
              <p className="text-xs text-slate-400">Directly test and inspect Model Context Protocol tools & JSON schemas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            <Cpu className="w-3.5 h-3.5" /> 3 Tools Registered
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-slate-800/80 pt-6">
          {/* Tool Selector sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available MCP Tools
            </label>

            <div className="space-y-2">
              {TOOLS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleSelectTool(t)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedTool.name === t.name
                      ? "bg-indigo-600/15 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-indigo-400" /> {t.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">v1.0</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Workbench */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-sm text-slate-200">Input Parameters (JSON)</span>
              </div>

              <button
                onClick={handleRunTool}
                disabled={executing}
                className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 disabled:opacity-50 transition-all"
              >
                <Play className={`w-3.5 h-3.5 ${executing ? "animate-spin" : ""}`} />
                {executing ? "Running Tool..." : "Execute MCP Tool"}
              </button>
            </div>

            <textarea
              rows={5}
              value={paramInput}
              onChange={(e) => setParamInput(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
            />

            {/* Response Output Panel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                  Execution Output
                </span>
                {latency !== null && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3" /> {latency} ms
                  </span>
                )}
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 min-h-[160px]">
                {executionResult ? (
                  <pre className="font-mono text-xs text-emerald-300 overflow-x-auto">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-28 text-slate-600 text-xs">
                    <Terminal className="w-6 h-6 mb-2 opacity-50" />
                    Select tool and click "Execute MCP Tool" to see real-time output.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
