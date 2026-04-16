"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 shadow-sm group hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</div>
      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1.5 uppercase tracking-wider">{subtitle}</div>
    </motion.div>
  );
}
