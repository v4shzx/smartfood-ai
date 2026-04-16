"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Plus,
  PackageSearch,
  Phone,
  Mail,
  ChevronRight,
  Star,
  CalendarRange,
  Building2,
  X,
  Pencil,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SuppliersViewProps {
  t: any;
  supQuery: string;
  setSupQuery: (q: string) => void;
  supFiltered: any[];
  supSelected: any;
  setSupSelectedId: (id: string) => void;
  supOpenCreate: () => void;
  supOpenEdit: (id: string) => void;
  supEditorOpen: boolean;
  supEditingId: string | null;
  supForm: any;
  setSupForm: (f: any) => void;
  supSave: () => void;
  supClose: () => void;
}

export function SuppliersView({
  t,
  supQuery,
  setSupQuery,
  supFiltered,
  supSelected,
  setSupSelectedId,
  supOpenCreate,
  supOpenEdit,
  supEditorOpen,
  supEditingId,
  supForm,
  setSupForm,
  supSave,
  supClose,
}: SuppliersViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <Share2 className="w-3.5 h-3.5" /> {t.dashboard.suppliers}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.suppliers}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Directorio de contacto, tiempos de entrega y notas.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button
            onClick={supOpenCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo proveedor
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <PackageSearch className="w-4 h-4 text-slate-400" />
              <input
                value={supQuery}
                onChange={(e) => setSupQuery(e.target.value)}
                placeholder="Buscar por nombre, contacto, email..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            {supFiltered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSupSelectedId(s.id)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 group",
                  supSelected?.id === s.id
                    ? "bg-emerald-50/40 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
                    : "bg-slate-50/40 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900 dark:text-white truncate">{s.name}</div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{s.contact} · {s.leadDays} dias entrega</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-1 text-amber-500 text-[12px] font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> {s.rating}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm h-fit">
          {supSelected ? (
            <>
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{supSelected.name}</h3>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Detalles del contacto</div>
                </div>
                <button
                  onClick={() => supOpenEdit(supSelected.id)}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors shadow-sm"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-bold">{supSelected.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-bold truncate">{supSelected.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Lead Time</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CalendarRange className="w-3.5 h-3.5" /> {supSelected.leadDays} dias
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Rating</div>
                    <div className="text-sm font-black text-amber-500 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> {supSelected.rating}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Notas</div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[12px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {supSelected.notes || "Sin notas adicionales."}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Historial</div>
                  <div className="text-[12px] font-bold text-slate-500">
                    Ultima compra: {supSelected.lastPurchaseAt ? new Date(supSelected.lastPurchaseAt).toLocaleDateString() : "Nunca"}
                  </div>
                  <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all">
                    Generar Orden Compra
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <Building2 className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <div className="text-sm font-black text-slate-400">Selecciona un proveedor para ver detalles</div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {supEditorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={supClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="absolute right-4 left-4 md:left-auto md:right-10 top-20 md:top-24 md:w-[500px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{supEditingId ? "Editar" : "Nuevo"}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">Proveedor</div>
                </div>
                <button onClick={supClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Razon Social / Nombre</label>
                  <input
                    value={supForm.name}
                    onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contacto</label>
                    <input
                      value={supForm.contact}
                      onChange={(e) => setSupForm({ ...supForm, contact: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lead Time (Dias)</label>
                    <input
                      type="number"
                      value={supForm.leadDays}
                      onChange={(e) => setSupForm({ ...supForm, leadDays: Number(e.target.value) })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Telefono</label>
                  <input
                    value={supForm.phone}
                    onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</label>
                  <input
                    value={supForm.email}
                    onChange={(e) => setSupForm({ ...supForm, email: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Notas</label>
                  <textarea
                    rows={3}
                    value={supForm.notes}
                    onChange={(e) => setSupForm({ ...supForm, notes: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 outline-none text-sm font-bold focus:border-emerald-500/40 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={supSave}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
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
