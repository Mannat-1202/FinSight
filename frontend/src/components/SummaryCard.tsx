"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color: "emerald" | "blue" | "amber" | "red" | "purple";
}

const colorMap = {
  emerald: {
    bg: "bg-[#bef264]/10",
    border: "border-[#bef264]/20 hover:border-[#bef264]/40",
    iconBg: "bg-[#bef264]/15 text-[#bef264]",
    glow: "shadow-[0_0_25px_-5px_rgba(190,242,100,0.15)]",
    badge: "bg-[#bef264]/15 text-[#bef264]",
  },
  blue: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20 hover:border-sky-500/40",
    iconBg: "bg-sky-500/15 text-sky-400",
    glow: "shadow-[0_0_25px_-5px_rgba(56,189,248,0.15)]",
    badge: "bg-sky-500/15 text-sky-400",
  },
  amber: {
    bg: "bg-[#fb923c]/10",
    border: "border-[#fb923c]/20 hover:border-[#fb923c]/40",
    iconBg: "bg-[#fb923c]/15 text-[#fb923c]",
    glow: "shadow-[0_0_25px_-5px_rgba(251,146,60,0.15)]",
    badge: "bg-[#fb923c]/15 text-[#fb923c]",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20 hover:border-red-500/40",
    iconBg: "bg-red-500/15 text-red-400",
    glow: "shadow-[0_0_25px_-5px_rgba(239,68,68,0.15)]",
    badge: "bg-red-500/15 text-red-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    iconBg: "bg-purple-500/15 text-purple-400",
    glow: "shadow-[0_0_25px_-5px_rgba(168,85,247,0.15)]",
    badge: "bg-purple-500/15 text-purple-400",
  },
};

export default function SummaryCard({ title, value, subtitle, icon: Icon, trend, color }: SummaryCardProps) {
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#121418] border border-[#21242c] p-5 transition-all duration-300 hover:-translate-y-0.5 ${c.border} ${c.glow}`}
    >
      {/* Top subtle glow bar */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2d313d] to-transparent" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {title}
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-white font-mono">{value}</p>
        </div>

        {/* Icon Pill */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg} border border-white/5`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-[#1d2027] pt-3 text-xs">
        {subtitle && <span className="text-neutral-500 font-medium">{subtitle}</span>}
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${trend >= 0 ? "text-[#bef264]" : "text-[#fb923c]"
              }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
