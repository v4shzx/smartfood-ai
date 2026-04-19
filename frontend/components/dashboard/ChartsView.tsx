"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarRange,
  Download,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

interface ChartsViewProps {
  t: any;
  chartsRange: "7d" | "30d" | "90d";
  setChartsRange: (r: "7d" | "30d" | "90d") => void;
  chartsSales: any[];
  chartsTopProducts: any[];
}

export function ChartsView({
  t,
  chartsRange,
  setChartsRange,
  chartsSales,
  chartsTopProducts,
}: ChartsViewProps) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.charts}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">Analisis visual de ingresos, tickets y productos estrella.</p>
        </motion.div>

        <div className="flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setChartsRange(r)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                chartsRange === r
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {r === "7d" ? "1 Sem" : r === "30d" ? "1 Mes" : "3 Mes"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Ingresos vs Tickets</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Desempeño temporal</p>
            </div>
            <button className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={chartsSales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 400 }} stroke="rgba(148,163,184,0.5)" dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 400 }} stroke="#10b981" tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 400 }} stroke="#3b82f6" />
                <Tooltip
                  contentStyle={{ borderRadius: 24, border: "1px solid rgba(148,163,184,0.2)", padding: 16, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  cursor={{ stroke: "rgba(16, 185, 129, 0.2)", strokeWidth: 20 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 30, fontSize: 10, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.1em" }} />
                <Line yAxisId="left" type="monotone" dataKey="sales" name="Ventas" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="tickets" name="Tickets" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Top Productos</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Por volumen (unidades)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-[400px]">
            {chartsTopProducts.length === 0 ? (
              <div className="text-center text-slate-500 py-8">{t.dashboard.no_top_products || 'No hay productos destacados'}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsTopProducts} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 400, width: 80 }} stroke="rgba(148,163,184,0.8)" />
                  <Tooltip cursor={{ fill: "rgba(148,163,184,0.05)" }} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="val" radius={[0, 10, 10, 0]} barSize={24}>
                    {chartsTopProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {chartsTopProducts.slice(0, 3).map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
