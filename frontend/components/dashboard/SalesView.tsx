"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Download,
  ShoppingCart,
  PackageSearch,
  X,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";

interface SalesViewProps {
  t: any;
  salesQuery: string;
  setSalesQuery: (q: string) => void;
  salesMethod: "all" | "cash" | "card";
  setSalesMethod: (m: "all" | "cash" | "card") => void;
  salesDateFrom: string;
  setSalesDateFrom: (d: string) => void;
  salesDateTo: string;
  setSalesDateTo: (d: string) => void;
  salesFiltered: any[];
  setSelectedSaleId: (id: string | null) => void;
  selectedSale: any;
  setActiveTab: (tab: any) => void;
}

export function SalesView({
  t,
  salesQuery,
  setSalesQuery,
  salesMethod,
  setSalesMethod,
  salesDateFrom,
  setSalesDateFrom,
  salesDateTo,
  setSalesDateTo,
  salesFiltered,
  setSelectedSaleId,
  selectedSale,
  setActiveTab,
}: SalesViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.sales}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Historial, filtros y detalle por transaccion.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={() => setActiveTab("pos")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Ir a POS
          </button>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <PackageSearch className="w-4 h-4 text-slate-400" />
              <input
                value={salesQuery}
                onChange={(e) => setSalesQuery(e.target.value)}
                placeholder="Buscar por folio, cajero o metodo..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Metodo</div>
              <select
                value={salesMethod}
                onChange={(e) => setSalesMethod(e.target.value as "all" | "cash" | "card")}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Desde</div>
              <input
                type="date"
                value={salesDateFrom}
                onChange={(e) => setSalesDateFrom(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
              />
            </div>
            <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Hasta</div>
              <input
                type="date"
                value={salesDateTo}
                onChange={(e) => setSalesDateTo(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Transacciones</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{salesFiltered.length} resultados</div>
          </div>

          <div className="space-y-3">
            {salesFiltered.map((s) => {
              const d = new Date(s.ts);
              const methodLabel = s.method === "cash" ? "Efectivo" : "Tarjeta";
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSaleId(s.id)}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{s.id}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                          {methodLabel}
                        </div>
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                        {d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} · Cajero:{" "}
                        <span className="font-bold">{s.cashier}</span> · Items: <span className="font-bold">{s.items}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(s.total)}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mt-1">Ver detalle</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Resumen</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Filtrado</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>Ingresos</span>
              <span className="font-black">{formatCurrencyMXN(salesFiltered.reduce((acc, s) => acc + s.total, 0))}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>Tickets</span>
              <span className="font-black">{salesFiltered.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>Ticket promedio</span>
              <span className="font-black">
                {formatCurrencyMXN(salesFiltered.length ? salesFiltered.reduce((acc, s) => acc + s.total, 0) / salesFiltered.length : 0)}
              </span>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Siguiente</div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-1">Export PDF, notas y devoluciones</div>
            <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">Lo conectamos cuando integremos facturacion y reglas de caja.</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSale && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedSaleId(null)} />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[520px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Detalle</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedSale.id}</div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(selectedSale.ts).toLocaleString()} · Cajero: <span className="font-bold">{selectedSale.cashier}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedSaleId(null)} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedSale.lines.map((l: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100/60 dark:border-slate-800/60">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-white truncate">{l.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                        {l.qty} x {formatCurrencyMXN(l.price)}
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(l.qty * l.price)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-black">{formatCurrencyMXN(selectedSale.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>Descuento</span>
                  <span className="font-black">-{formatCurrencyMXN(selectedSale.discount)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span className="font-black">{formatCurrencyMXN(selectedSale.total)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                  Reimprimir ticket
                </button>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                  Exportar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
