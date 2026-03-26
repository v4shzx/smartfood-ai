"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, X, TextCursorInput, Sun, Moon, ZoomIn, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const actions = [
    { icon: <ZoomIn className="w-5 h-5" />, label: "Aumentar Texto" },
    { icon: <TextCursorInput className="w-5 h-5" />, label: "Lectura de Voz" },
    { icon: <Eye className="w-5 h-5" />, label: "Alto Contraste" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 mb-2 w-64 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Accesibilidad</span>
              <button onClick={toggleMenu} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{action.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                Estamos trabajando para hacer SmartFood AI más accesible para todos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative",
          isOpen 
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90" 
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
        )}
        aria-label="Menú de accesibilidad"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Accessibility className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full" />
        )}
      </motion.button>
    </div>
  );
}
