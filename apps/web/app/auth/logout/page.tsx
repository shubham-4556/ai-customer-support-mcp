"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Loader2, LogOut } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push("/");
      router.refresh();
    };
    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] px-4">
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-[#090d16]">
              <LogOut className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Signing out...</h1>
        <p className="text-slate-400">Please wait while we log you out</p>
        <div className="mt-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      </div>
    </div>
  );
}