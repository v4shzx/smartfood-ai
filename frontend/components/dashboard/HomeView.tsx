"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PackageSearch,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Store,
  AlertTriangle,
  Bell,
  ArrowUpRight,
  Box,
  ClipboardList,
  Brain,
  Zap,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "./shared/StatCard";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

interface HomeViewProps {
  t: any;
  kpis: {
    todayRevenue: number;
    weekRevenue: number;
    topStudent: string;
    activeStudents: number;
    menuItemsCount: number;
    criticalInventory: { items: number; sku: string; remaining: number };
  };
  salesSeries: any[];
  setActiveTab: (tab: any) => void;
  menuItems: any[];
  subscriptionTier: string;
}

export function HomeView({ t, kpis, salesSeries, setActiveTab, menuItems, subscriptionTier }: HomeViewProps) {
  const isProOrAbove = subscriptionTier === "profesional" || subscriptionTier === "empresarial";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.home}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">
            {isProOrAbove 
              ? t.hero_p 
              : "Gestión simplificada de ventas y reportes base."}
          </p>
        </motion.div>

        {isProOrAbove && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setActiveTab("prediction")}
            className="group cursor-pointer relative overflow-hidden bg-linear-to-br from-emerald-600 to-teal-700 rounded-3xl p-4 shadow-lg shadow-emerald-600/20 flex items-center gap-4 w-fit max-w-full hover:scale-[1.02] transition-all"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
              <Brain className="w-12 h-12" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 pr-8">
              <div className="text-[10px] font-black text-emerald-100 uppercase tracking-widest leading-none mb-1">{t.dashboard.ai_prediction_tomorrow}</div>
              <div className="text-sm font-bold text-white truncate">
                {kpis.topStudent !== "N/A" ? kpis.topStudent : t.dashboard.calculating}
              </div>
              <div className="text-[10px] text-emerald-50/70 font-medium">{t.dashboard.max_probability} • {t.dashboard.view_analysis}</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.dashboard.total_orders} value={`${kpis.activeStudents}`} subtitle={`${kpis.todayOrders} ${t.dashboard.processed_today}`} icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />} trend="Hoy" />
        <StatCard 
          title={t.dashboard.revenue_today} 
          value={formatCurrencyMXN(kpis.todayRevenue)} 
          subtitle={`${t.dashboard.yesterday}: ${formatCurrencyMXN(kpis.yesterdayRevenue)}`} 
          icon={<DollarSign className="w-6 h-6 text-sky-600" />} 
          trend={kpis.todayRevenue >= kpis.yesterdayRevenue ? "+Trend" : "-Trend"}
        />
        <StatCard title={t.dashboard.top_product} value={kpis.topStudent} subtitle={`${kpis.topProductQty} ${t.dashboard.units_sold}`} icon={<Store className="w-6 h-6 text-amber-600" />} />
        {isProOrAbove ? (
          <StatCard title={t.dashboard.critical_stock} value={`${kpis.criticalInventory.items} items`} subtitle={`Alerta: ${kpis.criticalInventory.sku}`} icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} trend="Alerta" />
        ) : (
          <StatCard title={t.dashboard.reports} value={`${kpis.weekRevenue > 0 ? "Activo" : "Sin Datos"}`} subtitle="Resumen semanal" icon={<BarChart3 className="w-6 h-6 text-indigo-600" />} />
        )}
      </div>

      <div className={cn("grid grid-cols-1 gap-8", isProOrAbove ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
        <div className={cn("bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm", !isProOrAbove && "lg:col-span-1")}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.sales_performance}</h3>
            <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.dashboard.last_7_days} (MXN)</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} formatter={(v: unknown) => [formatCurrencyMXN(Number(v)), "Ventas"]} labelFormatter={(l) => `Día: ${l}`} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isProOrAbove && (
          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm truncate max-w-[150px] sm:max-w-none">{t.dashboard.inventory_alerts}</h3>
              <div className="w-fit text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                {kpis.criticalInventory.items} {t.dashboard.critical_items}
              </div>
            </div>
            <div className="space-y-4">
              {kpis.criticalInventory.items > 0 ? (
                <div className="flex items-start gap-4 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/10 group hover:border-rose-500/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-rose-600 font-normal text-lg">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-normal text-slate-900 dark:text-white truncate">{t.dashboard.critical_stock}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      {kpis.criticalInventory.sku} requiere reposición inmediata.
                    </div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-normal uppercase tracking-tighter text-rose-500 mt-2 bg-white/50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                       Quedan {kpis.criticalInventory.remaining} unidades
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-normal">{t.dashboard.no_alerts}</div>
              )}
              
              <button 
                onClick={() => setActiveTab("inventory")}
                className="w-full py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[10px] font-normal uppercase tracking-widest text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
              >
                {t.dashboard.manage_inventory}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
