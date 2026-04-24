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
  Pencil,
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
  storeOpenCreate: () => void;
  storeOpenEdit: (id: string) => void;
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
  storeOpenCreate,
  storeOpenEdit,
}: InventoryViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {t.dashboard.inventory}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">
            {t.dashboard.inventory_desc}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button 
            onClick={storeOpenCreate}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" /> {t.dashboard.new_item}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors" />
          <div className="relative">
            <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t.dashboard.critical_stock}</div>
            <div className="text-4xl font-black text-rose-500 tracking-tight">{invCritical.length}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest opacity-70">{t.dashboard.insumos_to_deplete}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="relative">
            <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t.dashboard.total_sku}</div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{invFiltered.length}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest opacity-70">{t.dashboard.products_in_catalog}</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8 pb-10">
        <div className="bg-white dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 flex-1 max-w-2xl",
                invQuery ? "bg-white dark:bg-slate-950 border-emerald-500/30 ring-4 ring-emerald-500/5" : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
              )}>
                <PackageSearch className={cn("w-5 h-5 transition-colors", invQuery ? "text-emerald-500" : "text-slate-400")} />
                <input
                  value={invQuery}
                  onChange={(e) => setInvQuery(e.target.value)}
                  placeholder={t.dashboard.search_insumo_sku}
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
                {invQuery && (
                  <button onClick={() => setInvQuery("")} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInvOnlyCritical((v: boolean) => !v)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-[0.2em]",
                    invOnlyCritical
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 shadow-lg shadow-rose-500/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  )}
                >
                  <AlertTriangle className={cn("w-4 h-4", invOnlyCritical ? "animate-pulse" : "")} />
                  {t.dashboard.critical_items}
                </button>
                
                <button 
                  onClick={() => {
                    setInvQuery("");
                    setInvOnlyCritical(false);
                  }}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
                  title="Limpiar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {invFiltered.map((it) => (
                <motion.div
                  layout
                  key={it.id}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-105",
                        it.on_hand <= it.min_stock
                          ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300 shadow-lg shadow-rose-500/10"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-300 group-hover:text-emerald-500"
                      )}
                    >
                      <Box className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{it.name}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest">{it.sku}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium uppercase tracking-wider opacity-70">
                        <span className="flex items-center gap-1.5"><History className="w-3 h-3" /> {new Date(it.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Min: {it.min_stock} {it.unit}</span>
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">$ {it.price} / {it.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 justify-between md:justify-end">
                    <div className="text-right group-hover:opacity-40 transition-opacity duration-300">
                      <div className={cn(
                        "text-3xl font-black tracking-tight",
                        it.on_hand <= it.min_stock ? "text-rose-500" : "text-slate-900 dark:text-white"
                      )}>
                        {it.on_hand} <span className="text-sm font-bold opacity-50 ml-1">{it.unit}</span>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mt-1">{t.dashboard.current_stock}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => storeOpenEdit(it.id)}
                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all active:scale-90 shadow-sm"
                        title={t.dashboard.edit}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => invOpen(it.id, "in")}
                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-90 shadow-sm"
                        title={t.dashboard.entry}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => invOpen(it.id, "out")}
                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-500/30 transition-all active:scale-90 shadow-sm"
                        title={t.dashboard.exit}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => invOpen(it.id, "adjust")}
                        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-all active:scale-90 shadow-sm"
                        title={t.dashboard.adjust}
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>

      <AnimatePresence>
        {invEditorOpen && invSelected && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl"
          >
            <div className="absolute inset-0" onClick={invClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 px-8 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Box className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {t.dashboard.inventory_movement}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">
                      {invSelected.name} • {invSelected.sku}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={invClose} 
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                {/* Selector de Tipo de Movimiento */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">Tipo de Operación</label>
                  <div className="flex p-1.5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    {(["in", "out", "adjust"] as const).map((ti) => (
                      <button
                        key={ti}
                        onClick={() => setInvMoveType(ti)}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                          invMoveType === ti
                            ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/5 border border-slate-100 dark:border-slate-700"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                      >
                        {ti === "in" ? t.dashboard.entry : ti === "out" ? t.dashboard.exit : t.dashboard.adjust}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid para Cantidad y Resultado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                      {t.dashboard.quantity} ({invSelected.unit})
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-5 pointer-events-none transition-colors group-focus-within:text-emerald-500">
                        {invMoveType === "out" ? <MinusCircle className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <input
                        type="number"
                        value={invMoveQty}
                        onChange={(e) => setInvMoveQty(Number(e.target.value))}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-5 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                      {t.dashboard.resulting_stock}
                    </label>
                    <div className="h-[54px] px-6 flex items-center bg-slate-50/30 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl font-black text-sm text-slate-400">
                      <TrendingUp className="w-4 h-4 mr-3 opacity-30" />
                      {Math.max(0, invSelected.on_hand + (invMoveType === "in" ? invMoveQty : invMoveType === "out" ? -invMoveQty : invMoveQty))} {invSelected.unit}
                    </div>
                  </div>
                </div>

                {/* Nota */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                    {t.dashboard.note} <span className="opacity-50 font-medium">({t.dashboard.optional})</span>
                  </label>
                  <div className="relative group">
                    <input
                      value={invMoveNote}
                      onChange={(e) => setInvMoveNote(e.target.value)}
                      placeholder={t.dashboard.eg_purchase}
                      className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                  <button
                    onClick={invCommit}
                    className="w-full md:flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {t.dashboard.confirm_movement}
                  </button>
                  <button
                    onClick={invClose}
                    className="w-full md:w-auto px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                  >
                    {t.dashboard.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
