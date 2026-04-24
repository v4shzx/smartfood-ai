"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Download,
  ShoppingCart,
  PackageSearch,
  X,
  TrendingUp,
  Receipt,
  DollarSign,
  Calendar
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
  const { lang } = useI18n();

  const totalIncomes = salesFiltered.reduce((acc, s) => acc + s.total, 0);
  const avgTicket = salesFiltered.length ? totalIncomes / salesFiltered.length : 0;

  const handleExportPDF = () => {
    if (!selectedSale) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const itemsHtml = selectedSale.items_detail?.map((li: any) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${li.quantity}x ${li.name}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${formatCurrencyMXN(li.price * li.quantity)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket ${selectedSale.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .totals { text-align: right; border-top: 2px solid #333; padding-top: 20px; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">SMARTFOOD AI</h1>
            <p style="margin: 5px 0; color: #666;">Reporte de Transacción Digital</p>
          </div>
          
          <div class="details">
            <div>
              <strong>Folio:</strong> ${selectedSale.id}<br>
              <strong>Cajero:</strong> ${selectedSale.cashier || 'Admin'}
            </div>
            <div style="text-align: right;">
              <strong>Fecha:</strong> ${new Date(selectedSale.ts).toLocaleString()}<br>
              <strong>Método:</strong> ${selectedSale.method === 'cash' ? 'Efectivo' : 'Tarjeta'}
            </div>
          </div>

          <table>
            <thead>
              <tr style="border-bottom: 2px solid #eee;">
                <th style="text-align: left; padding-bottom: 10px;">Descripción</th>
                <th style="text-align: right; padding-bottom: 10px;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <p style="margin: 5px 0;">Subtotal: <strong>${formatCurrencyMXN(selectedSale.subtotal || selectedSale.total)}</strong></p>
            <p style="margin: 5px 0;">Descuento: <strong>-${formatCurrencyMXN(selectedSale.discount || 0)}</strong></p>
            <h2 style="margin-top: 10px; color: #10b981;">TOTAL: ${formatCurrencyMXN(selectedSale.total)}</h2>
          </div>

          <div class="footer">
            <p>Este documento es un comprobante de venta digital generado por SmartFood AI.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.sales}</h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 font-normal">{t.dashboard.sales_desc}</p>
        </motion.div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <div className="bg-white dark:bg-slate-900/60 p-5 sm:p-6 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 dark:text-slate-500 text-[12px] font-black uppercase tracking-widest">{t.dashboard.incomes}</div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatCurrencyMXN(totalIncomes)}</div>
          <div className="text-[11px] text-slate-400 font-normal mt-1.5 uppercase tracking-wider">{t.dashboard.filtered}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 sm:p-6 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 dark:text-slate-500 text-[12px] font-black uppercase tracking-widest">{t.dashboard.tickets}</div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{salesFiltered.length}</div>
          <div className="text-[11px] text-slate-400 font-normal mt-1.5 uppercase tracking-wider">{t.dashboard.results}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 sm:p-6 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 dark:text-slate-500 text-[12px] font-black uppercase tracking-widest">{t.dashboard.avg_ticket}</div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatCurrencyMXN(avgTicket)}</div>
          <div className="text-[11px] text-slate-400 font-normal mt-1.5 uppercase tracking-wider">Promedio del periodo</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 md:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 gap-4 items-end xl:grid-cols-5">
          <div className="space-y-2 xl:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Búsqueda rápida</label>
            <div className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300",
              salesQuery ? "bg-white dark:bg-slate-950 border-emerald-500/30 ring-4 ring-emerald-500/5" : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
            )}>
              <PackageSearch className={cn("w-4 h-4 transition-colors", salesQuery ? "text-emerald-500" : "text-slate-400")} />
              <input
                value={salesQuery}
                onChange={(e) => setSalesQuery(e.target.value)}
                placeholder={t.dashboard.search_sales}
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
              {salesQuery && (
                <button onClick={() => setSalesQuery("")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">{t.dashboard.method}</label>
            <div className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <select
                value={salesMethod}
                onChange={(e) => setSalesMethod(e.target.value as "all" | "cash" | "card")}
                className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">{t.dashboard.all}</option>
                <option value="cash">{t.dashboard.cash}</option>
                <option value="card">{t.dashboard.card}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 xl:col-span-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">{t.dashboard.from}</label>
              <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <input
                  type="date"
                  value={salesDateFrom}
                  onChange={(e) => setSalesDateFrom(e.target.value)}
                  className="w-full bg-transparent outline-none text-[11px] font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">{t.dashboard.to}</label>
              <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <input
                  type="date"
                  value={salesDateTo}
                  onChange={(e) => setSalesDateTo(e.target.value)}
                  className="w-full bg-transparent outline-none text-[11px] font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setSalesQuery("");
              setSalesMethod("all");
              setSalesDateFrom("");
              setSalesDateTo("");
            }}
            className="h-[46px] flex items-center justify-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
          >
            <X className="w-3.5 h-3.5" /> Limpiar filtros
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm pb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.transactions}</h3>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{salesFiltered.length} {t.dashboard.results}</div>
        </div>

        <div className="space-y-3">
          {salesFiltered.map((s) => {
            const d = new Date(s.ts);
            const methodLabel = s.method === "cash" ? t.dashboard.cash : t.dashboard.card;
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
                      {d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} · {t.dashboard.cashier}:{" "}
                      <span className="font-bold">{s.cashier || "Admin"}</span> · Items: <span className="font-bold">{s.items_count}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(s.total)}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mt-1">{t.dashboard.view_detail}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedSale && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setSelectedSaleId(null)} />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-6 md:p-10 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.dashboard.detail}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedSale.id}</div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(selectedSale.ts).toLocaleString()} · {t.dashboard.cashier}: <span className="font-bold">{selectedSale.cashier || "Admin"}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedSaleId(null)} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedSale.items_detail?.map((li: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100/60 dark:border-slate-800/60">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-white truncate">{li.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                        {li.quantity} x {formatCurrencyMXN(li.price)}
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(li.quantity * li.price)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>{t.dashboard.subtotal}</span>
                  <span className="font-black">{formatCurrencyMXN(selectedSale.subtotal || selectedSale.total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>{t.dashboard.discount}</span>
                  <span className="font-black">-{formatCurrencyMXN(selectedSale.discount || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white pt-2">
                  <span>{t.dashboard.total}</span>
                  <span className="font-black">{formatCurrencyMXN(selectedSale.total)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setSelectedSaleId(null)}
                  className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  {lang === 'es' ? 'Cerrar' : (lang === 'fr' ? 'Fermer' : 'Close')}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                >
                  {t.dashboard.export}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
