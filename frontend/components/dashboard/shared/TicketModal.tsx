"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, CheckCircle2 } from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";

interface TicketModalProps {
  sale: any;
  onClose: () => void;
}

export function TicketModal({ sale, onClose }: TicketModalProps) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Venta Exitosa</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Ticket #{sale.id.split('_')[1]}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Ticket Body (The part that gets printed) */}
          <div className="p-8 space-y-6" id="printable-ticket">
            <div className="text-center space-y-1">
              <h2 className="font-black text-xl text-slate-900 dark:text-white tracking-tighter">SMARTFOOD AI</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Comedor Escolar Inteligente</p>
              <div className="text-[10px] text-slate-500 pt-2">
                {new Date(sale.ts).toLocaleString()}
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-6 space-y-4">
              {sale.items_detail?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <div className="flex gap-2 min-w-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{item.quantity}x</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {formatCurrencyMXN(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatCurrencyMXN(sale.subtotal || sale.total)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-xs text-rose-500 uppercase tracking-widest font-bold">
                  <span>Descuento</span>
                  <span>-{formatCurrencyMXN(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-50 dark:border-slate-800">
                <span className="tracking-tighter">TOTAL</span>
                <span>{formatCurrencyMXN(sale.total)}</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                PAGO CON {sale.type === 'Cash' ? 'EFECTIVO' : 'TARJETA'}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
            >
              <Printer className="w-4 h-4" /> Imprimir Ticket
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ticket, #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            color: black !important;
          }
          #printable-ticket h2, #printable-ticket span, #printable-ticket div {
            color: black !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
