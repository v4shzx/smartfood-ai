"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Brain,
  Zap,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendsViewProps {
  t: any;
  trendsInsights: any[];
}

export function TrendsView({ t, trendsInsights }: TrendsViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <TrendingUp className="w-3.5 h-3.5" /> {t.dashboard.trends}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.trends}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Descubre patrones ocultos procesados por nuestro motor de IA.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-emerald-600 dark:text-emerald-400 font-black text-[12px] uppercase tracking-[0.2em]">
            <Brain className="w-5 h-5" /> Insights Relevantes
          </div>
          <div className="space-y-6">
            {trendsInsights.map((ins, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white mb-2">{ins.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{ins.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-3xl" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Oportunidades
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">Crossover</div>
                <div className="text-sm font-bold text-slate-700 dark:text-white">Activar promocion: Tacos + Bebida los martes para subir ticket promedio en horario valle.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">Stock</div>
                <div className="text-sm font-bold text-slate-700 dark:text-white">Ajustar pedido de Tortilla los viernes: la demanda sube 40% el fin de semana.</div>
              </div>
            </div>
          </div>


          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8">Análisis de Alérgenos & Merma</h3>
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-rose-600 dark:text-rose-400 italic">Posible excedente detectado</div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  La proxima semana baja la demanda de Postres un 15% segun proyeccion climatica.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-6 text-center">
              Informacion predictiva basada en 3 meses de data historica.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
