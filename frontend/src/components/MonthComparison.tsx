"use client";

import React from "react";
import { MonthComparison as MonthComparisonType } from "@/lib/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthComparisonProps {
  data: MonthComparisonType;
}

export default function MonthComparison({ data }: MonthComparisonProps) {
  const isUp = data.percentageChange >= 0;

  return (
    <div className="card space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        Month-over-Month Delta
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Current Month</p>
          <p className="mt-1 text-2xl font-bold font-mono text-white">
            ₹{data.currentMonthTotal.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Previous Month</p>
          <p className="mt-1 text-2xl font-bold font-mono text-neutral-400">
            ₹{data.previousMonthTotal.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-[#1e2129]">
        {isUp ? (
          <TrendingUp className="h-5 w-5 text-rose-400" />
        ) : (
          <TrendingDown className="h-5 w-5 text-[#bef264]" />
        )}
        <span className={`text-base font-bold font-mono ${isUp ? "text-rose-400" : "text-[#bef264]"}`}>
          {isUp ? "+" : ""}
          {data.percentageChange.toFixed(1)}%
        </span>
        <span className="text-xs text-neutral-500">
          {isUp ? "higher volume" : "lower volume"}
        </span>
      </div>
      {data.categoryBreakdown.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#1e2129]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Top Categories
          </p>
          {data.categoryBreakdown.slice(0, 4).map((cat) => (
            <div key={cat.category} className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">{cat.category}</span>
              <span className="font-mono font-bold text-white">
                ₹{cat.total.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
