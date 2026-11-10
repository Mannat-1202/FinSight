"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  LogOut,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/budgets", label: "Budgets", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between py-6 px-3">
      {/* Top: Logo & Nav */}
      <div className="flex flex-col items-center">
        {/* Official Brand Logo Icon */}
        <Link href="/dashboard" className="group mb-8 flex flex-col items-center gap-1.5">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14161b] border border-[#23262e] p-1.5 shadow-xl shadow-black/50 transition-all duration-300 group-hover:scale-105 group-hover:border-[#bef264]/40">
            <Image
              src="/logo-icon.png"
              alt="FinSight Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-[#bef264] transition-colors">
            FinSight
          </span>
        </Link>

        {/* Navigation Dock */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                title={link.label}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${isActive
                    ? "bg-white text-neutral-950 shadow-lg shadow-white/10"
                    : "text-neutral-400 hover:bg-[#1a1d24] hover:text-white"
                  }`}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />

                {/* Floating tooltip label on hover for desktop */}
                <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-lg bg-[#181a20] border border-[#262a34] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 lg:block">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Profile & Logout */}
      <div className="flex flex-col items-center gap-3">
        {user && (
          <div
            title={`${user.name} (${user.email})`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1e25] border border-[#2b2f3a] text-xs font-bold text-[#bef264]"
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <button
          onClick={() => {
            logout();
            setMobileOpen(false);
          }}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-[#141518] border border-[#252830] p-2.5 text-neutral-300 shadow-xl lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-20 transform bg-[#0d0e11] border-r border-[#1e2128] transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-2 top-3 text-neutral-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop dock sidebar */}
      <aside className="hidden lg:flex lg:w-20 lg:flex-shrink-0">
        <div className="flex w-20 flex-col border-r border-[#1a1c22] bg-[#0c0d10]">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
