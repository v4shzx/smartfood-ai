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
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";
import { PredictionMeta } from "@/types/dashboard";

interface PredictionViewProps {
  t: any;
  predictionScenario: "baseline" | "promo" | "rain" | "event" | "heatwave" | "monthend";
  setPredictionScenario: (s: "baseline" | "promo" | "rain" | "event" | "heatwave" | "monthend") => void;
  predictionLift: number;
  setPredictionLift: (l: number) => void;
  rainProbability: number;
  setRainProbability: (v: number) => void;
  temperatureC: number;
  setTemperatureC: (v: number) => void;
  eventMultiplier: number;
  setEventMultiplier: (v: number) => void;
  scenarioDate: string;
  setScenarioDate: (v: string) => void;
  prediction: any[];
  predictionMeta: PredictionMeta | null;
  scenarioMeta?: {
    scenario?: string;
    model_used?: string;
    applied_factor?: number;
  } | null;
  trends: any[];
  onSimulate: () => void;
  onApply?: () => void;
}

export function PredictionView({
  t,
  predictionScenario,
  setPredictionScenario,
  predictionLift,
  setPredictionLift,
  rainProbability,
  setRainProbability,
  temperatureC,
  setTemperatureC,
  eventMultiplier,
  setEventMultiplier,
  scenarioDate,
  setScenarioDate,
  prediction,
  predictionMeta,
  scenarioMeta,
  trends,
  onSimulate,
  onApply,
}: PredictionViewProps) {
  // Calculate some quick stats from prediction data
  const maxVentas = Math.max(...prediction.map(p => p.ventas || 0));
  const peakHour = prediction.find(p => p.ventas === maxVentas)?.hour || "--:--";
  const totalEstimado = predictionMeta?.daily_total_yhat ?? prediction.reduce((acc, p) => acc + (p.ventas || 0), 0);
  const modelAccuracy = predictionMeta?.mape != null ? Math.max(0, Math.min(100, Number((100 - predictionMeta.mape).toFixed(1)))) : null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {t.dashboard.prediction}
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 font-normal max-w-2xl">
            {t.dashboard.prediction_desc}
          </p>
        </motion.div>
      </div>



      {/* Simulation Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center gap-5 sm:gap-6"
      >
        <div className="flex-1 w-full xl:w-auto px-2">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">{t.dashboard.simulation_scenario}</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "baseline", label: t.dashboard.scenarios.baseline, icon: Sun },
              { id: "promo", label: t.dashboard.scenarios.promo, icon: Tag },
              { id: "rain", label: t.dashboard.scenarios.rain, icon: CloudRain },
              { id: "event", label: t.dashboard.scenarios.event, icon: Sparkles },
              { id: "heatwave", label: t.dashboard.scenarios.heatwave, icon: Sun },
              { id: "monthend", label: t.dashboard.scenarios.monthend, icon: ArrowUpRight },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setPredictionScenario(s.id as any)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all border",
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
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{t.dashboard.lift_intensity}</div>
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

        {predictionScenario === "rain" && (
          <div className="w-full xl:w-64 px-4 py-3 bg-sky-50/40 dark:bg-sky-500/5 rounded-2xl border border-sky-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">Prob. lluvia</div>
              <div className="text-[11px] font-black text-sky-700 dark:text-sky-300">{Math.round(rainProbability * 100)}%</div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={rainProbability}
              onChange={(e) => setRainProbability(Number(e.target.value))}
              className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {predictionScenario === "event" && (
          <div className="w-full xl:w-64 px-4 py-3 bg-amber-50/40 dark:bg-amber-500/5 rounded-2xl border border-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Multiplicador evento</div>
              <div className="text-[11px] font-black text-amber-700 dark:text-amber-300">{eventMultiplier.toFixed(2)}x</div>
            </div>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={eventMultiplier}
              onChange={(e) => setEventMultiplier(Number(e.target.value))}
              className="w-full accent-amber-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {predictionScenario === "heatwave" && (
          <div className="w-full xl:w-64 px-4 py-3 bg-rose-50/40 dark:bg-rose-500/5 rounded-2xl border border-rose-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-300">Temperatura</div>
              <div className="text-[11px] font-black text-rose-700 dark:text-rose-300">{temperatureC}C</div>
            </div>
            <input
              type="range"
              min={25}
              max={45}
              step={1}
              value={temperatureC}
              onChange={(e) => setTemperatureC(Number(e.target.value))}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {predictionScenario === "monthend" && (
          <div className="w-full xl:w-64 px-4 py-3 bg-violet-50/40 dark:bg-violet-500/5 rounded-2xl border border-violet-500/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-300 mb-2">Fecha objetivo</div>
            <input
              type="date"
              value={scenarioDate}
              onChange={(e) => setScenarioDate(e.target.value)}
              className="w-full bg-white/90 dark:bg-slate-900 border border-violet-200 dark:border-violet-700/40 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            />
          </div>
        )}

        <button 
          onClick={onSimulate}
          className="w-full xl:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl"
        >
          <Zap className="w-4 h-4" />
          {t.dashboard.simulate_scenario}
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {scenarioMeta?.scenario && scenarioMeta.scenario !== "baseline" && (
          <div className="bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-2xl px-4 py-3">
            <p className="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300 uppercase">
              Escenario {scenarioMeta.scenario} aplicado | Modelo {scenarioMeta.model_used || "n/a"} | Factor {scenarioMeta.applied_factor ?? 1}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Clock className="w-12 h-12" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.dashboard.projected_peak_hour}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {peakHour} <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg">{t.dashboard.high_demand}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <DollarSign className="w-12 h-12" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.dashboard.estimated_total_today}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${totalEstimado.toLocaleString('es-MX')} <span className="text-[10px] text-slate-400 font-normal uppercase tracking-widest ml-1">MXN</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-12 h-12" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.dashboard.model_precision}</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              {modelAccuracy != null ? `${modelAccuracy}%` : "--"}
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg">
                {predictionMeta?.model_used === "prophet" ? "Prophet" : "Fallback"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm">
          <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.daily_revenue_projection}</h3>
              <p className="text-[11px] text-slate-500 font-normal mt-1 uppercase tracking-widest">{t.dashboard.based_on_history}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t.dashboard.sales_chart_label} (MXN)</span>
            </div>
          </div>

          <div className="h-64 sm:h-80">
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
                  formatter={(value: ValueType | undefined) => {
                    const num = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                    return [`$${num.toLocaleString('es-MX')}`, t.dashboard.projection_label];
                  }}
                  labelFormatter={(label) => `${t.dashboard.hour_label}: ${label}`}
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

      {onApply && (
        <button
          onClick={onApply}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20"
        >
          {t.dashboard.apply_prediction || "Aplicar predicción"}
        </button>
      )}
    </div>
  );
}
