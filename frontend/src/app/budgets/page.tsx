"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getBudgets, createBudget, deleteBudget } from "@/lib/api";
import { Budget, BudgetRequest } from "@/lib/types";
import BudgetProgress from "@/components/BudgetProgress";
import { Plus, Trash2, RefreshCw, Wallet, Calendar } from "lucide-react";

const CATEGORIES = ["Food", "Shopping", "Transport", "Bills", "Entertainment", "Others"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const [form, setForm] = useState<BudgetRequest>({
    category: "Food",
    limitAmount: 0,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getBudgets(viewMonth, viewYear);
      setBudgets(data);
    } catch {
      setError("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [viewMonth, viewYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.limitAmount || form.limitAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createBudget(form);
      setShowForm(false);
      setForm({
        category: "Food",
        limitAmount: 0,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      load();
    } catch {
      setError("Failed to save budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBudget(id);
      setDeleteId(null);
      load();
    } catch {
      setError("Failed to delete budget.");
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limitAmount), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spentAmount), 0);
  const overBudgetCount = budgets.filter((b) => b.percentageUsed > 100).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Budget Allocations</h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Category-level spending thresholds and tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-xl bg-[#14161b] border border-[#23262e] px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Budget Limit
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Month/Year Filter Card */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#bef264]/10 text-[#bef264]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Active Period
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-[#181a20] border border-[#262a34] rounded-lg px-2.5 py-1 text-white text-xs font-medium focus:outline-none focus:border-[#bef264]"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1} className="bg-[#14161b]">
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                min={2020}
                max={2030}
                className="bg-[#181a20] border border-[#262a34] rounded-lg px-2.5 py-1 text-white text-xs font-mono font-medium w-20 focus:outline-none focus:border-[#bef264]"
              />
            </div>
          </div>
        </div>

        {/* 3 Micro Stats in header */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="border-l border-[#22252e] pl-4">
            <span className="text-[10px] uppercase text-neutral-500">Allocated</span>
            <p className="font-bold text-white text-sm">₹{totalBudget.toLocaleString("en-IN")}</p>
          </div>
          <div className="border-l border-[#22252e] pl-4">
            <span className="text-[10px] uppercase text-neutral-500">Consumed</span>
            <p className="font-bold text-[#bef264] text-sm">₹{totalSpent.toLocaleString("en-IN")}</p>
          </div>
          <div className="border-l border-[#22252e] pl-4">
            <span className="text-[10px] uppercase text-neutral-500">Exceeded</span>
            <p className="font-bold text-rose-400 text-sm">{overBudgetCount}</p>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bef264] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-neutral-500 text-center">
          <Wallet className="w-12 h-12 mb-3 opacity-30 text-[#bef264]" />
          <h3 className="text-base font-semibold text-white">No budgets set for this month</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            Setting budget limits triggers real-time progress bars and overspending warnings.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs font-semibold mt-4"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Set First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((b) => (
            <div
              key={b.id}
              className="card relative flex flex-col justify-between group hover:border-[#2e323e]"
            >
              <div className="mb-4 flex items-center justify-between border-b border-[#1d2028] pb-3">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Category Track
                </span>
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="rounded-lg p-1.5 text-neutral-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  title="Remove Budget"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <BudgetProgress budget={b} detailed />
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#14161b] border border-[#262934] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Budget?</h3>
            <p className="text-neutral-400 text-xs mb-6">
              This will remove the spending threshold and tracking for this category.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 text-xs font-semibold">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 text-xs font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Update Budget Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121418] border border-[#262934] rounded-3xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-[#1f222b] pb-4">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#181a20] border border-[#252832] p-1 shadow-md">
                <Image
                  src="/logo-icon.png"
                  alt="FinSight"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Define Budget Limit</h3>
                <p className="text-[11px] text-neutral-400">Set maximum monthly threshold</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#14161b]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Spending Limit (₹) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.limitAmount || ""}
                  onChange={(e) => setForm({ ...form, limitAmount: Number(e.target.value) })}
                  placeholder="e.g. 10000"
                  required
                  className="input font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Month
                  </label>
                  <select
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                    className="input"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1} className="bg-[#14161b]">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    min={2020}
                    max={2030}
                    className="input font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#1f222b]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs font-semibold"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
