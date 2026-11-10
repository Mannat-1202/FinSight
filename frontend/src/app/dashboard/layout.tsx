"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bell, Search, Sparkles, Shield, ChevronDown, CheckCircle2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [token, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!token) return null;

  return (
    <div className="flex h-screen bg-[#090a0d] text-[#f4f5f7] overflow-hidden">
      {/* Sleek dock sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operations Header Bar */}
        <header className="h-16 border-b border-[#1a1c22] bg-[#0c0d10]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30">
          <div className="flex items-center gap-5">
            <div className="relative h-9 w-32 hidden sm:block">
              <Image
                src="/logo.png"
                alt="FinSight"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>

            {/* Status Metrics Ticker */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <div className="pill-badge pill-badge-active">
              <span className="h-1.5 w-1.5 rounded-full bg-[#bef264] animate-pulse" />
              <span>AI Engine</span>
              <span className="font-semibold text-white">Online 91%</span>
            </div>

            <div className="pill-badge">
              <Shield className="h-3 w-3 text-[#fb923c]" />
              <span>Anomaly Guard</span>
              <span className="font-semibold text-white">Active</span>
            </div>

            <div className="pill-badge">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Auto-Categorize</span>
              <span className="font-semibold text-white">Enabled</span>
            </div>
          </div>
        </div>

          {/* Right Header items: Search & User Pill */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search Pill */}
            <div className="relative hidden sm:block w-64 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, budgets..."
                className="w-full rounded-full bg-[#15171c] border border-[#23262e] pl-9 pr-12 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]/30 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-[#20232a] border border-[#2b2e38] px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                ⌘K
              </span>
            </div>

            {/* Notification Bell */}
            <button
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#15171c] border border-[#23262e] text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bef264]"></span>
              </span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#20232a]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#090a0d] font-bold text-xs shadow-md">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] font-medium text-[#bef264]">Personal Tier</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto bg-[#090a0d] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
