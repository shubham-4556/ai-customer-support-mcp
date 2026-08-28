"use client";

import React, { useState } from "react";
import {
  Ticket,
  Plus,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";

export interface SupportTicketItem {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

const INITIAL_TICKETS: SupportTicketItem[] = [
  {
    id: "TCK-8012",
    customerId: "cust_902",
    customerName: "Sarah Jenkins",
    subject: "Package marked delivered but not received (Order ORD-8942)",
    message: "Carrier notification says delivered yesterday at 4 PM, but parcel is missing from porch.",
    status: "open",
    priority: "high",
    createdAt: "10 mins ago",
  },
  {
    id: "TCK-7491",
    customerId: "cust_550",
    customerName: "Elena Rostova",
    subject: "Request VAT invoice for developer subscription",
    message: "Please resend tax invoice with tax ID IT-9921820.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2 hours ago",
  },
  {
    id: "TCK-6210",
    customerId: "cust_104",
    customerName: "Alex Vance",
    subject: "API Authentication key rotation assistance",
    message: "Need guidelines on rotating production secrets with zero downtime.",
    status: "resolved",
    priority: "low",
    createdAt: " Yesterday",
  },
];

export function TicketManager({ onTicketCountChange }: { onTicketCountChange?: (count: number) => void }) {
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_TICKETS);
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New ticket form states
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = filter === "all" || t.status === filter;
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const newTicket: SupportTicketItem = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "cust_902",
      customerName: "Sarah Jenkins",
      subject: newSubject.trim(),
      message: newMessage.trim(),
      status: "open",
      priority: newPriority,
      createdAt: "Just now",
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    if (onTicketCountChange) {
      onTicketCountChange(updated.filter(t => t.status === "open").length);
    }

    setNewSubject("");
    setNewMessage("");
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: "open" | "in_progress" | "resolved") => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTickets(updated);
    if (onTicketCountChange) {
      onTicketCountChange(updated.filter((t) => t.status === "open").length);
    }
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">
      {/* Top Header & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{openCount}</div>
            <div className="text-xs text-slate-400 font-medium">Open Tickets</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{inProgressCount}</div>
            <div className="text-xs text-slate-400 font-medium">In Progress</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{resolvedCount}</div>
            <div className="text-xs text-slate-400 font-medium">Resolved Tickets</div>
          </div>
        </div>
      </div>

      {/* Main Ticket Desk Controls */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-400" />
              Support Ticket Desk
            </h2>
            <p className="text-xs text-slate-400">Manage and track tickets generated by AI Agent or submitted by users</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
            {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets or customer..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Ticket Items List */}
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No tickets found matching your filter criteria.
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                      {ticket.id}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        ticket.priority === "high"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : ticket.priority === "medium"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {ticket.priority} priority
                    </span>

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3" /> {ticket.customerName} ({ticket.customerId})
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-200">{ticket.subject}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{ticket.message}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="text-[11px] text-slate-500 font-mono">{ticket.createdAt}</span>

                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value as any)}
                    className="rounded-lg bg-slate-950 border border-slate-800 text-xs px-2.5 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="open">🔴 Open</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="resolved">🟢 Resolved</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-800 p-6 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Submit New Support Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Brief description of the issue..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High / Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Provide details for customer support tier..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
