"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain, LineChart, Activity, Bot, Zap, Menu, X,
  Star, CheckCircle2, Salad, Flame, ArrowUpRight, Cpu, Database,
  ShieldCheck, Target, CloudCog, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all backdrop-blur-md"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
  { name: "Protein", val: 140, goal: 150, color: "oklch(0.6 0.15 250)" },
  { name: "Carbs",  val: 210, goal: 200, color: "oklch(0.6 0.15 200)" },
  { name: "Fat",    val: 55,  goal: 65,  color: "oklch(0.6 0.15 150)" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#hero", label: t.nav.home },
    { href: "#features", label: t.nav.features },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative grayscale hover:grayscale-0 transition-all duration-500">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">SmartFood AI</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LangSwitcher />
          <ThemeToggle />
          <Link href="/login" className="text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity active:scale-95">
            {t.nav.cta}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-400">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <LangSwitcher />
                <Link href="/login" className="w-full text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold">
                  {t.nav.cta}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useI18n();
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-10 backdrop-blur-sm">
          <Zap className="w-3 h-3 fill-current" />
          <span>{t.badge}</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]">
          {t.h1.split(". ").map((phrase, i) => (
            <span key={i} className="block last:opacity-60">{phrase}.</span>
          ))}
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          {t.hero_p}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/login" className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95">
            {t.try} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-5 rounded-full text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            {t.demo}
          </button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  const { t } = useI18n();
  return (
    <section id="demo" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50"
      >
        <div className="h-12 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center px-6 gap-2 bg-white/50 dark:bg-slate-900/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="ml-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> AI Engine Online
          </div>
        </div>

        <div className="flex h-[550px]">
          <div className="w-64 border-r border-slate-200/50 dark:border-slate-800/50 p-6 hidden md:flex flex-col gap-1">
            <SidebarItem icon={<LineChart className="w-4 h-4" />} label={t.dash_title} active />
            <SidebarItem icon={<Salad className="w-4 h-4" />}     label="Meal Planner" />
            <SidebarItem icon={<Activity className="w-4 h-4" />}  label="Metabolic Status" />
            <div className="mt-auto p-5 rounded-[2rem] bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-2">
                <Bot className="w-4 h-4" /> AI Coach
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{t.coach}</p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.dash_title}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{t.dash_sub}</p>
              </div>
              <div className="text-[10px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3" /> {t.dash_accuracy}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard title={t.stat1} value="1,840" icon={<Flame className="w-4 h-4 text-orange-500" />} />
              <StatCard title={t.stat2} value="A+"    icon={<Star  className="w-4 h-4 text-emerald-500"  />} />
              <StatCard title={t.stat3} value="High"  icon={<Zap   className="w-4 h-4 text-amber-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.weekly}</h3>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calorieData}>
                      <defs>
                        <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="oklch(0.6 0.15 150)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="oklch(0.6 0.15 150)" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.6 0.15 150 / 0.1)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} dy={10} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", backgroundColor: "oklch(0.2 0 0 / 0.8)", backdropFilter: "blur(10px)", color: "#fff" }} />
                      <Area type="monotone" dataKey="calories" stroke="oklch(0.6 0.15 150)" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">{t.macro_title}</h3>
                <div className="space-y-4">
                  {macroData.map((macro) => (
                    <div key={macro.name}>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{macro.name}</span>
                        <span className="text-slate-900 dark:text-white font-black">{macro.val}g</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: macro.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(macro.val / macro.goal) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "circOut" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:opacity-70 transition-opacity">
                  {t.recalc}
                </button>
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
    <section className="py-24 px-6 border-y border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.integrations}</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {[
            { icon: <Cpu className="w-5 h-5" />, label: "Meta Llama" },
            { icon: <Database className="w-5 h-5" />, label: "Apple Health" },
            { icon: <Activity className="w-5 h-5" />, label: "Google Fit" },
            { icon: <CloudCog className="w-5 h-5" />, label: "OpenAI" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              {item.icon} {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const { t } = useI18n();
  const icons = [<Brain key="b" />, <Target key="t" />, <Activity key="a" />];
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">{t.feat_title}</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">{t.feat_sub}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.feats.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              {icons[i]}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
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
    <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">{t.price_title}</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t.price_sub}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.pricing_plans.map((plan, idx) => (
          <div
            key={idx}
            className={cn(
              "p-10 rounded-[3rem] border flex flex-col transition-all duration-500",
              plan.popular
                ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 scale-105 shadow-2xl z-10"
                : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50"
            )}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{plan.desc}</p>
              </div>
              {plan.popular && (
                <span className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  {t.popular_badge}
                </span>
              )}
            </div>

            <div className="mb-10 flex items-baseline gap-1.5">
              <span className="text-5xl font-bold">{plan.price}</span>
              <span className="text-xs font-bold opacity-60 uppercase tracking-widest">/ {plan.unit.split(" / ")[1]}</span>
            </div>

            <ul className="space-y-4 mb-12 grow">
              {plan.feats.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium items-start opacity-80">
                  <CheckCircle2 className="shrink-0 w-4 h-4 mt-0.5 text-emerald-500" />
                  <span className="leading-tight">{f}</span>
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "w-full py-4 rounded-full font-bold text-sm transition-all active:scale-[0.98]",
                plan.popular
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:opacity-90"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-xl"
              )}
            >
              {plan.btn}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-32 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">{t.contact_title}</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t.contact_sub}</p>
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder={t.contact_form.placeholder_name} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
            <input type="email" placeholder={t.contact_form.placeholder_email} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
          </div>
          <input type="text" placeholder={t.contact_form.placeholder_subject} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
          <textarea rows={5} placeholder={t.contact_form.placeholder_message} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"></textarea>
          <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-bold transition-all hover:opacity-90 active:scale-[0.98] mt-4 shadow-xl">
            {t.contact_form.send}
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
        : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
    )}>
      {icon} {label}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/30 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex items-start justify-between">
      <div>
        <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black mb-1 uppercase tracking-widest">{title}</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      </div>
      <div className="bg-white/50 dark:bg-slate-700/50 p-2 rounded-xl">{icon}</div>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen selection:bg-emerald-200/50 dark:selection:bg-emerald-900/50">
      <Navbar />
      <Hero />
      <DashboardMockup />
      <Integrations />
      <Features />
      <Pricing />
      <Contact />
      <footer className="py-20 border-t border-slate-100 dark:border-slate-800/50 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white uppercase">SmartFood AI</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]" suppressHydrationWarning>
            © {new Date().getFullYear()} {t.footer_dev} — {t.footer}
          </p>
        </div>
      </footer>
    </main>
  );
}
