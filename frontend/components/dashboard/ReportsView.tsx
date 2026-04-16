"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  CalendarRange,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";

interface ReportsViewProps {
  t: any;
  reportsType: "sales" | "inventory" | "finance";
  setReportsType: (t: "sales" | "inventory" | "finance") => void;
  reportsRange: "today" | "7d" | "30d" | "custom";
  setReportsRange: (r: "today" | "7d" | "30d" | "custom") => void;
  reportsFrom: string;
  setReportsFrom: (d: string) => void;
  reportsTo: string;
  setReportsTo: (d: string) => void;
}

export function ReportsView({
  t,
  reportsType,
  setReportsType,
  reportsRange,
  setReportsRange,
  reportsFrom,
  setReportsFrom,
  reportsTo,
  setReportsTo,
}: ReportsViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <Download className="w-3.5 h-3.5" /> {t.dashboard.reports}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.reports}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Genera reportes y exporta.</p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Tipo</div>
            <select value={reportsType} onChange={(e) => setReportsType(e.target.value as any)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
              <option value="sales">Ventas</option>
              <option value="inventory">Inventario</option>
              <option value="finance">Financiero</option>
            </select>
          </div>
          <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Rango</div>
            <select value={reportsRange} onChange={(e) => setReportsRange(e.target.value as any)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
              <option value="today">Hoy</option>
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              <Download className="w-4 h-4" /> Generar
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
              Exportar PDF
            </button>
          </div>
        </div>

        {reportsRange === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Desde</div>
              <input type="date" value={reportsFrom} onChange={(e) => setReportsFrom(e.target.value)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Hasta</div>
              <input type="date" value={reportsTo} onChange={(e) => setReportsTo(e.target.value)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
              <CalendarRange className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Rango personalizado
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Vista previa</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Mock</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Ingresos</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatCurrencyMXN(81240)}</div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Tickets</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">885</div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Merma</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatCurrencyMXN(1240)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Plantillas</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Auto</div>
          </div>
          <div className="space-y-3">
            {["Corte diario", "Semanal ejecutivo", "Inventario critico", "Ventas por producto"].map((x) => (
              <button key={x} className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/50 transition-all">
                <div className="text-sm font-black text-slate-900 dark:text-white">{x}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Genera con un click.</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
