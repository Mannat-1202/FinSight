"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CategoryTotal } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#bef264",         // Electric Lime
  Shopping: "#38bdf8",     // Cyan Blue
  Transport: "#fb923c",    // Tangerine
  Bills: "#f43f5e",        // Neon Rose
  Entertainment: "#a855f7",// Violet
  Others: "#94a3b8",       // Slate
  Uncategorized: "#475569",// Dark Slate
};

interface CategoryChartProps {
  data: CategoryTotal[];
  height?: number;
}

export default function CategoryChart({ data, height = 240 }: CategoryChartProps) {
  const chartData = data.map((d) => ({
    name: d.category,
    value: Number(d.total),
    percentage: d.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={height * 0.24}
          outerRadius={height * 0.38}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={CATEGORY_COLORS[entry.name] ?? "#64748b"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#14161b",
            border: "1px solid #282c37",
            borderRadius: "0.875rem",
            color: "#f4f5f7",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Amount"]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-neutral-300 font-medium">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
