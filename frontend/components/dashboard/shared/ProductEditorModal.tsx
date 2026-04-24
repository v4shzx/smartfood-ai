"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Save, PlusCircle, Tag, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductEditorModalProps {
  t: any;
  isOpen: boolean;
  editingId: string | null;
  form: any;
  setForm: (f: any) => void;
  categories: string[];
  onSave: () => void;
  onClose: () => void;
  lang: string;
}

export function ProductEditorModal({
  t,
  isOpen,
  editingId,
  form,
  setForm,
  categories,
  onSave,
  onClose,
  lang
}: ProductEditorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] sm:rounded-[3rem] shadow-2xl"
          >
            {/* Header */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 px-5 sm:px-8 py-5 sm:py-8 border-b border-slate-100 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 shadow-sm">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {editingId ? t.dashboard.edit : t.dashboard.new} {t.dashboard.product}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest opacity-70">
                    SmartFood Inventory Management
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {/* Campo de Nombre - Full Width */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                  {t.dashboard.product_name}
                </label>
                <div className="relative group">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.dashboard.eg_taco}
                    className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Grid para Categoría, Precio y Stock Mínimo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                    {t.dashboard.category}
                  </label>
                  <div className="relative group">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{lang === 'es' ? 'Selecciona categoría' : 'Select category'}</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Tag className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-1">
                    {t.dashboard.price_mxn}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-emerald-500 font-black text-sm">$</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-5 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400 dark:text-rose-500 ml-1">
                    Stock Mínimo
                  </label>
                  <div className="relative flex items-center group">
                    <div className="absolute left-5 pointer-events-none text-rose-500">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      value={form.min_stock}
                      onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })}
                      className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Toggle de Disponibilidad */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 sm:p-6 rounded-3xl bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-500/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    form.available ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  )}>
                    <PlusCircle className={cn("w-6 h-6", form.available ? "animate-pulse" : "")} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{t.dashboard.availability}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      {form.available ? (lang === 'es' ? 'Visible en el punto de venta' : 'Visible in POS') : (lang === 'es' ? 'Oculto del punto de venta' : 'Hidden from POS')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setForm({ ...form, available: !form.available })}
                  className={cn(
                    "w-14 h-8 rounded-full transition-all relative",
                    form.available ? "bg-emerald-500 shadow-inner" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow-md",
                    form.available ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Acciones */}
              <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                <button
                  onClick={onSave}
                  className="w-full md:flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-4 h-4" /> {t.dashboard.save_changes}
                </button>
                <button
                  onClick={onClose}
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
  );
}
