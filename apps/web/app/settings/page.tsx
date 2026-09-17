"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Profile updated successfully (demo only)" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setMessage({ type: "success", text: "Password changed successfully (demo only)" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          activeTab="agent"
          setActiveTab={() => {}}
          openTicketsCount={0}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <nav className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === "profile"
                      ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === "security"
                      ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  Security
                </button>
              </nav>
            </aside>

            <div className="lg:col-span-3">
              {message && (
                <div className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
                  message.type === "success"
                    ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-950/60 border border-red-500/30 text-red-400"
                }`}>
                  {message.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              )}

              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 max-w-xl">
                  <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:from-indigo-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#090d16] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handlePasswordChange} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 max-w-xl">
                  <h2 className="text-lg font-semibold text-white">Change Password</h2>
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:from-indigo-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#090d16] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Update Password
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}