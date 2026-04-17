"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  PackageSearch,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffViewProps {
  t: any;
  staffQuery: string;
  setStaffQuery: (q: string) => void;
  staffFiltered: any[];
  staffOpenCreate: () => void;
  staffOpenEdit: (id: string) => void;
  staffEditorOpen: boolean;
  staffEditingId: string | null;
  staffForm: any;
  setStaffForm: (f: any) => void;
  staffSave: () => void;
  staffClose: () => void;
}

export function StaffView({
  t,
  staffQuery,
  setStaffQuery,
  staffFiltered,
  staffOpenCreate,
  staffOpenEdit,
  staffEditorOpen,
  staffEditingId,
  staffForm,
  setStaffForm,
  staffSave,
  staffClose,
}: StaffViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.staff}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Roles, estado y ultima actividad.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button onClick={staffOpenCreate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> Nuevo usuario
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Equipo</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Busqueda y roles</p>
            </div>
            <div className="w-full md:w-[360px]">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <PackageSearch className="w-4 h-4 text-slate-400" />
                <input value={staffQuery} onChange={(e) => setStaffQuery(e.target.value)} placeholder="Buscar por nombre o rol..." className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {staffFiltered.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white">{u.name}</div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    Rol: <span className="font-bold">{u.role}</span> · Ultima actividad:{" "}
                    <span className="font-bold">{new Date(u.lastActiveAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border", u.active ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-500/10" : "border-slate-200 text-slate-500 bg-white dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950/30")}>
                    {u.active ? "Activo" : "Inactivo"}
                  </div>
                  <button onClick={() => staffOpenEdit(u.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest">
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Permisos</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Roles</div>
          </div>
          <div className="space-y-3">
            {[
              { role: "Admin", desc: "Acceso total, usuarios y configuracion." },
              { role: "Gerente", desc: "Reportes, inventario, proveedores, ajustes." },
              { role: "Cajero", desc: "POS y registro de ventas." },
              { role: "Cocina", desc: "Produccion y consumos (siguiente)." },
            ].map((r) => (
              <div key={r.role} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                <div className="text-sm font-black text-slate-900 dark:text-white">{r.role}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {staffEditorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={staffClose} />
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Personal</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{staffEditingId ? "Editar usuario" : "Nuevo usuario"}</div>
                </div>
                <button onClick={staffClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Nombre</div>
                  <input value={staffForm.name} onChange={(e) => setStaffForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="Nombre" className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Rol</div>
                  <select value={staffForm.role} onChange={(e) => setStaffForm((f: any) => ({ ...f, role: e.target.value as any }))} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
                    <option value="Admin">Admin</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Cocina">Cocina</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Estado</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{staffForm.active ? "Activo" : "Inactivo"}</div>
                  </div>
                  <button onClick={() => setStaffForm((f: any) => ({ ...f, active: !f.active }))} className={cn("w-12 h-7 rounded-full border transition-all relative", staffForm.active ? "bg-emerald-600 border-emerald-600" : "bg-white/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800")} aria-label="Toggle active">
                    <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm", staffForm.active ? "left-6" : "left-1")} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={staffClose} className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                  Cancelar
                </button>
                <button onClick={staffSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
