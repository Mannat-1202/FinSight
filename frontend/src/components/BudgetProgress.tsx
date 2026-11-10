"use client";
import React from "react";
import { Budget } from "@/lib/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface BudgetProgressProps {
  budget: Budget;
  detailed?: boolean;
}

export default function BudgetProgress({ budget, detailed }: BudgetProgressProps) {
  const percentage = Math.min(budget.percentageUsed, 100);
  const overBudget = budget.percentageUsed > 100;

  // Colors matching the dashboard reference image
  const barGradient =
    budget.percentageUsed > 85
      ? "from-rose-500 to-red-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
      : budget.percentageUsed > 60
        ? "from-[#fb923c] to-[#f59e0b] shadow-[0_0_12px_rgba(251,146,60,0.35)]"
        : "from-[#bef264] to-[#a3e635] shadow-[0_0_12px_rgba(190,242,100,0.35)]";

  const badgeColor =
    budget.percentageUsed > 85
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : budget.percentageUsed > 60
        ? "bg-[#fb923c]/10 text-[#fb923c] border-[#fb923c]/20"
        : "bg-[#bef264]/10 text-[#bef264] border-[#bef264]/20";

  return (
    <div
      className={
        detailed
          ? "space-y-3"
          : "rounded-2xl border border-[#22252e] bg-[#14161b] p-4 transition-all hover:border-[#2d323f]"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-200">{budget.category}</span>
          {overBudget ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">
              <AlertCircle className="w-3 h-3" /> Exceeded
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#bef264]">
              <CheckCircle2 className="w-3 h-3" /> On Track
            </span>
          )}
        </div>

        <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold border ${badgeColor}`}>
          {budget.percentageUsed.toFixed(0)}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1e2129] border border-[#262a34]">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${barGradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
        <span>₹{Number(budget.spentAmount).toLocaleString("en-IN")} spent</span>
        <span className="text-neutral-500">₹{Number(budget.limitAmount).toLocaleString("en-IN")} limit</span>
      </div>

      {overBudget && (
        <p className="text-xs font-medium text-rose-400">
          ⚠ Over budget by ₹{(Number(budget.spentAmount) - Number(budget.limitAmount)).toLocaleString("en-IN")}
        </p>
      )}

      {detailed && (
        <p className="text-xs text-neutral-500 font-mono">
          Remaining: ₹
          {(
            Number(budget.limitAmount) -
            Math.min(Number(budget.spentAmount), Number(budget.limitAmount))
          ).toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}
