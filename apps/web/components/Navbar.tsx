"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Cpu, Ticket, Terminal, Activity, Layers, Sparkles, LogOut, User, Settings, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavbarProps {
  activeTab: "agent" | "tickets" | "mcp" | "architecture";
  setActiveTab: (tab: "agent" | "tickets" | "mcp" | "architecture") => void;
  openTicketsCount: number;
}

export function Navbar({ activeTab, setActiveTab, openTicketsCount }: NavbarProps) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    router.refresh();
  };

  const navigation = [
    { name: "AI Assistant", href: "#", icon: Bot, tab: "agent" as const },
    { name: "Support Tickets", href: "#", icon: Ticket, tab: "tickets" as const, badge: openTicketsCount },
    { name: "MCP Tools", href: "#", icon: Terminal, tab: "mcp" as const },
    { name: "Architecture", href: "#", icon: Layers, tab: "architecture" as const },
  ];

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
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">AI Support</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  <Cpu className="w-3 h-3" /> MCP Enabled
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Model Context Protocol Engine</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.tab)}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  activeTab === item.tab
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                {item.badge && item.badge > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Side: Status + User Menu */}
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

            {/* Auth Section */}
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-sm hover:border-indigo-500/50 transition-colors"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl border border-slate-800 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-flex mt-1.5 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                        {user.role}
                      </span>
                    </div>
                    <a
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                >
                  Sign in
                </a>
                <a
                  href="/auth/login"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-cyan-400 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-xl bg-slate-900/90 border border-slate-800 p-2 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => { setActiveTab(item.tab); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === item.tab
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              <hr className="border-slate-800 my-2" />
              {user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col space-y-1">
                    <a href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/50">
                      <Settings className="w-4 h-4" />
                      Settings
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 w-full">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 pt-2 pb-4 space-y-2">
                  <a href="/auth/login" className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50">
                    Sign in
                  </a>
                  <a href="/auth/login" className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
                    <Sparkles className="w-4 h-4" />
                    Get Started
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}