"use client";
import { useEffect, useState } from "react";
import { getCategoryTotals, getMonthlyTotals, getComparison } from "@/lib/api";
import { CategoryTotal, MonthlyTotal, MonthComparison } from "@/lib/types";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart2, PieChart as PieIcon, ArrowUpRight } from "lucide-react";

function formatCurrency(v: number) {
  return `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function AnalyticsPage() {
  const [categories, setCategories] = useState<CategoryTotal[]>([]);
  const [monthly, setMonthly] = useState<MonthlyTotal[]>([]);
  const [comparison, setComparison] = useState<MonthComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, mon, cmp] = await Promise.all([
        getCategoryTotals(),
        getMonthlyTotals(),
        getComparison(),
      ]);
      setCategories(cats);
      setMonthly(mon);
      setComparison(cmp);
    } catch {
      setError("Failed to load analytics. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const pct = comparison?.percentageChange ?? 0;
  const isUp = pct > 0;
  const isDown = pct < 0;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#bef264] border-t-transparent mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Expense Intelligence</h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Historical spend distribution & velocity analysis
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 rounded-xl bg-[#14161b] border border-[#23262e] px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Month Comparison 3-card grid */}
      {comparison && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Current Month Volume
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-white">
              {formatCurrency(Number(comparison.currentMonthTotal))}
            </p>
            <p className="mt-1 text-xs text-neutral-500">Active billing period</p>
          </div>

          <div className="card">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Previous Month Volume
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-neutral-300">
              {formatCurrency(Number(comparison.previousMonthTotal))}
            </p>
            <p className="mt-1 text-xs text-neutral-500">Reference period</p>
          </div>

          <div className="card">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Month-over-Month Delta
            </span>
            <div className="mt-2 flex items-center gap-2">
              {isUp ? (
                <div className="flex items-center gap-1 text-rose-400 font-mono font-bold text-2xl">
                  <TrendingUp className="w-6 h-6" /> +{pct.toFixed(1)}%
                </div>
              ) : isDown ? (
                <div className="flex items-center gap-1 text-[#bef264] font-mono font-bold text-2xl">
                  <TrendingDown className="w-6 h-6" /> {pct.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center gap-1 text-neutral-400 font-mono font-bold text-2xl">
                  <Minus className="w-6 h-6" /> 0.0%
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {isUp ? "Increased spending vs last month" : "Decreased spending vs last month"}
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 card">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#bef264]/10 text-[#bef264]">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Spending Velocity (6 Months)
                </h3>
                <p className="text-xs text-neutral-500">Aggregated trajectory</p>
              </div>
            </div>
          </div>
          <SpendingChart data={monthly} height={280} />
        </div>

        {/* Category Split */}
        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#38bdf8]/10 text-[#38bdf8]">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Category Breakdown
                </h3>
                <p className="text-xs text-neutral-500">Percentage distribution</p>
              </div>
            </div>
          </div>
          <CategoryChart data={categories} height={280} />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#20232a]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Category Spending Summary
          </h3>
          <p className="text-xs text-neutral-500">Total volume and share</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#20232a] bg-[#14161b] text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">Total Amount</th>
                <th className="px-6 py-3.5 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1e25]">
              {categories.map((c) => (
                <tr key={c.category} className="hover:bg-[#181a20] transition-colors">
                  <td className="px-6 py-4 font-semibold text-neutral-200">{c.category}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-white">
                    ₹{Number(c.total).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-neutral-400">
                    <span className="inline-block rounded-full bg-[#1e2129] border border-[#2a2e38] px-2.5 py-0.5 text-xs text-[#bef264] font-bold">
                      {c.percentage.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
