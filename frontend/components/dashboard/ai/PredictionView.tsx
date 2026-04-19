"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  TrendingUp,
  CloudRain,
  Tag,
  Sun,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  Clock,
  DollarSign
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
import { cn } from "@/lib/utils";

interface PredictionViewProps {
  t: any;
  predictionScenario: "baseline" | "promo" | "rain" | "event" | "heatwave" | "monthend";
  setPredictionScenario: (s: "baseline" | "promo" | "rain" | "event" | "heatwave" | "monthend") => void;
  predictionLift: number;
  setPredictionLift: (l: number) => void;
  prediction: any[];
  trends: any[];
  onSimulate: () => void;
}

export function PredictionView({
  t,
  predictionScenario,
  setPredictionScenario,
  predictionLift,
  setPredictionLift,
  prediction,
  trends,
  onSimulate,
}: PredictionViewProps) {
  // Calculate some quick stats from prediction data
  const maxVentas = Math.max(...prediction.map(p => p.ventas || 0));
  const peakHour = prediction.find(p => p.ventas === maxVentas)?.hour || "--:--";
  const totalEstimado = prediction.reduce((acc, p) => acc + (p.ventas || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {t.dashboard.prediction}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg max-w-2xl">
            Proyecta tus ingresos y optimiza tu operación basándote en patrones históricos y factores externos.
          </p>
        </motion.div>
      </div>

      {/* Simulation Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900/60 p-5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row items-center gap-6"
      >
        <div className="flex-1 w-full xl:w-auto px-2">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Escenario de Simulación</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "baseline", label: "Base", icon: Sun },
              { id: "promo", label: "Promo", icon: Tag },
              { id: "rain", label: "Lluvia", icon: CloudRain },
              { id: "event", label: "Evento", icon: Sparkles },
              { id: "heatwave", label: "Calor", icon: Sun },
              { id: "monthend", label: "Fin Mes", icon: ArrowUpRight },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setPredictionScenario(s.id as any)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                  predictionScenario === s.id
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105"
                    : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {predictionScenario === "promo" && (
          <div className="w-full xl:w-64 px-4 py-3 bg-emerald-50/30 dark:bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Intensidad Lift</div>
              <div className="text-[11px] font-black text-emerald-600">{predictionLift}%</div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={40} 
              value={predictionLift} 
              onChange={(e) => setPredictionLift(Number(e.target.value))} 
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        )}

        <button 
          onClick={onSimulate}
          className="w-full xl:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl"
        >
          <Zap className="w-4 h-4" />
          Simular Escenario
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Clock className="w-12 h-12" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Hora Pico Proyectada</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {peakHour} <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg">Fuerte Demanda</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <DollarSign className="w-12 h-12" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Estimado Hoy</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                ${totalEstimado.toLocaleString('es-MX')} <span className="text-[10px] text-slate-400 font-normal uppercase tracking-widest ml-1">MXN</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-12 h-12" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Precisión del Modelo</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                94.2% <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg">Óptimo</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Proyección de Ingresos Diarios</h3>
                <p className="text-[11px] text-slate-500 font-normal mt-1 uppercase tracking-widest">Basado en comportamiento histórico por hora</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Ventas (MXN)</span>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 10, fontWeight: 700 }} 
                    stroke="rgba(100,116,139,0.4)" 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fontWeight: 700 }} 
                    stroke="rgba(100,116,139,0.4)" 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 20, 
                      border: "none", 
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      padding: "15px"
                    }} 
                    itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '5px' }}
                    formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, "Proyección"]}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fill="url(#predFill)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Estrategia IA</h3>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {trends.map((r, idx) => (
                <div 
                  key={idx} 
                  className="p-5 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">{r.title}</div>
                  </div>
                  <div className="text-xs font-normal text-slate-600 dark:text-slate-300 leading-relaxed">{r.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 p-6 rounded-[1.8rem] text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tip de Hoy</span>
                </div>
                <p className="text-[11px] font-normal leading-relaxed text-slate-300">
                  Aplica el escenario de **Lluvia** para ver cómo impactaría una baja de demanda en tu stock crítico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
