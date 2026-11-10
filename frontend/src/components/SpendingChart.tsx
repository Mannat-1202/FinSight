"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonthlyTotal } from "@/lib/types";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface SpendingChartProps {
  data: MonthlyTotal[];
  height?: number;
}

export default function SpendingChart({ data, height = 240 }: SpendingChartProps) {
  const chartData = data.map((d) => ({
    name: MONTH_NAMES[d.month - 1],
    amount: Number(d.total),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="neonLimeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bef264" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#bef264" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1d2027" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#64748b"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          stroke="#64748b"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#14161b",
            border: "1px solid #282c37",
            borderRadius: "0.875rem",
            color: "#f4f5f7",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Spending"]}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#bef264"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#neonLimeGradient)"
          dot={{ fill: "#bef264", r: 3, stroke: "#090a0d", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#bef264", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
