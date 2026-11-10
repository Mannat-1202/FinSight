"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TransactionRequest, Transaction } from "@/lib/types";
import { createTransaction, updateTransaction } from "@/lib/api";
import { X } from "lucide-react";

const CATEGORIES = ["Food", "Shopping", "Transport", "Bills", "Entertainment", "Others"];
const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash", "Wallet"];

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionForm({ transaction, onClose, onSuccess }: TransactionFormProps) {
  const [form, setForm] = useState<TransactionRequest>({
    merchant: "",
    description: "",
    amount: 0,
    category: "",
    transactionDate: new Date().toISOString().split("T")[0],
    paymentMethod: "UPI",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setForm({
        merchant: transaction.merchant,
        description: transaction.description ?? "",
        amount: transaction.amount,
        category: transaction.category ?? "",
        transactionDate: transaction.transactionDate,
        paymentMethod: transaction.paymentMethod ?? "UPI",
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.merchant.trim()) {
      setError("Merchant is required");
      return;
    }
    if (form.amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.category) delete payload.category;
      if (transaction) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#262934] bg-[#121418] p-7 shadow-2xl shadow-black/80">
        <div className="mb-6 flex items-center justify-between border-b border-[#1f222b] pb-4">
          <div className="flex items-center gap-2.5">
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
              <h2 className="text-base font-bold text-white">
                {transaction ? "Modify Transaction" : "New Transaction Entry"}
              </h2>
              <p className="text-[11px] text-neutral-400">ML auto-categorization enabled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-neutral-400 hover:bg-[#1e2129] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Merchant Name *
            </label>
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              className="input"
              placeholder="e.g. Swiggy, Amazon, Uber, Netflix"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Description (Optional)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              placeholder="e.g. Dinner with team, monthly cloud fee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Amount (₹) *
              </label>
              <input
                type="number"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="input font-mono font-bold"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Date *
              </label>
              <input
                type="date"
                value={form.transactionDate}
                onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                className="input [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Category <span className="text-[#bef264] text-[10px]">(Auto-detect)</span>
              </label>
              <select
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                <option value="" className="bg-[#14161b]">
                  Auto-Detect (ML)
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#14161b]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Payment Channel
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="input"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m} className="bg-[#14161b]">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#1f222b]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 text-xs font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : transaction ? (
                "Save Changes"
              ) : (
                "Add Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
