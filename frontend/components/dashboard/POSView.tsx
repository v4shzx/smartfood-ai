"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  ClipboardList,
  PackageSearch,
  Store,
  Plus,
  Minus,
  DollarSign,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  Tag as TagIcon
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
  posCheckout: (method: "Cash" | "Card") => void;
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
  posCheckout,
  setActiveTab,
}: POSViewProps) {
  const { lang } = useI18n();

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black leading-none tracking-tight text-slate-900 dark:text-white sm:text-4xl">{t.dashboard.pos}</h1>
          <p className="mt-3 text-base font-normal text-slate-500 dark:text-slate-400 sm:text-lg">{t.dashboard.pos_subtitle}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-3 lg:gap-8 lg:pb-10">
        {/* Catalog */}
        <div className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 lg:col-span-2 lg:rounded-[2.5rem] lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.store}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-normal mt-1 uppercase tracking-widest">{t.dashboard.quick_search}</p>
            </div>
            <div className="w-full md:w-[320px]">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <PackageSearch className="w-4 h-4 text-slate-400" />
                <input
                  value={posQuery}
                  onChange={(e) => setPosQuery(e.target.value)}
                  placeholder={t.dashboard.search_products}
                  className="w-full bg-transparent outline-none text-sm font-normal text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto pr-1 sm:pr-3 sm:-mr-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scroll-smooth">
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {posFilteredProducts.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => posAdd(p.id)}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className="px-4 pt-4 flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate max-w-[80px]">
                        {p.category}
                      </span>
                      <span className={cn(
                        "text-[8px] font-bold uppercase tracking-wider mt-0.5",
                        p.on_hand <= p.min_stock ? "text-rose-500" : "text-emerald-500"
                        )}>
                        {t.dashboard.stock}: {p.on_hand}
                        </span>
                        </div>                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Body */}
                  <div className="p-4 pt-2 flex flex-col flex-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-4 text-left line-clamp-2 min-h-[2.5rem]">
                      {p.name}
                    </h4>
                    
                    <div className="mt-auto flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyMXN(p.price)}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Column */}
        <div className="space-y-4 lg:space-y-6">
          <button
            onClick={posClear}
            className="group flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-rose-200/50 bg-rose-50/50 px-5 py-4 text-xs font-black uppercase tracking-widest text-rose-600 transition-all duration-300 active:scale-[0.98] hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/15 lg:rounded-[1.8rem]"
          >
            <Trash2 className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" /> 
            {t.dashboard.clear_cart}
          </button>

          <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:rounded-[2.5rem]">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 pb-4 dark:border-slate-800/60 sm:p-6 lg:p-8 lg:pb-4">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.cart}</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{posCartLines.length} {t.dashboard.items}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 no-scrollbar sm:max-h-[450px] sm:p-6">
              <AnimatePresence initial={false}>
                {posCartLines.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center text-center px-6"
                  >
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                      {t.dashboard.add_items_to_start}
                    </div>
                  </motion.div>
                ) : (
                  posCartLines.map((l) => (
                    <motion.div 
                      key={l.lineKey}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex items-center gap-4 p-4 rounded-[1.8rem] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800/60 hover:border-emerald-500/20 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-emerald-600">{l.qty}x</span>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-black text-slate-900 dark:text-white truncate">{l.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {formatCurrencyMXN(l.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={() => posDec(l.id)} 
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => posAdd(l.id)} 
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-5 pt-6 dark:border-slate-800/60 dark:bg-slate-800/20 sm:p-6 lg:p-8 lg:pt-6">
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span>{t.dashboard.subtotal}</span>
                  <span className="text-slate-600 dark:text-slate-300">{formatCurrencyMXN(posSubtotal)}</span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <TagIcon className="w-3.5 h-3.5" />
                    <span>{t.dashboard.discount}</span>
                  </div>
                  <div className="w-[100px] flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner">
                    <span className="text-[10px] font-black text-slate-400">$</span>
                    <input
                      inputMode="numeric"
                      value={posDiscount}
                      onChange={(e) => setPosDiscount(Number(e.target.value || 0))}
                      className="w-full bg-transparent outline-none text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t.dashboard.total}</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{formatCurrencyMXN(posTotal)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => posCheckout("Cash")}
                  disabled={posCartLines.length === 0}
                  className="group relative flex items-center justify-between bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>{t.dashboard.checkout_cash}</span>
                  </div>
                  <span className="font-black opacity-80">{formatCurrencyMXN(posTotal)}</span>
                </button>

                <button
                  onClick={() => posCheckout("Card")}
                  disabled={posCartLines.length === 0}
                  className="group flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 text-slate-900 dark:text-white px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-sm hover:border-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 group-hover:rotate-12 transition-transform text-emerald-500" />
                    <span>{t.dashboard.checkout_card}</span>
                  </div>
                  <span className="font-black opacity-60">{formatCurrencyMXN(posTotal)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
