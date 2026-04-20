"use client";


import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain, LineChart, Activity, Bot, Zap, ChevronRight, Menu, X,
  Star, CheckCircle2, Salad, Flame, ArrowUpRight, Cpu, Database,
  ShieldCheck, Target, CloudCog, CloudSun, Check, AlertCircle
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { ENDPOINTS } from "@/lib/api-config";

// ─── Toast Component ─────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border min-w-[320px]",
        type === "success" 
          ? "bg-emerald-500/90 border-emerald-400/50 text-white" 
          : "bg-rose-500/90 border-rose-400/50 text-white"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        {type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm leading-tight">{type === "success" ? "¡Éxito!" : "Atención"}</p>
        <p className="text-xs opacity-90 font-medium mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all shadow-sm"
    >
      {isDark
        ? <Sun className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-slate-600" />}
    </button>
  );
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

const calorieData = [
  { day: "L", calories: 2100, target: 2000 },
  { day: "M", calories: 1950, target: 2000 },
  { day: "X", calories: 2400, target: 2000 },
  { day: "J", calories: 1800, target: 2000 },
  { day: "V", calories: 2050, target: 2000 },
  { day: "S", calories: 2600, target: 2000 },
  { day: "D", calories: 2200, target: 2000 },
];

const macroData = [
  { name: "Protein", val: 140, goal: 150, color: "#2563eb" },
  { name: "Carbs", val: 210, goal: 200, color: "#4f46e5" },
  { name: "Fat", val: 55, goal: 65, color: "#64748b" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  React.useEffect(() => {
    const sections = ["hero", "demo", "features", "pricing", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: "#hero", label: t.nav.home, id: "hero" },
    { href: "#demo", label: t.nav.platform, id: "demo" },
    { href: "#features", label: t.nav.features, id: "features" },
    { href: "#pricing", label: t.nav.pricing, id: "pricing" },
    { href: "#contact", label: t.nav.contact, id: "contact" },
    { href: "/docs", label: t.nav.docs, id: "docs" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/60 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/30 dark:border-slate-700/30 transition-all shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">SmartFood AI</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-all relative py-1",
                  activeSection === link.id
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                )}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            <LangSwitcher />
            <ThemeToggle />
            <Link href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              {t.nav.cta}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LangSwitcher />
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-1">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1 shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-3 text-base font-semibold transition-colors",
                activeSection === link.id
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl"
                  : "text-slate-700 dark:text-slate-200"
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 flex flex-col gap-3">
            <Link href="/login" className="w-full bg-emerald-600 text-white px-3 py-3 rounded-xl text-base font-bold text-center shadow-lg shadow-emerald-500/20">
              {t.nav.cta}
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useI18n();
  return (
    <section id="hero" className="pt-32 pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white/5 dark:bg-slate-950/5 backdrop-blur-md rounded-[3rem] border border-white/10 dark:border-white/5 p-8 md:p-16 flex flex-col items-center text-center shadow-2xl shadow-slate-900/5 dark:shadow-black/20"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-10 tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400" />
          <span>{t.badge}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1]">
          {(t.h1 as string).split(". ").map((phrase: string, i: number) => {
            const words = phrase.split(" ");
            const firstWord = words[0];
            const rest = words.slice(1).join(" ");
            const colors = [
              "text-blue-600 dark:text-blue-400",
              "text-amber-500 dark:text-amber-400",
              "text-purple-600 dark:text-purple-400"
            ];

            return (
              <span key={i} className="block">
                <motion.span
                  className={`inline-block ${colors[i % colors.length]}`}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {firstWord}
                </motion.span>
                {" "}{rest}{i < 2 ? "." : "."}
              </span>
            );
          })}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
          {t.hero_p}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col md:flex-row gap-5 w-full md:w-auto">
          <Link href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98]">
            {t.try} <ChevronRight className="w-5 h-5" />
          </Link>
          <button className="bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-700/50 px-10 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md backdrop-blur-md active:scale-[0.98]">
            {t.demo}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  const { t } = useI18n();
  return (
    <section id="demo" className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="relative rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/80 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5 p-2 backdrop-blur-sm">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden border border-slate-200/60 dark:border-slate-700/40 shadow-inner">
          {/* Window Controls */}
          <div className="h-14 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center px-6 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="ml-6 text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure AI Connection
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 p-6 hidden md:flex flex-col gap-2">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">{t.nav.platform}</div>
              <SidebarItem icon={<LineChart />} label={t.dash_title} active />
              <SidebarItem icon={<Salad />} label="Meal Planner" />
              <SidebarItem icon={<Activity />} label="Metabolic Status" />
              <SidebarItem icon={<Target />} label="Goals & Tracking" />
              <div className="mt-auto">
                <div className="bg-emerald-600 rounded-2xl p-5 shadow-xl shadow-emerald-500/20">
                  <div className="flex items-center gap-2 text-white font-bold mb-2 text-sm">
                    <Bot className="w-5 h-5" /> AI Coach
                  </div>
                  <p className="text-[11px] text-emerald-50 leading-relaxed font-medium">{t.coach}</p>
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-white dark:bg-slate-900/80">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.dash_title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{t.dash_sub}</p>
                </div>
                <div className="text-xs font-bold px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/60 uppercase tracking-wider">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {t.dash_accuracy}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                <StatCard title={t.stat1} value="1,840" subtitle={t.stat1s} icon={<Flame className="w-5 h-5 text-orange-500" />} />
                <StatCard title={t.stat2} value="A+" subtitle={t.stat2s} icon={<Star className="w-5 h-5 text-emerald-500" />} />
                <StatCard title={t.stat3} value="High" subtitle={t.stat3s} icon={<Zap className="w-5 h-5 text-amber-500" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-7 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-slate-900 dark:text-white">{t.weekly}</h3>
                    <div className="text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-wider">Last 7 Days</div>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={calorieData}>
                        <defs>
                          <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} dy={15} />
                        <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
                        <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "12px" }} cursor={{ stroke: "#cbd5e1", strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="6 6" fill="none" strokeWidth={2} />
                        <Area type="monotone" dataKey="calories" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-7 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-8">{t.macro_title}</h3>
                  <div className="space-y-6">
                    {macroData.map((macro) => (
                      <div key={macro.name}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{macro.name}</span>
                          <span className="text-slate-900 dark:text-white font-black">{macro.val}g <span className="text-slate-400 font-normal">/ {macro.goal}g</span></span>
                        </div>
                        <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden p-0.5">
                          <motion.div className="h-full rounded-full" style={{ backgroundColor: macro.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(macro.val / macro.goal) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "circOut" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button className="w-full text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 flex justify-center items-center gap-2 uppercase tracking-widest transition-colors">
                      {t.recalc} <Bot className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────

function Integrations() {
  const { t } = useI18n();
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white/5 dark:bg-slate-950/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 dark:border-white/5 p-10 md:p-16 text-center shadow-xl shadow-slate-900/5 dark:shadow-black/20"
        >
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-12 uppercase tracking-[0.3em]">{t.integrations}</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {[
              { icon: <LineChart className="w-6 h-6 text-emerald-600" />, label: "Facebook Prophet" },
              { icon: <CloudSun className="w-6 h-6 text-emerald-600" />, label: "Open-Meteo" },
              { icon: <Zap className="w-6 h-6 text-emerald-600" />, label: "FastAPI" },
              { icon: <Database className="w-6 h-6 text-emerald-600" />, label: "PostgreSQL" },
              { icon: <Cpu className="w-6 h-6 text-emerald-600" />, label: "Next.js" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2.5 text-xl font-black text-slate-800 dark:text-slate-200 cursor-default"
              >
                {item.icon} {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEAT_STYLES = [
  { icon: <Brain className="text-emerald-600   w-6 h-6" />, bg: "bg-emerald-50   dark:bg-emerald-950/60" },
  { icon: <Target className="text-teal-600 w-6 h-6" />, bg: "bg-teal-50 dark:bg-teal-950/60" },
  { icon: <Activity className="text-slate-600  w-6 h-6 dark:text-slate-300" />, bg: "bg-slate-100  dark:bg-slate-800/60" },
];

function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="py-32 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-4xl mx-auto bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/20 dark:border-white/5 p-10 md:p-16 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden group"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight relative z-10"
        >
          {t.feat_title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed relative z-10"
        >
          {t.feat_sub}
        </motion.p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {t.feats.map((f: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900 hover:shadow-2xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 transition-all group cursor-default"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${FEAT_STYLES[i].bg} shadow-sm group-hover:rotate-12 transition-transform duration-300`}>
              {FEAT_STYLES[i].icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const { t } = useI18n();
  return (
    <section id="pricing" className="py-32 px-4 max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-4xl mx-auto bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/20 dark:border-white/5 p-10 md:p-16 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white relative z-10"
        >
          {t.price_title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed relative z-10"
        >
          {t.price_sub}
        </motion.p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {t.pricing_plans.map((plan: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className={cn(
              "p-10 rounded-[3rem] border text-left relative overflow-hidden transition-all duration-500 flex flex-col h-full backdrop-blur-md",
              plan.popular
                ? "bg-white/70 dark:bg-slate-900/80 border-emerald-500/50 dark:border-emerald-500/40 shadow-[0_20px_50px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_50px_rgba(16,185,129,0.1)] group"
                : "bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/20"
            )}
          >
            {plan.popular && (
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.15), transparent 70%)"
                }}
              />
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className={cn("text-sm font-bold uppercase tracking-widest", plan.popular ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")}>
                  {plan.desc}
                </p>
              </div>
              {plan.popular && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[10px] font-black bg-emerald-600 text-white px-4 py-1.5 rounded-full border border-emerald-500 shadow-lg shadow-emerald-500/40 uppercase tracking-widest"
                >
                  {t.popular_badge}
                </motion.span>
              )}
            </div>

            <div className="my-10 flex items-baseline gap-1.5 relative z-10">
              <span className="text-6xl font-black text-slate-900 dark:text-white">
                {plan.price}
              </span>
              <div className="flex flex-col">
                <span className={cn("font-black text-sm", plan.popular ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-600")}>
                  MXN
                </span>
                <span className="font-bold text-lg leading-none text-slate-400 dark:text-slate-500">
                  /{plan.unit.split(" / ")[1]}
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-12 relative z-10 grow">
              {plan.feats.map((f: string, i: number) => (
                <li key={i} className="flex gap-3 font-bold text-sm items-start text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className={cn("shrink-0 w-5 h-5", plan.popular ? "text-emerald-500" : "text-slate-300 dark:text-slate-600")} />
                  <span className="leading-tight">{f}</span>
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] relative z-10",
                plan.popular
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20"
                  : "border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              )}
            >
              {plan.btn}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact({ setToast }: { setToast: (t: any) => void }) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(ENDPOINTS.contact, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.", type: "success" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const error = await response.json();
        setToast({ message: error.detail || "No se pudo enviar el mensaje. Intenta de nuevo.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Error de conexión con el servidor. Revisa tu internet.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[4rem] border border-white/20 dark:border-white/5 p-8 md:p-16 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden group"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none group-hover:bg-emerald-500/15 transition-colors" />

        <div className="text-center mb-16 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            {t.contact_title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {t.contact_sub}
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t.contact_form.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder={t.contact_form.placeholder_name}
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t.contact_form.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder={t.contact_form.placeholder_email}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t.contact_form.subject}</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder={t.contact_form.placeholder_subject}
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t.contact_form.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                placeholder={t.contact_form.placeholder_message}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl text-lg font-black transition-all shadow-xl shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t.contact_form.send}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const { t } = useI18n();
  return (
    <section className="py-32 px-4 bg-transparent border-t border-slate-100 dark:border-slate-800/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center rounded-[3.5rem] bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-16 md:p-24 border border-white/20 dark:border-white/5 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden transition-colors duration-500"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(52, 211, 153, 0.15), transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(45, 212, 191, 0.15), transparent 70%)" }}
          />
        </div>
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight"
          >
            {t.cta_title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {t.cta_sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/login" className="bg-emerald-600 dark:bg-white hover:bg-emerald-700 dark:hover:bg-slate-50 text-white dark:text-slate-900 px-12 py-5 rounded-2xl text-xl font-black transition-all inline-flex items-center gap-3 shadow-xl shadow-emerald-500/20 dark:shadow-none hover:shadow-2xl active:scale-95 group">
              {t.cta_btn} <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${active
          ? "bg-emerald-50 dark:bg-emerald-950/60 shadow-sm border border-emerald-100 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-300"
          : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
    >
      <div className={`${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} w-5 h-5 transition-colors`}>{icon}</div>
      {label}
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-start justify-between group hover:border-emerald-100 dark:hover:border-emerald-900 transition-colors cursor-default"
    >
      <div>
        <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black mb-1.5 uppercase tracking-widest">{title}</div>
        <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-wider group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">{subtitle}</div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 transition-colors group-hover:scale-110 duration-300">{icon}</div>
    </motion.div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useI18n();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  return (
    <main className="bg-transparent min-h-screen font-sans antialiased text-slate-900 dark:text-white selection:bg-emerald-100 dark:selection:bg-emerald-900/50 selection:text-emerald-900 dark:selection:text-emerald-200">
      <Navbar />
      <Hero />
      <DashboardMockup />
      <Integrations />
      <Features />
      <Pricing />
      <Contact setToast={setToast} />
      <CTA />
      
      <AnimatePresence>
        {toast && (
          <Toast 
            key="toast"
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <footer className="py-16 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-4">
            {t.footer}
          </p>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest" suppressHydrationWarning>
            © {new Date().getFullYear()} {t.footer_dev}
          </p>
        </div>
      </footer>
    </main>
  );
}
