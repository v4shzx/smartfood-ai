"use client";

import React, { useState } from "react";
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
  Tag
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
  createCategory: (name: string) => Promise<boolean>;
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
  createCategory,
}: StoreViewProps) {
  const { lang } = useI18n();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCatSaving, setIsCatSaving] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsCatSaving(true);
    const success = await createCategory(newCatName.trim());
    if (success) {
      setIsAddingCategory(false);
      setNewCatName("");
    } else {
      alert("Error al crear la categoría. Tal vez ya existe.");
    }
    setIsCatSaving(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.store}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">{t.dashboard.store_desc}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm text-slate-600 dark:text-slate-300 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> {lang === 'es' ? 'Nueva categoría' : (lang === 'fr' ? 'Nouvelle catégorie' : 'New category')}
          </button>
          <button
            onClick={storeOpenCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> {t.dashboard.new_product}
          </button>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Búsqueda rápida</label>
            <div className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300",
              storeQuery ? "bg-white dark:bg-slate-950 border-emerald-500/30 ring-4 ring-emerald-500/5" : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
            )}>
              <PackageSearch className={cn("w-4 h-4 transition-colors", storeQuery ? "text-emerald-500" : "text-slate-400")} />
              <input
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
                placeholder={t.dashboard.search_product_category}
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
              {storeQuery && (
                <button onClick={() => setStoreQuery("")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">{t.dashboard.category}</label>
            <div className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <select
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">{t.dashboard.all_categories_f}</option>
                {storeCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Disponibilidad</label>
            <button
              onClick={() => setStoreOnlyAvailable(!storeOnlyAvailable)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all duration-300",
                storeOnlyAvailable ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", storeOnlyAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-700")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.dashboard.active_only}</span>
              </div>
              <div className={cn(
                "w-8 h-4 rounded-full border transition-all relative shrink-0",
                storeOnlyAvailable ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              )}>
                <div className={cn("w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm", storeOnlyAvailable ? "left-4.5" : "left-0.5")} />
              </div>
            </button>
          </div>

          <button 
            onClick={() => {
              setStoreQuery("");
              setStoreCategory("all");
              setStoreOnlyAvailable(false);
            }}
            className="h-[46px] flex items-center justify-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
          >
            <X className="w-3.5 h-3.5" /> Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-12">
        {storeFiltered.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500"
          >
            <div className="relative h-full bg-slate-50/50 dark:bg-slate-950/40 rounded-[2.2rem] p-7 overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
              
              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.available ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        {p.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h4>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => storeOpenEdit(p.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all active:scale-90"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => storeDelete(p.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!p.available && (
                   <div className="mb-4">
                     <span className="inline-flex items-center bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-500/20">
                       {t.dashboard.sold_out}
                     </span>
                   </div>
                )}

                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-none">Precio venta</div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      <span className="text-lg mr-1 text-emerald-500 font-bold">$</span>
                      {p.price}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <button
          onClick={storeOpenCreate}
          className="group relative bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 hover:border-emerald-500/40 transition-all duration-500"
        >
          <div className="h-full flex flex-col items-center justify-center gap-5 p-10 bg-transparent rounded-[2.2rem] group-hover:bg-white dark:group-hover:bg-slate-800/40 transition-all">
            <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-sm">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="text-base font-black text-slate-900 dark:text-white">{t.dashboard.new_product}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1.5">{t.dashboard.add_to_menu}</div>
            </div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isAddingCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsAddingCategory(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl overflow-hidden">
              <button onClick={() => setIsAddingCategory(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{lang === 'es' ? 'Nueva Categoría' : 'New Category'}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Organiza tus productos con etiquetas personalizadas.</p>
                </div>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre de la Categoría</label>
                  <input
                    required
                    autoFocus
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ej. Bebidas, Desayunos..."
                    className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isCatSaving}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isCatSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {t.dashboard.save_changes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    {t.dashboard.cancel}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
