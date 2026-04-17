"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PredictionViewProps {
  t: any;
  predictionScenario: "baseline" | "promo" | "rain";
  setPredictionScenario: (s: "baseline" | "promo" | "rain") => void;
  predictionLift: number;
  setPredictionLift: (l: number) => void;
  prediction: any[];
}

export function PredictionView({
  t,
  predictionScenario,
  setPredictionScenario,
  predictionLift,
  setPredictionLift,
  prediction,
}: PredictionViewProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.prediction}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Demanda por hora y recomendaciones de stock.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Prediccion hoy</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Tickets estimados por hora</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Escenario</div>
                <select value={predictionScenario} onChange={(e) => setPredictionScenario(e.target.value as any)} className="bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white w-full">
                  <option value="baseline">Base</option>
                  <option value="promo">Promocion</option>
                  <option value="rain">Lluvia</option>
                </select>
              </div>
              {predictionScenario === "promo" && (
                <div className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Lift</div>
                  <input type="range" min={0} max={40} value={predictionLift} onChange={(e) => setPredictionLift(Number(e.target.value))} className="w-40" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{predictionLift}%</div>
                </div>
              )}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prediction} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} />
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fill="url(#predFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Recomendaciones</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">IA</div>
          </div>
          <div className="space-y-3">
            {[
              { title: "Sube produccion", desc: "Aumenta tacos y refrescos para 6-9 PM." },
              { title: "Reorden", desc: "Tortilla 12cm: compra sugerida para 2 dias." },
              { title: "Merma", desc: "Revisar cilantro/cebolla antes del cierre." },
            ].map((r, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                <div className="text-sm font-black text-slate-900 dark:text-white">{r.title}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
              Simular
            </button>
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
