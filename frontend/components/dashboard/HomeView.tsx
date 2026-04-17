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
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <BarChart3 className="w-3.5 h-3.5" /> Resumen del negocio
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.home}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Gestión de alumnos, planes y comedor escolar.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
            <PackageSearch className="w-4 h-4" /> Ver alertas
          </button>
          <button 
            onClick={() => setActiveTab("pos")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Abrir POS
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Alumnos Activos" value={kpis.activeStudents.toString()} subtitle="Registrados en la cuenta" icon={<Users className="w-6 h-6 text-emerald-600" />} trend="Total" />
        <StatCard title="Gasto Estimado" value={formatCurrencyMXN(kpis.todayRevenue)} subtitle="Consumo proyectado hoy" icon={<DollarSign className="w-6 h-6 text-sky-600" />} />
        <StatCard title="Alumno Destacado" value={kpis.topStudent} subtitle="Asistencia perfecta" icon={<Store className="w-6 h-6 text-amber-600" />} />
        <StatCard title="Avisos Sistema" value={`${kpis.criticalInventory.items} alertas`} subtitle="Pendientes de revisión" icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} trend="Atención" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Ventas (7 dias)</h3>
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">MXN</div>
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

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Mis Alumnos</h3>
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">{students.length} Registrados</div>
          </div>
          <div className="space-y-4">
            {students.length > 0 ? students.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/60 dark:bg-slate-800/50 rounded-2xl border border-slate-100/60 dark:border-slate-800/60 group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 font-black text-lg">
                  {s.first_name[0]}{s.last_name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-slate-900 dark:text-white truncate">{s.first_name} {s.last_name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{s.grade || "Sin grado"} • Plan Activo</div>
                  {s.allergies && (
                    <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-rose-500 mt-2 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-2.5 h-2.5" /> {s.allergies}
                    </div>
                  )}
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">Detalles</button>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400 font-medium">No hay alumnos registrados.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Accesos rapidos</h3>
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operar</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Punto de Venta", icon: <ShoppingCart className="w-5 h-5" />, tab: "pos" as const },
              { label: "Registro de Ventas", icon: <ClipboardList className="w-5 h-5" />, tab: "sales" as const },
              { label: "Inventario", icon: <Box className="w-5 h-5" />, tab: "inventory" as const },
              { label: "Prediccion IA", icon: <Brain className="w-5 h-5" />, tab: "prediction" as const },
            ].map((x) => (
              <button key={x.label} onClick={() => setActiveTab(x.tab)} className="text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      {x.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-white truncate">{x.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Abrir</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Brain className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8 text-emerald-100 font-black text-[12px] uppercase tracking-[0.2em]">
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
                    <div className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-2 py-1 rounded-lg">{m.day_of_week}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-emerald-100/60 font-medium">No hay menú publicado para esta semana.</div>
              )}
            </div>
            <div className="mt-8">
              <button onClick={() => setActiveTab("prediction")} className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-xl">
                Ver prediccion IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
