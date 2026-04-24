"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  DollarSign,
  Store,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  Zap,
  Sparkles,
  Sun
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
import { StatCard } from "./shared/StatCard";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import type { Translation } from "@/lib/i18n";
import type { SidebarTab } from "@/types/dashboard";

type SalesSeriesPoint = {
  label: string;
  value: number;
};

type WeatherState = {
  temp: number;
  status: string;
};

interface HomeViewProps {
  t: Translation;
  kpis: {
    todayRevenue: number;
    yesterdayRevenue: number;
    weekRevenue: number;
    topProduct: string;
    topProductQty: number;
    activeStudents: number;
    todayOrders: number;
    menuItemsCount: number;
    criticalInventory: { items: number; sku: string; remaining: number };
  };
  salesSeries: SalesSeriesPoint[];
  setActiveTab: (tab: SidebarTab) => void;
  subscriptionTier: string;
  invCritical: Array<{ name: string; on_hand: number }>;
}

export function HomeView({ t, kpis, salesSeries, setActiveTab, subscriptionTier, invCritical }: HomeViewProps) {
  const isProOrAbove = subscriptionTier === "profesional" || subscriptionTier === "empresarial" || subscriptionTier === "administrador";
  const isEnterpriseOrAbove = subscriptionTier === "empresarial" || subscriptionTier === "administrador";
  const criticalInventory = React.useMemo(() => {
    if (invCritical.length > 0) {
      return {
        items: invCritical.length,
        sku: invCritical[0].name,
        remaining: invCritical[0].on_hand,
      };
    }

    return kpis.criticalInventory;
  }, [invCritical, kpis.criticalInventory]);

  // Real-time weather logic
  const [weather, setWeather] = React.useState<WeatherState>({ temp: 24, status: t.dashboard.sunny });

  React.useEffect(() => {
    const cacheKey = "smartfood:weather-cache";
    const cachedWeather = window.sessionStorage.getItem(cacheKey);
    if (cachedWeather) {
      try {
        const parsed = JSON.parse(cachedWeather);
        if (Date.now() - parsed.timestamp < 15 * 60 * 1000) {
          setWeather(parsed.value);
          return;
        }
      } catch {
        window.sessionStorage.removeItem(cacheKey);
      }
    }

    const controller = new AbortController();

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, {
          signal: controller.signal,
        });
        const data = await res.json();
        const code = data.current_weather.weathercode;
        
        // Mapping Open-Meteo codes to our i18n keys
        let statusKey: string = t.dashboard.sunny;
        if (code >= 1 && code <= 3) statusKey = t.dashboard.partly_cloudy;
        if (code >= 45) statusKey = t.dashboard.rainy;

        const nextWeather = {
          temp: Math.round(data.current_weather.temperature),
          status: statusKey
        };
        setWeather(nextWeather);
        window.sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), value: nextWeather }));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        console.error("Weather fetch failed", e);
      }
    };

    // Try to get user location, fallback to CDMX
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(19.4326, -99.1332) 
      );
    } else {
      fetchWeather(19.4326, -99.1332);
    }

    return () => controller.abort();
  }, [t.dashboard]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-start md:justify-between md:gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black leading-none tracking-tight text-slate-900 dark:text-white sm:text-4xl">{t.dashboard.home}</h1>
          <p className="mt-3 text-base font-normal text-slate-500 dark:text-slate-400 sm:text-lg">
            {isProOrAbove 
              ? t.hero_p 
              : "Gestión simplificada de ventas y reportes base."}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-1 flex h-fit w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
        >
          <Sun className="w-5 h-5 text-amber-500" />
          <div className="text-right">
            <div className="text-[12px] font-black text-slate-700 dark:text-slate-200 leading-none">{weather.temp}°C</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{weather.status}</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard title={t.dashboard.total_orders} value={`${kpis.activeStudents}`} subtitle={`${kpis.todayOrders} ${t.dashboard.processed_today}`} icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />} trend="Hoy" />
        <StatCard 
          title={t.dashboard.revenue_today} 
          value={formatCurrencyMXN(kpis.todayRevenue)} 
          subtitle={`${t.dashboard.yesterday}: ${formatCurrencyMXN(kpis.yesterdayRevenue)}`} 
          icon={<DollarSign className="w-6 h-6 text-sky-600" />} 
          trend={kpis.todayRevenue >= kpis.yesterdayRevenue ? "+Trend" : "-Trend"}
        />
        <StatCard title={t.dashboard.top_product} value={kpis.topProduct} subtitle={`${kpis.topProductQty} ${t.dashboard.units_sold}`} icon={<Store className="w-6 h-6 text-amber-600" />} />
        {isEnterpriseOrAbove ? (
          <StatCard title={t.dashboard.critical_stock} value={`${criticalInventory.items} items`} subtitle={`Alerta: ${criticalInventory.sku}`} icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} trend="Alerta" />
        ) : (
          <StatCard title={t.dashboard.reports} value={`${kpis.weekRevenue > 0 ? "Activo" : "Sin Datos"}`} subtitle="Resumen semanal" icon={<BarChart3 className="w-6 h-6 text-indigo-600" />} />
        )}
      </div>

      {isProOrAbove && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setActiveTab("prediction")}
          className="group relative flex cursor-pointer flex-col gap-5 overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-600 to-teal-700 p-5 shadow-lg shadow-emerald-600/10 transition-all hover:scale-[1.01] md:flex-row md:items-center md:justify-between md:p-6"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
            <Brain className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner text-white">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-1">{t.dashboard.ai_prediction_tomorrow}</div>
              <div className="text-xl font-black tracking-tight text-white sm:text-2xl">
                {kpis.topProduct !== "N/A" ? kpis.topProduct : t.dashboard.calculating}
              </div>
              <div className="text-xs text-emerald-50/70 font-medium mt-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> {t.dashboard.max_probability} • {t.dashboard.view_analysis}
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="text-right">
              <div className="text-[9px] font-black text-emerald-100 uppercase tracking-widest leading-none">IA Activa</div>
              <div className="text-xs font-bold text-white mt-1">Analizando patrones...</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/70" />
          </div>
        </motion.div>
      )}

      <div className={cn("grid grid-cols-1 gap-6 lg:gap-8", isEnterpriseOrAbove ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
        <div className={cn("rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 lg:rounded-[2.5rem] lg:p-8", !isEnterpriseOrAbove && "lg:col-span-1")}>
          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{t.dashboard.sales_performance}</h3>
            <div className="text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.dashboard.last_7_days} (MXN)</div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} formatter={(v: unknown) => [formatCurrencyMXN(Number(v)), "Ventas"]} labelFormatter={(l) => `Día: ${l}`} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isEnterpriseOrAbove && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 lg:rounded-[2.5rem] lg:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm truncate max-w-[150px] sm:max-w-none">{t.dashboard.inventory_alerts}</h3>
              <div className="w-fit text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                {criticalInventory.items} {t.dashboard.critical_items}
              </div>
            </div>
            <div className="space-y-4">
              {criticalInventory.items > 0 ? (
                <div className="flex items-start gap-4 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/10 group hover:border-rose-500/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-rose-600 font-normal text-lg">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-normal text-slate-900 dark:text-white truncate">{t.dashboard.critical_stock}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      {criticalInventory.sku} requiere reposición inmediata.
                    </div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-normal uppercase tracking-tighter text-rose-500 mt-2 bg-white/50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                       Quedan {criticalInventory.remaining} unidades
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 font-normal">{t.dashboard.no_alerts}</div>
              )}
              
              <button 
                onClick={() => setActiveTab("inventory")}
                className="w-full py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[10px] font-normal uppercase tracking-widest text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
              >
                {t.dashboard.manage_inventory}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
