"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon,
  label,
  active = false,
  isCollapsed = false,
  onClick,
}: SidebarItemProps) {
  return (
    <motion.div
      whileHover={{ x: isCollapsed ? 0 : 4 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer group",
        active
          ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50",
        isCollapsed && "justify-center px-0 w-12 h-12 mx-auto"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 transition-colors shrink-0",
          active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
        )}
      >
        {icon}
      </div>
      {!isCollapsed && <span>{label}</span>}
    </motion.div>
  );
}
