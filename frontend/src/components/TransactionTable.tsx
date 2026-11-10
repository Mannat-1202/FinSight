"use client";
import React from "react";
import { Transaction } from "@/lib/types";
import { AlertTriangle, Pencil, Trash2, CheckCircle2 } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
  compact?: boolean;
}

const CATEGORY_STYLES: Record<string, string> = {
  Food: "bg-[#bef264]/10 text-[#bef264] border-[#bef264]/25",
  Shopping: "bg-sky-500/10 text-sky-400 border-sky-500/25",
  Transport: "bg-[#fb923c]/10 text-[#fb923c] border-[#fb923c]/25",
  Bills: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  Entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/25",
  Others: "bg-neutral-500/10 text-neutral-300 border-neutral-600/30",
  Uncategorized: "bg-neutral-800 text-neutral-400 border-neutral-700/50",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  compact,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-neutral-500 text-sm font-medium">
        No transactions recorded
      </div>
    );
  }

  const showActions = !compact && (onEdit || onDelete);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#20232a] bg-[#14161b]/90 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          <tr>
            <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
            <th className="px-5 py-3.5">Merchant</th>
            {!compact && <th className="px-5 py-3.5">Payment</th>}
            <th className="px-5 py-3.5">Category</th>
            <th className="px-5 py-3.5 text-right whitespace-nowrap">Amount</th>
            <th className="px-5 py-3.5">Status</th>
            {showActions && <th className="px-5 py-3.5 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1b1e25]">
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="group transition-colors hover:bg-[#181a20]/80"
            >
              <td className="whitespace-nowrap px-5 py-4 text-xs font-mono text-neutral-400">
                {formatDate(tx.transactionDate)}
              </td>
              <td className="px-5 py-4">
                <p className="font-semibold text-neutral-100 group-hover:text-white transition-colors">
                  {tx.merchant}
                </p>
                {tx.description && !compact && (
                  <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                    {tx.description}
                  </p>
                )}
              </td>
              {!compact && (
                <td className="px-5 py-4 text-xs font-medium text-neutral-400 whitespace-nowrap">
                  <span className="rounded-md bg-[#191c22] border border-[#262a34] px-2 py-1">
                    {tx.paymentMethod || "UPI"}
                  </span>
                </td>
              )}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${CATEGORY_STYLES[tx.category] ?? "bg-neutral-800 text-neutral-300 border-neutral-700"
                    }`}
                >
                  {tx.category ?? "—"}
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-right font-mono font-bold text-white text-base">
                ₹{Number(tx.amount).toLocaleString("en-IN")}
              </td>
              <td className="px-5 py-4">
                {tx.isAnomaly ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fb923c]/10 border border-[#fb923c]/25 px-2.5 py-0.5 text-xs font-semibold text-[#fb923c]">
                    <AlertTriangle className="h-3 w-3" /> Unusual
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#bef264]/10 border border-[#bef264]/25 px-2.5 py-0.5 text-xs font-semibold text-[#bef264]">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </td>
              {showActions && (
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#222630] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
