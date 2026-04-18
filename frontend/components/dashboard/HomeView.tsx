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
  students: any[];
  menuItems: any[];
}

export function HomeView({ t, kpis, salesSeries, setActiveTab, students, menuItems }: HomeViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.home}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">Optimización de demanda y control de inventario inteligente con IA.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-normal uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
            <PackageSearch className="w-4 h-4" /> Ver alertas
          </button>
          <button 
            onClick={() => setActiveTab("pos")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-normal uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Abrir POS
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pedidos Totales" value={`${kpis.activeStudents}`} subtitle="Procesados hoy" icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />} trend="Hoy" />
        <StatCard title="Ingresos Hoy" value={formatCurrencyMXN(kpis.todayRevenue)} subtitle="Ventas brutas" icon={<DollarSign className="w-6 h-6 text-sky-600" />} />
        <StatCard title="Producto Top" value={kpis.topStudent} subtitle="Más vendido" icon={<Store className="w-6 h-6 text-amber-600" />} />
        <StatCard title="Stock Crítico" value={`${kpis.criticalInventory.items} items`} subtitle="Requieren atención" icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} trend="Alerta" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Ventas (7 dias)</h3>
            <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">MXN</div>
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
                <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} formatter={(v: unknown) => [formatCurrencyMXN(Number(v)), "Ventas"]} labelFormatter={(l) => `Dia: ${l}`} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm truncate max-w-[150px] sm:max-w-none">Alertas de Inventario</h3>
            <div className="w-fit text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
              {kpis.criticalInventory.items} Críticos
            </div>
          </div>
          <div className="space-y-4">
            {kpis.criticalInventory.items > 0 ? (
              <div className="flex items-start gap-4 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/10 group hover:border-rose-500/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-rose-600 font-normal text-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-normal text-slate-900 dark:text-white truncate">Stock Crítico Detectado</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    {kpis.criticalInventory.sku} requiere reposición inmediata.
                  </div>
                  <div className="inline-flex items-center gap-1 text-[9px] font-normal uppercase tracking-tighter text-rose-500 mt-2 bg-white/50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                     Quedan {kpis.criticalInventory.remaining} unidades
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 font-normal">No hay alertas críticas de inventario.</div>
            )}
            
            <button 
              onClick={() => setActiveTab("inventory")}
              className="w-full py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[10px] font-normal uppercase tracking-widest text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
            >
              Gestionar Inventario
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pb-10">
        <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Brain className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8 text-emerald-100 font-normal text-[12px] uppercase tracking-[0.2em]">
              <Zap className="w-4 h-4" /> Predicciones recientes
            </div>
            <div className="space-y-4">
              {menuItems.length > 0 ? menuItems.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-black truncate">{m.dish_name}</div>
                      <div className="text-emerald-50/85 text-[12px] leading-snug mt-1">{m.description}</div>
                    </div>
                    <div className="shrink-0 text-[10px] font-normal uppercase tracking-[0.2em] bg-white/15 px-2 py-1 rounded-lg">{m.day_of_week}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-emerald-100/60 font-normal">No hay menú publicado para esta semana.</div>
              )}
            </div>
            <div className="mt-8">
              <button onClick={() => setActiveTab("prediction")} className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-normal text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-xl">
                Ver prediccion IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
