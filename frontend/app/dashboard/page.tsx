"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain, LineChart, Activity, Bot, Zap, ChevronRight, Menu, X,
  Star, Salad, Flame, ArrowUpRight, Target, LayoutDashboard,
  Settings, LogOut, Bell, Search, User, Filter, Share2, Download,
  Sparkles, ArrowRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// --- Theme Toggle ---
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all shadow-sm backdrop-blur-md"
    >
      {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
    </button>
  );
}

// --- Chart Data ---
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
  { name: "Protein", val: 140, goal: 150, color: "#10b981" }, // Emerald
  { name: "Carbs",  val: 210, goal: 200, color: "#3b82f6" }, // Blue
  { name: "Fat",    val: 55,  goal: 65,  color: "#f59e0b" }, // Amber
];

// --- Sidebar Item ---
function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer group",
        active
          ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div className={cn("w-5 h-5 transition-colors", active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")}>
        {icon}
      </div>
      {label}
    </motion.div>
  );
}

// --- Stat Card ---
function StatCard({ title, value, subtitle, icon, trend }: { title: string; value: string; subtitle: string; icon: React.ReactNode; trend?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 shadow-sm group hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
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

export default function Dashboard() {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");
  const profileRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-white transition-colors duration-500">
      {/* --- Sidebar Desktop --- */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 fixed h-screen z-40">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight">SmartFood AI</span>
          </div>
          
          <div className="space-y-2">
            <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2">{t.dashboard.menu}</div>
            <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label={t.nav.platform} active={activeTab === "insights"} onClick={() => setActiveTab("insights")} />
            <SidebarItem icon={<Salad className="w-5 h-5" />} label={t.dashboard.planner} active={activeTab === "planner"} onClick={() => setActiveTab("planner")} />
            <SidebarItem icon={<Activity className="w-5 h-5" />} label={t.dashboard.metabolic} active={activeTab === "metabolic"} onClick={() => setActiveTab("metabolic")} />
            <SidebarItem icon={<Target className="w-5 h-5" />} label={t.dashboard.goals} active={activeTab === "goals"} onClick={() => setActiveTab("goals")} />
          </div>

          <div className="mt-10 space-y-2">
            <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2">{t.dashboard.settings}</div>
            <SidebarItem icon={<User className="w-5 h-5" />} label={t.dashboard.profile} />
            <SidebarItem icon={<Settings className="w-5 h-5" />} label={t.dashboard.preferences} />
          </div>
        </div>

        <div className="mt-auto p-8 pt-4">
          <div className="bg-emerald-600 dark:bg-emerald-600/90 rounded-[2rem] p-6 shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white font-black mb-3 text-sm italic">
                <Bot className="w-5 h-5" /> {t.dashboard.coach_title}
              </div>
              <p className="text-[11px] text-emerald-50 leading-relaxed font-bold">
                {t.coach}
              </p>
            </div>
          </div>
          
        </div>
      </aside>

      {/* --- Sidebar Mobile --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed top-0 bottom-0 left-0 w-[280px] bg-white dark:bg-slate-950 z-50 flex flex-col border-r border-slate-200 dark:border-slate-900 shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-7 h-7" />
                    <span className="font-bold text-lg">SmartFood</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-1">
                  <SidebarItem icon={<LayoutDashboard />} label={t.nav.platform} active />
                  <SidebarItem icon={<Salad />} label="Meal Planner" />
                  <SidebarItem icon={<Activity />} label="Metabolic" />
                  <SidebarItem icon={<Target />} label="Goals" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-b border-slate-200 dark:border-slate-900 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"><Menu className="w-5 h-5" /></button>
            <span className="font-bold text-lg">SmartFood</span>
          </div>

          <div className="hidden md:flex flex-col gap-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return t.dashboard.morning;
                if (hour < 19) return t.dashboard.afternoon;
                return t.dashboard.evening;
              })()}
            </h2>
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <LangSwitcher />
            </div>
            <ThemeToggle />
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
              <Bell className="w-5 h-5 text-slate-500" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:shadow-sm transition-all active:scale-95"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-[10px]">AB</div>
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-2 z-50 backdrop-blur-xl"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.profile}</p>
                       <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Alex Balderas</p>
                    </div>
                    <Link href="/" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group">
                       <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                       {t.dashboard.logout}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* Welcome & Top section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Personalized Nutrition AI
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                {t.dash_title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">{t.dash_sub}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
                <Download className="w-4 h-4" /> {t.dashboard.export}
              </button>
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                <Activity className="w-4 h-4" /> {t.dashboard.add_meal}
              </button>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard title={t.stat1} value="1,840" subtitle={t.stat1s} icon={<Flame className="w-6 h-6 text-orange-500" />} trend="+12%" />
            <StatCard title={t.stat2} value="A+" subtitle={t.stat2s} icon={<Star className="w-6 h-6 text-amber-500" />} />
            <StatCard title={t.stat3} value="High" subtitle={t.stat3s} icon={<Zap className="w-6 h-6 text-purple-500" />} trend="Critical" />
            <div className="hidden xl:block">
              <StatCard title="Metabolism" value="Stable" subtitle="Last sync 2m ago" icon={<Activity className="w-6 h-6 text-emerald-500" />} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Area Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.weekly}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">{t.dashboard.efficiency}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> {t.dashboard.intake}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" /> {t.dashboard.goal}
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calorieData}>
                    <defs>
                      <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: "24px", border: "none", backgroundColor: resolvedTheme === 'dark' ? '#0f172a' : '#fff', boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)", padding: "16px" }}
                    />
                    <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="8 8" fill="none" strokeWidth={2} activeDot={false} />
                    <Area type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorIntake)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Macro Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.macro_title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">{t.dashboard.breakdown}</p>
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500 cursor-pointer hover:rotate-12 transition-transform shadow-sm">
                  <Filter className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-8">
                {macroData.map((macro, idx) => (
                  <div key={macro.name}>
                    <div className="flex justify-between items-end text-xs mb-3 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: macro.color }} />
                        {macro.name}
                      </div>
                      <div className="text-right">
                        <span className="text-slate-900 dark:text-white font-black text-base">{macro.val}g</span>
                        <span className="text-slate-400 font-medium lowercase"> / {macro.goal}g</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl h-3.5 p-1 relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(macro.val / macro.goal) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: idx * 0.2, ease: "circOut" }}
                        className="h-full rounded-xl shadow-lg"
                        style={{ backgroundColor: macro.color }}
                      >
                        <div className="w-full h-full bg-white/20 absolute inset-0 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Brain className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{t.recalc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Grid: Recent Activity & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
             <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.recent}</h3>
                  <Link href="#" className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">{t.dashboard.view_all}</Link>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Avocado Toast with Egg", calories: "420", time: "09:12 AM", type: "Breakfast" },
                    { name: "Grilled Salmon & Quinoa", calories: "680", time: "01:25 PM", type: "Lunch" },
                    { name: "Greek Yogurt & Berries", calories: "180", time: "04:45 PM", type: "Snack" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-emerald-500">
                            {item.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type} • {item.time}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-black text-slate-900 dark:text-white">{item.calories}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal</div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-20"><Brain className="w-32 h-32" /></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-8 text-emerald-100 font-black text-[12px] uppercase tracking-[0.2em]">
                    <Sparkles className="w-4 h-4" /> {t.dashboard.insight}
                  </div>
                  <h3 className="text-3xl font-black mb-6 leading-tight">Your energy levels are predicted to peak at 2:00 PM today.</h3>
                  <p className="text-emerald-50/80 mb-10 text-lg leading-relaxed font-medium">
                    Based on your morning intake and sleep data, now is the best time for your high-intensity tasks. 
                    Consider a small carb-rich snack in 30 minutes to sustain this peak.
                  </p>
                  <div className="mt-auto flex items-center gap-4">
                     <button className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-xl">
                        {t.dashboard.accept}
                     </button>
                     <button className="flex items-center gap-2 text-emerald-100 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                        {t.dashboard.details} <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.2);
        }
      `}</style>
    </div>
  );
}
