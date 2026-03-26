"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, X, TextCursorInput, ZoomIn, Eye, Volume2, VolumeX, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Look specifically for Google UK English Female as requested
      const preferredVoice = allVoices.find(v => v.name === "Google UK English Female");
      
      if (preferredVoice) {
        setVoices([preferredVoice, ...allVoices.filter(v => v !== preferredVoice && v.lang.startsWith("es"))]);
      } else {
        const lang = document.documentElement.lang || "es";
        setVoices(allVoices.filter(v => v.lang.startsWith(lang)));
      }
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Apply Font Size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // Apply High Contrast
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  // Text-To-Speech (Cursor Following)
  useEffect(() => {
    if (!isReading) return;

    let lastText = "";
    const handleMouseMove = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      // Find the most relevant text content (preferring buttons, links, or direct text)
      const target = (element.closest("button, a, h1, h2, h3, h4, h5, p, span, li") as HTMLElement | null) || (element as HTMLElement);
      const text = target.getAttribute("aria-label") || target.innerText?.trim();

      if (text && text !== lastText && text.length > 0 && text.length < 500) {
        // Only speak if it's different and not too long (to avoid reading huge blocks at once)
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Use selected voice if available
        if (voices[voiceIndex]) {
          utterance.voice = voices[voiceIndex];
        } else {
          utterance.lang = document.documentElement.lang || "es-ES";
        }
        window.speechSynthesis.speak(utterance);
        lastText = text;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.speechSynthesis.cancel();
    };
  }, [isReading]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleFontSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFontSize((prev) => {
      if (prev === 100) return 115;
      if (prev === 115) return 130;
      return 100;
    });
  };

  const toggleHighContrast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHighContrast(!isHighContrast);
  };

  const toggleTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReading(!isReading);
    if (isReading) {
      window.speechSynthesis.cancel();
    }
  };

  const cycleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voices.length > 0) {
      setVoiceIndex((prev) => (prev + 1) % voices.length);
      // Small preview of the new voice
      window.speechSynthesis.cancel();
      const preview = new SpeechSynthesisUtterance("Nueva voz seleccionada");
      if (voices[(voiceIndex + 1) % voices.length]) {
        preview.voice = voices[(voiceIndex + 1) % voices.length];
      }
      window.speechSynthesis.speak(preview);
    }
  };

  const actions = [
    { 
      icon: <ZoomIn className="w-5 h-5" />, 
      label: "Aumentar Texto", 
      onClick: handleFontSize,
      active: fontSize > 100,
      value: fontSize === 130 ? "Máximo" : fontSize === 115 ? "Medio" : "Normal"
    },
    { 
      icon: isReading ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />, 
      label: "Lectura de Voz", 
      onClick: toggleTTS,
      active: isReading,
      value: isReading ? "Activado" : "Desactivado"
    },
    { 
      icon: <Eye className="w-5 h-5" />, 
      label: "Alto Contraste", 
      onClick: toggleHighContrast,
      active: isHighContrast,
      value: isHighContrast ? "Activado" : "Desactivado"
    },
    { 
      icon: <Volume2 className="w-5 h-5 opacity-50" />, 
      label: "Cambiar Voz", 
      onClick: cycleVoice,
      active: false,
      value: voices[voiceIndex]?.name.split(" - ")[0] || "Default"
    },
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
                  onClick={action.onClick}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-2xl transition-all text-left group border relative overflow-hidden",
                    action.active 
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                    action.active
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}>
                    {action.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{action.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{action.value}</span>
                  </div>
                  {action.active && (
                    <div className="ml-auto">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
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
