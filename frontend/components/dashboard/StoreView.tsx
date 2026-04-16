"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Plus,
  PackageSearch,
  Pencil,
  Trash2,
  X,
  PlusCircle,
  Save,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

interface StoreViewProps {
  t: any;
  storeQuery: string;
  setStoreQuery: (q: string) => void;
  storeCategory: string;
  setStoreCategory: (c: any) => void;
  storeCategories: string[];
  storeOnlyAvailable: boolean;
  setStoreOnlyAvailable: (v: any) => void;
  storeFiltered: any[];
  storeOpenCreate: () => void;
  storeOpenEdit: (id: string) => void;
  storeDelete: (id: string) => void;
  storeEditorOpen: boolean;
  storeEditingId: string | null;
  storeForm: any;
  setStoreForm: (f: any) => void;
  storeSave: () => void;
  storeCloseEditor: () => void;
}

export function StoreView({
  t,
  storeQuery,
  setStoreQuery,
  storeCategory,
  setStoreCategory,
  storeCategories,
  storeOnlyAvailable,
  setStoreOnlyAvailable,
  storeFiltered,
  storeOpenCreate,
  storeOpenEdit,
  storeDelete,
  storeEditorOpen,
  storeEditingId,
  storeForm,
  setStoreForm,
  storeSave,
  storeCloseEditor,
}: StoreViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <Store className="w-3.5 h-3.5" /> {t.dashboard.store}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.store}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Productos, categorias, precios e imagenes.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button
            onClick={storeOpenCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <PackageSearch className="w-4 h-4 text-slate-400" />
              <input
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
                placeholder="Buscar producto o categoria..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div>
            <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Categoria</div>
              <select
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value as typeof storeCategory)}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
              >
                <option value="all">Todas</option>
                {storeCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Disponibles</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">Solo activos</div>
            </div>
            <button
              onClick={() => setStoreOnlyAvailable((v: boolean) => !v)}
              className={cn(
                "w-12 h-7 rounded-full border transition-all relative",
                storeOnlyAvailable
                  ? "bg-emerald-600 border-emerald-600"
                  : "bg-white/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800"
              )}
              aria-label="Toggle availability filter"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                  storeOnlyAvailable ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {storeFiltered.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center relative">
              <Store className="w-10 h-10 text-slate-300" />
              {!p.available && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">Agotado</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", p.available ? "bg-emerald-500" : "bg-rose-500")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{p.category}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white truncate">{p.name}</h4>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrencyMXN(p.price)}</div>
              
              <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => storeOpenEdit(p.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => storeDelete(p.id)}
                  className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        <button
          onClick={storeOpenCreate}
          className="flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:bg-white dark:hover:bg-slate-800/40 hover:border-emerald-500/40 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-sm">
            <PlusCircle className="w-7 h-7" />
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-slate-900 dark:text-white">Nuevo producto</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Añadir al menu</div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {storeEditorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={storeCloseEditor} />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute right-4 left-4 md:left-auto md:right-10 top-20 md:top-24 md:w-[480px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{storeEditingId ? "Editar" : "Nuevo"}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">Producto</div>
                </div>
                <button onClick={storeCloseEditor} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre del producto</label>
                  <input
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    placeholder="Ej. Taco al Pastor"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Categoria</label>
                    <select
                      value={storeForm.category}
                      onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value as any })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                    >
                      {storeCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Precio (MXN)</label>
                    <input
                      type="number"
                      value={storeForm.price}
                      onChange={(e) => setStoreForm({ ...storeForm, price: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">Disponibilidad</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5">Mostrar en el POS</div>
                  </div>
                  <button
                    onClick={() => setStoreForm({ ...storeForm, available: !storeForm.available })}
                    className={cn(
                      "w-12 h-7 rounded-full border transition-all relative",
                      storeForm.available
                        ? "bg-emerald-600 border-emerald-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm", storeForm.available ? "left-6" : "left-1")} />
                  </button>
                </div>

                <button
                  onClick={storeSave}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
