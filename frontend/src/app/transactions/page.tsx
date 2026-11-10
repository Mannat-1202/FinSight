"use client";
import { useEffect, useState, useCallback } from "react";
import { getTransactions, deleteTransaction, importCsv } from "@/lib/api";
import { Transaction } from "@/lib/types";
import TransactionTable from "@/components/TransactionTable";
import TransactionForm from "@/components/TransactionForm";
import { Plus, Upload, Search, Filter, Receipt, ChevronDown, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["All", "Food", "Shopping", "Transport", "Bills", "Entertainment", "Others", "Uncategorized"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [anomalyFilter, setAnomalyFilter] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setFiltered(data);
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let result = transactions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") {
      result = result.filter((t) => t.category === categoryFilter);
    }
    if (anomalyFilter) {
      result = result.filter((t) => t.isAnomaly);
    }
    setFiltered(result);
  }, [transactions, search, categoryFilter, anomalyFilter]);

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setDeleteConfirm(null);
      load();
    } catch {
      setError("Failed to delete transaction.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg("");
    try {
      const result = await importCsv(file);
      setImportMsg(`✓ Imported ${result.length} transactions`);
      load();
    } catch {
      setImportMsg("✗ Import failed — check CSV format");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Transactions Record</h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            {transactions.length} total entries · <span className="text-[#bef264]">AI enrichment enabled</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className={`btn-secondary text-xs font-semibold cursor-pointer ${importing ? "opacity-50" : ""}`}>
            <Upload className="w-3.5 h-3.5 text-neutral-400" />
            {importing ? "Importing..." : "Import CSV"}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importing} />
          </label>
          <button
            onClick={() => {
              setEditTx(null);
              setShowForm(true);
            }}
            className="btn-primary text-xs font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Transaction
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">
          {error}
        </div>
      )}
      {importMsg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${importMsg.startsWith("✓")
              ? "bg-[#bef264]/10 border-[#bef264]/30 text-[#bef264]"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
        >
          {importMsg}
        </div>
      )}

      {/* Pill Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.slice(0, 6).map((c) => {
          const count = c === "All" ? transactions.length : transactions.filter((t) => t.category === c).length;
          const isActive = categoryFilter === c;
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${isActive
                  ? "bg-[#bef264] text-[#090a0d] shadow-md shadow-[#bef264]/20"
                  : "bg-[#14161b] border border-[#22252e] text-neutral-400 hover:text-white"
                }`}
            >
              <span>{c}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${isActive ? "bg-[#090a0d] text-[#bef264]" : "bg-[#1e2129] text-neutral-400"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="card flex flex-col sm:flex-row gap-3 p-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by merchant, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-icon-left text-sm"
          />
        </div>

        <div className="relative min-w-[170px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input input-icon-left text-sm pr-9 appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#14161b] text-white">
                {c}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Toggle switch for anomalies */}
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer select-none px-3 py-2 sm:py-0 rounded-xl bg-[#171920] border border-[#252832]">
          <span>Show alerts only</span>
          <input
            type="checkbox"
            checked={anomalyFilter}
            onChange={(e) => setAnomalyFilter(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-8 h-4.5 bg-[#252833] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#fb923c] peer-checked:after:bg-[#090a0d]"></div>
        </label>
      </div>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-[#bef264] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
            <Receipt className="w-10 h-10 mb-2 opacity-30 text-[#bef264]" />
            <p className="text-sm">No transactions match your filters</p>
            {transactions.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-xs font-semibold mt-4 px-5"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add your first transaction
              </button>
            )}
          </div>
        ) : (
          <TransactionTable
            transactions={filtered}
            onEdit={(tx) => {
              setEditTx(tx);
              setShowForm(true);
            }}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#14161b] border border-[#262934] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Transaction?</h3>
            <p className="text-neutral-400 text-xs mb-6">
              This record will be permanently deleted from the financial ledger.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 text-xs font-semibold">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1 text-xs font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <TransactionForm
          transaction={editTx}
          onClose={() => {
            setShowForm(false);
            setEditTx(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditTx(null);
            load();
          }}
        />
      )}
    </div>
  );
}
