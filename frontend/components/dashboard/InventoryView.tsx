"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Plus,
  PackageSearch,
  AlertTriangle,
  History,
  X,
  TrendingUp,
  MinusCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

interface InventoryViewProps {
  t: any;
  invQuery: string;
  setInvQuery: (q: string) => void;
  invOnlyCritical: boolean;
  setInvOnlyCritical: (v: any) => void;
  invCritical: any[];
  invFiltered: any[];
  invOpen: (id: string, type: any) => void;
  invEditorOpen: boolean;
  invSelected: any;
  invMoveType: "in" | "out" | "adjust";
  setInvMoveType: (t: any) => void;
  invMoveQty: number;
  setInvMoveQty: (q: number) => void;
  invMoveNote: string;
  setInvMoveNote: (n: string) => void;
  invCommit: () => void;
  invClose: () => void;
  invMovements: any[];
}

export function InventoryView({
  t,
  invQuery,
  setInvQuery,
  invOnlyCritical,
  setInvOnlyCritical,
  invCritical,
  invFiltered,
  invOpen,
  invEditorOpen,
  invSelected,
  invMoveType,
  setInvMoveType,
  invMoveQty,
  setInvMoveQty,
  invMoveNote,
  setInvMoveNote,
  invCommit,
  invClose,
  invMovements,
}: InventoryViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.inventory}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Control de insumos, stock crítico y movimientos.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Nuevo item
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Stock Critico</div>
          <div className="text-3xl font-black text-rose-500 tracking-tight">{invCritical.length}</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Insumos por agotar</div>
        </div>
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Movimientos Hoy</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">12</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Entradas y salidas</div>
        </div>
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Valor Estimado</div>
          <div className="text-3xl font-black text-emerald-600 tracking-tight">$14.2k</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Costo total stock</div>
        </div>
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pendiente</div>
          <div className="text-3xl font-black text-sky-500 tracking-tight">2</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Ordenes de compra</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex-1">
                <PackageSearch className="w-4 h-4 text-slate-400" />
                <input
                  value={invQuery}
                  onChange={(e) => setInvQuery(e.target.value)}
                  placeholder="Buscar por insumo o SKU..."
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                />
              </div>
              <button
                onClick={() => setInvOnlyCritical((v: boolean) => !v)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest",
                  invOnlyCritical
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                )}
              >
                <AlertTriangle className="w-4 h-4" /> Criticos
              </button>
            </div>

            <div className="space-y-4">
              {invFiltered.map((it) => (
                <div
                  key={it.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0",
                        it.onHand <= it.min
                          ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400"
                      )}
                    >
                      <Box className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white truncate">{it.name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{it.sku}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>Actualizado: {new Date(it.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span>Min: {it.min} {it.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="text-right">
                      <div className={cn("text-xl font-black", it.onHand <= it.min ? "text-rose-500" : "text-slate-900 dark:text-white")}>
                        {it.onHand} {it.unit}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">Stock actual</div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => invOpen(it.id, "in")}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => invOpen(it.id, "out")}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => invOpen(it.id, "adjust")}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Historial</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Recientes</div>
          </div>
          <div className="space-y-6">
            {invMovements.map((m) => (
              <div key={m.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800/60 pb-1">
                <div
                  className={cn(
                    "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                    m.type === "in" ? "bg-emerald-500" : m.type === "out" ? "bg-amber-500" : "bg-slate-400"
                  )}
                />
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
                  {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {m.type === "in" ? "+" : ""}{m.qty} {m.note}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
            <History className="w-4 h-4" /> Ver log completo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {invEditorOpen && invSelected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={invClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-32 md:w-[480px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
                    <Box className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Movimiento de inventario</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{invSelected.name}</div>
                  </div>
                </div>
                <button onClick={invClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {(["in", "out", "adjust"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setInvMoveType(t)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                        invMoveType === t
                          ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {t === "in" ? "Entrada" : t === "out" ? "Salida" : "Ajuste"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Cantidad ({invSelected.unit})</label>
                    <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      {invMoveType === "out" ? <MinusCircle className="w-4 h-4 text-amber-500" /> : <PlusCircle className="w-4 h-4 text-emerald-500" />}
                      <input
                        type="number"
                        value={invMoveQty}
                        onChange={(e) => setInvMoveQty(Number(e.target.value))}
                        className="w-full bg-transparent outline-none text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Stock Resultante</label>
                    <div className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-sm text-slate-400">
                      {Math.max(0, invSelected.onHand + (invMoveType === "in" ? invMoveQty : invMoveType === "out" ? -invMoveQty : invMoveQty))} {invSelected.unit}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nota (Opcional)</label>
                  <input
                    value={invMoveNote}
                    onChange={(e) => setInvMoveNote(e.target.value)}
                    placeholder="Ej. Compra semanal, Merma por calor..."
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <button
                  onClick={invCommit}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Confirmar movimiento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
