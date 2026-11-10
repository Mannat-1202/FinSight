"use client";
import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getRecentTransactions,
  getCategoryTotals,
  getMonthlyTotals,
  getBudgetStatus,
} from "@/lib/api";
import { DashboardSummary, Transaction, CategoryTotal, MonthlyTotal, Budget } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import SummaryCard from "@/components/SummaryCard";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import BudgetProgress from "@/components/BudgetProgress";
import TransactionTable from "@/components/TransactionTable";
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Receipt,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

function formatCurrency(amount: number | null | undefined) {
  if (amount == null) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryTotal[]>([]);
  const [monthly, setMonthly] = useState<MonthlyTotal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePill, setActivePill] = useState("All");
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, tx, cats, mon, bud] = await Promise.all([
        getDashboardSummary(),
        getRecentTransactions(),
        getCategoryTotals(),
        getMonthlyTotals(),
        getBudgetStatus(),
      ]);
      setSummary(s);
      setRecentTx(tx);
      setCategories(cats);
      setMonthly(mon);
      setBudgets(bud);
    } catch {
      setError("Failed to load dashboard data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filteredRecent = recentTx.filter((t) => {
    if (showAlertsOnly && !t.isAnomaly) return false;
    if (activePill !== "All" && t.category !== activePill) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#bef264] border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-medium text-neutral-400">Loading Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page Header (Operations Dashboard style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Operations Dashboard</h1>
          <p className="mt-1 text-xs text-neutral-400 font-medium">
            {dateFormatted} · <span className="text-[#bef264]">Real-time Expense Overview</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl bg-[#14161b] border border-[#23262e] px-3 py-1.5 text-xs text-neutral-300 font-medium">
            <Calendar className="h-3.5 w-3.5 text-[#bef264]" />
            <span>This Month</span>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 rounded-xl bg-[#14161b] border border-[#23262e] px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Pill Filter Bar (All, Food, Shopping, Transport with count badges + Toggles) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b1e25] pb-4">
        {/* Pill category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {["All", "Food", "Shopping", "Transport", "Bills", "Entertainment"].map((cat) => {
            const count =
              cat === "All"
                ? recentTx.length
                : recentTx.filter((t) => t.category === cat).length;
            const isActive = activePill === cat;
            return (
              <button
                key={cat}
                onClick={() => setActivePill(cat)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#bef264] text-[#090a0d] shadow-md shadow-[#bef264]/20"
                    : "bg-[#14161b] border border-[#22252e] text-neutral-400 hover:text-white hover:border-neutral-600"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? "bg-[#090a0d] text-[#bef264]" : "bg-[#1f222b] text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Toggle Switches */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span>Show alerts</span>
            <input
              type="checkbox"
              checked={showAlertsOnly}
              onChange={(e) => setShowAlertsOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-8 h-4.5 bg-[#1f222b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#bef264] peer-checked:after:bg-[#090a0d]"></div>
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Spending"
          value={formatCurrency(summary?.totalSpend)}
          subtitle="Current Month"
          icon={IndianRupee}
          color="emerald"
        />
        <SummaryCard
          title="Transactions"
          value={String(summary?.transactionCount ?? 0)}
          subtitle="All Records"
          icon={Receipt}
          color="blue"
        />
        <SummaryCard
          title="Monthly Budget"
          value={formatCurrency(summary?.totalBudget)}
          subtitle={`Remaining: ${formatCurrency(summary?.remainingBudget)}`}
          icon={TrendingUp}
          color="purple"
        />
        <SummaryCard
          title="Anomalies Flagged"
          value={String(summary?.anomalyCount ?? 0)}
          subtitle="AI Outlier Guard"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Two Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend (Area Chart) */}
        <div className="lg:col-span-2 card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                Monthly Spending Trend
              </h3>
              <p className="text-xs text-neutral-500">6-Month historical overview</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#bef264] font-medium font-mono">
              <span className="h-2 w-2 rounded-full bg-[#bef264] animate-pulse" />
              Live Feed
            </div>
          </div>
          <SpendingChart data={monthly} height={230} />
        </div>

        {/* Category Breakdown (Donut Chart) */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                Category Split
              </h3>
              <p className="text-xs text-neutral-500">Distribution by sector</p>
            </div>
          </div>
          <CategoryChart data={categories} height={230} />
        </div>
      </div>

      {/* Recent Transactions & Budgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table Card */}
        <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#20232a] px-6 py-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                Recent Transactions
              </h3>
              <p className="text-xs text-neutral-500">ML classified records</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-[#bef264] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="p-0">
            <TransactionTable transactions={filteredRecent} compact />
          </div>
        </div>

        {/* Budgets Progress Card */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                  Budget Limits
                </h3>
                <p className="text-xs text-neutral-500">Monthly spend thresholds</p>
              </div>
              <Link
                href="/budgets"
                className="text-xs font-semibold text-[#bef264] hover:underline"
              >
                Manage →
              </Link>
            </div>

            <div className="space-y-3.5">
              {budgets.slice(0, 3).map((budget) => (
                <BudgetProgress key={budget.id} budget={budget} />
              ))}
              {budgets.length === 0 && (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No budgets configured. Click manage to set one!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1d2027] text-center">
            <Link
              href="/budgets"
              className="btn-secondary w-full text-xs font-semibold"
            >
              Configure Budget Allocations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
