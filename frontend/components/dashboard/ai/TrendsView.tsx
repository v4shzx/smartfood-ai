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
import { Translation } from "@/lib/i18n";
import { TrendInsight } from "@/types/dashboard";

interface TrendsViewProps {
  t: Translation;
  trendsInsights: TrendInsight[];
}

export function TrendsView({ t, trendsInsights }: TrendsViewProps) {
  const renderInsight = (ins?: TrendInsight | null) => {
    if (!ins) return { title: "", desc: "" };
    
    // @ts-ignore - Dynamic key access
    const template = (t.dashboard.trends_insights as any)?.[ins.key];
    if (!template) return { title: ins.key || "Insight", desc: "" };

    let desc = template.desc;
    if (ins.params) {
      Object.entries(ins.params).forEach(([key, val]) => {
        // If the parameter is a day key, translate it using the days dict
        // @ts-ignore
        const daysDict = t.dashboard.trends_insights.days as Record<string, string>;
        const finalVal = key === "day" && daysDict[val as string] 
          ? daysDict[val as string] 
          : val;
        desc = desc.replace(`{${key}}`, String(finalVal));
      });
    }

    return { title: template.title, desc };
  };

  const relevant = trendsInsights.filter(i => !i.category || i.category === "relevant" || i.category === "growth");
  const opportunities = trendsInsights.filter(i => i.category === "opportunity");
  const wasteRaw = trendsInsights.find(i => i.category === "warning" || i.key.includes('merma'));
  
  const waste = renderInsight(wasteRaw);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.trends}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">{t.dashboard.trends_desc}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-emerald-600 dark:text-emerald-400 font-black text-[12px] uppercase tracking-[0.2em]">
            <Brain className="w-5 h-5" /> {t.dashboard.insights_relevante}
          </div>
          <div className="space-y-6">
            {relevant.length === 0 && <p className="text-sm text-slate-500 text-center py-10 italic">{t.dashboard.no_insights_data}</p>}
            {relevant.map((ins, i) => {
              const info = renderInsight(ins);
              return (
                <div key={`${ins.key}-${i}`} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white mb-2">{info.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{info.desc}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-3xl" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> {t.dashboard.opportunities}
            </h3>
            <div className="space-y-4">
              {opportunities.length === 0 && <p className="text-xs text-slate-500 italic">{t.dashboard.analyzing_market}</p>}
              {opportunities.map((opp, i) => {
                const info = renderInsight(opp);
                return (
                  <div key={`${opp.key}-${i}`} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">{info.title}</div>
                    <div className="text-sm font-normal text-slate-700 dark:text-white">{info.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8">{t.dashboard.waste_analysis}</h3>
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-normal text-rose-600 dark:text-rose-400 italic">{waste.title || t.dashboard.waste_preventive}</div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {waste.desc || t.dashboard.waste_tip}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-6 text-center">
              {t.dashboard.predictive_info}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
