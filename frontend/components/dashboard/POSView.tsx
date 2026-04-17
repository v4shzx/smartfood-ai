"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  X,
  ClipboardList,
  PackageSearch,
  Store,
  Plus,
  DollarSign,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";

interface POSViewProps {
  t: any;
  posQuery: string;
  setPosQuery: (q: string) => void;
  posFilteredProducts: any[];
  posAdd: (id: string) => void;
  posDec: (id: string) => void;
  posClear: () => void;
  posCartLines: any[];
  posSubtotal: number;
  posDiscount: number;
  setPosDiscount: (d: number) => void;
  posTotal: number;
  setActiveTab: (tab: any) => void;
}

export function POSView({
  t,
  posQuery,
  setPosQuery,
  posFilteredProducts,
  posAdd,
  posDec,
  posClear,
  posCartLines,
  posSubtotal,
  posDiscount,
  setPosDiscount,
  posTotal,
  setActiveTab,
}: POSViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.pos}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Crea ventas rapido: productos, carrito, descuento y pago.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
          <button
            onClick={posClear}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-rose-500/40 transition-all shadow-sm text-rose-600 dark:text-rose-300"
          >
            <X className="w-4 h-4" /> Limpiar
          </button>
          <button
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            onClick={() => setActiveTab("sales")}
          >
            <ClipboardList className="w-4 h-4" /> Ver registro
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Catalog */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Catalogo</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Busqueda rapida</p>
            </div>
            <div className="w-full md:w-[320px]">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <PackageSearch className="w-4 h-4 text-slate-400" />
                <input
                  value={posQuery}
                  onChange={(e) => setPosQuery(e.target.value)}
                  placeholder="Buscar producto o categoria..."
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
          <div className="max-h-[820px] overflow-y-auto pr-3 -mr-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scroll-smooth">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posFilteredProducts.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => posAdd(p.id)}
                  className="group relative flex flex-col h-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-800/40 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/5 dark:to-black/20" />
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-800/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Store className="w-7 h-7 text-slate-400 dark:text-slate-600" />
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatCurrencyMXN(p.price)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-1 h-1 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{p.category}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-5 line-clamp-2">{p.name}</h4>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors">
                        Añadir
                      </div>
                      <div className="w-9 h-9 rounded-2xl bg-slate-50 dark:bg-slate-800/30 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white shadow-sm transition-all duration-300">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Carrito</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{posCartLines.length} items</div>
          </div>
          <div className="space-y-3">
            {posCartLines.length === 0 && (
              <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                Agrega productos desde el catalogo.
              </div>
            )}
            {posCartLines.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-800/60">
                <div className="min-w-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white truncate">{l.name}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                    {formatCurrencyMXN(l.price)} c/u
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => posDec(l.id)} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 font-black text-slate-700 dark:text-slate-200">
                    -
                  </button>
                  <div className="w-10 text-center font-black text-slate-900 dark:text-white">{l.qty}</div>
                  <button onClick={() => posAdd(l.id)} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 font-black text-slate-700 dark:text-slate-200">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>Subtotal</span>
              <span className="font-black">{formatCurrencyMXN(posSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-600 dark:text-slate-300">Descuento</div>
              <div className="w-[140px] flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <input
                  inputMode="numeric"
                  value={posDiscount}
                  onChange={(e) => setPosDiscount(Number(e.target.value || 0))}
                  className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white">
              <span>Total</span>
              <span className="font-black">{formatCurrencyMXN(posTotal)}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              disabled={posCartLines.length === 0}
              className="flex items-center justify-between gap-3 bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Pagar (Efectivo)</span>
              <span>{formatCurrencyMXN(posTotal)}</span>
            </button>
            <button
              disabled={posCartLines.length === 0}
              className="flex items-center justify-between gap-3 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 disabled:opacity-60 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
            >
              <span>Pagar (Tarjeta)</span>
              <span>{formatCurrencyMXN(posTotal)}</span>
            </button>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
              Ticket/factura, promociones e integracion con inventario: siguiente iteracion.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
