"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { LangSwitcher, useI18n } from "@/lib/i18n";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Box,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Download,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PackageSearch,
  Settings,
  Share2,
  ShoppingCart,
  Store,
  Sun,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
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

type DashboardTab =
  | "home"
  | "pos"
  | "sales"
  | "store"
  | "inventory"
  | "suppliers"
  | "charts"
  | "trends"
  | "reports"
  | "prediction"
  | "staff";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all shadow-sm backdrop-blur-md"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
    </button>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  isCollapsed = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}) {
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

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
}) {
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

function TabPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-3">En construccion</div>
      <div className="text-2xl font-black text-slate-900 dark:text-white">{title}</div>
      <div className="text-slate-500 dark:text-slate-400 mt-2">Esta seccion la armamos despues. Por ahora el foco es Inicio.</div>
    </div>
  );
}

function formatCurrencyMXN(value: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
}

export default function Dashboard() {
  const { t } = useI18n();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");

  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!profileRef.current) return;
      if (!(event.target instanceof Node)) return;
      if (!profileRef.current.contains(event.target)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const salesSeries = useMemo(
    () => [
      { label: "Lun", value: 8400 },
      { label: "Mar", value: 10250 },
      { label: "Mie", value: 9600 },
      { label: "Jue", value: 11800 },
      { label: "Vie", value: 14100 },
      { label: "Sab", value: 17700 },
      { label: "Dom", value: 12400 },
    ],
    []
  );

  const kpis = useMemo(() => {
    const weekRevenue = salesSeries.reduce((acc, x) => acc + x.value, 0);
    const todayRevenue = salesSeries[salesSeries.length - 1]?.value ?? 0;
    return {
      todayRevenue,
      weekRevenue,
      topProduct: { name: "Tacos al Pastor", units: 128 },
      criticalInventory: { items: 4, sku: "Tortilla 12cm", remaining: 18 },
    };
  }, [salesSeries]);

  const activeTitle =
    activeTab === "home"
      ? t.dashboard.home
      : activeTab === "pos"
        ? t.dashboard.pos
        : activeTab === "sales"
          ? t.dashboard.sales
          : activeTab === "store"
            ? t.dashboard.store
            : activeTab === "inventory"
              ? t.dashboard.inventory
              : activeTab === "suppliers"
                ? t.dashboard.suppliers
                : activeTab === "charts"
                  ? t.dashboard.charts
                  : activeTab === "trends"
                    ? t.dashboard.trends
                    : activeTab === "reports"
                      ? t.dashboard.reports
                      : activeTab === "prediction"
                        ? t.dashboard.prediction
                        : t.dashboard.staff;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-white transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 fixed h-screen z-40 transition-all duration-300 ease-in-out overflow-visible",
          isCollapsed ? "w-24" : "w-72"
        )}
      >
        <div className={cn("p-8 pb-4 bg-white dark:bg-slate-950 transition-all overflow-visible", isCollapsed && "px-4")}>
          <div className={cn("flex mb-10 transition-all overflow-visible", isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between gap-3")}>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
              {!isCollapsed && <span className="font-bold text-xl tracking-tight">SmartFood AI</span>}
            </div>
            <div className="relative group shrink-0">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 transition-colors"
                aria-label={isCollapsed ? t.dashboard.expand : t.dashboard.collapse}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className={cn("mb-10 transition-all", isCollapsed && "mb-6")}>
            <div className={cn("bg-emerald-600 dark:bg-emerald-600/90 rounded-[2rem] shadow-xl shadow-emerald-500/20 relative overflow-hidden group transition-all", isCollapsed ? "p-3 rounded-2xl" : "p-6")}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col items-center">
                <div className={cn("flex items-center gap-2 text-white font-black text-sm italic", !isCollapsed && "mb-3")}>
                  <Brain className="w-5 h-5 shrink-0" /> {!isCollapsed && "Panel Inteligente"}
                </div>
                {!isCollapsed && (
                  <p className="text-[11px] text-emerald-50 leading-relaxed font-bold">
                    Prioriza las alertas de inventario y revisa el resumen de ventas antes de abrir caja.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={cn("flex-1 overflow-y-auto custom-scrollbar transition-all", isCollapsed ? "px-4" : "p-8 pt-0")}>
          <div className="space-y-6 pb-20">
            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.menu}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<Globe className="w-5 h-5" />} label={t.dashboard.home} active={activeTab === "home"} onClick={() => setActiveTab("home")} />
              </div>
            </div>

            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.op_title}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<Zap className="w-5 h-5" />} label={t.dashboard.pos} active={activeTab === "pos"} onClick={() => setActiveTab("pos")} />
                <SidebarItem isCollapsed={isCollapsed} icon={<ClipboardList className="w-5 h-5" />} label={t.dashboard.sales} active={activeTab === "sales"} onClick={() => setActiveTab("sales")} />
                <SidebarItem isCollapsed={isCollapsed} icon={<Store className="w-5 h-5" />} label={t.dashboard.store} active={activeTab === "store"} onClick={() => setActiveTab("store")} />
              </div>
            </div>

            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.inv_title}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<Box className="w-5 h-5" />} label={t.dashboard.inventory} active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
                <SidebarItem isCollapsed={isCollapsed} icon={<Share2 className="w-5 h-5" />} label={t.dashboard.suppliers} active={activeTab === "suppliers"} onClick={() => setActiveTab("suppliers")} />
              </div>
            </div>

            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.ana_title}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<LayoutDashboard className="w-5 h-5" />} label={t.dashboard.charts} active={activeTab === "charts"} onClick={() => setActiveTab("charts")} />
                <SidebarItem isCollapsed={isCollapsed} icon={<TrendingUp className="w-5 h-5" />} label={t.dashboard.trends} active={activeTab === "trends"} onClick={() => setActiveTab("trends")} />
                <SidebarItem isCollapsed={isCollapsed} icon={<Download className="w-5 h-5" />} label={t.dashboard.reports} active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
              </div>
            </div>

            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.ai_title}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<Brain className="w-5 h-5" />} label={t.dashboard.prediction} active={activeTab === "prediction"} onClick={() => setActiveTab("prediction")} />
              </div>
            </div>

            <div>
              {!isCollapsed && <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.adm_title}</div>}
              <div className="space-y-1">
                <SidebarItem isCollapsed={isCollapsed} icon={<Users className="w-5 h-5" />} label={t.dashboard.staff} active={activeTab === "staff"} onClick={() => setActiveTab("staff")} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 bottom-0 left-0 w-[280px] bg-white dark:bg-slate-950 z-50 flex flex-col border-r border-slate-200 dark:border-slate-900 shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-7 h-7" />
                    <span className="font-bold text-lg">SmartFood</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-10">
                  <div className="bg-emerald-600 dark:bg-emerald-600/90 rounded-[2.5rem] p-6 shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-white font-black mb-3 text-sm italic">
                        <Brain className="w-5 h-5" /> Panel Inteligente
                      </div>
                      <p className="text-[11px] text-emerald-50 leading-relaxed font-bold">
                        Prioriza las alertas de inventario y revisa el resumen de ventas antes de abrir caja.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pb-10">
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.menu}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<Globe className="w-5 h-5" />} label={t.dashboard.home} active={activeTab === "home"} onClick={() => { setActiveTab("home"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>

                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.op_title}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<Zap className="w-5 h-5" />} label={t.dashboard.pos} active={activeTab === "pos"} onClick={() => { setActiveTab("pos"); setIsSidebarOpen(false); }} />
                      <SidebarItem icon={<ClipboardList className="w-5 h-5" />} label={t.dashboard.sales} active={activeTab === "sales"} onClick={() => { setActiveTab("sales"); setIsSidebarOpen(false); }} />
                      <SidebarItem icon={<Store className="w-5 h-5" />} label={t.dashboard.store} active={activeTab === "store"} onClick={() => { setActiveTab("store"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>

                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.inv_title}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<Box className="w-5 h-5" />} label={t.dashboard.inventory} active={activeTab === "inventory"} onClick={() => { setActiveTab("inventory"); setIsSidebarOpen(false); }} />
                      <SidebarItem icon={<Share2 className="w-5 h-5" />} label={t.dashboard.suppliers} active={activeTab === "suppliers"} onClick={() => { setActiveTab("suppliers"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>

                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.ana_title}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label={t.dashboard.charts} active={activeTab === "charts"} onClick={() => { setActiveTab("charts"); setIsSidebarOpen(false); }} />
                      <SidebarItem icon={<TrendingUp className="w-5 h-5" />} label={t.dashboard.trends} active={activeTab === "trends"} onClick={() => { setActiveTab("trends"); setIsSidebarOpen(false); }} />
                      <SidebarItem icon={<Download className="w-5 h-5" />} label={t.dashboard.reports} active={activeTab === "reports"} onClick={() => { setActiveTab("reports"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>

                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.ai_title}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<Brain className="w-5 h-5" />} label={t.dashboard.prediction} active={activeTab === "prediction"} onClick={() => { setActiveTab("prediction"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>

                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">{t.dashboard.adm_title}</div>
                    <div className="space-y-1">
                      <SidebarItem icon={<Users className="w-5 h-5" />} label={t.dashboard.staff} active={activeTab === "staff"} onClick={() => { setActiveTab("staff"); setIsSidebarOpen(false); }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className={cn("flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out", isCollapsed ? "lg:ml-24" : "lg:ml-72")}>
        <header className="h-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-b border-slate-200 dark:border-slate-900 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg">SmartFood</span>
          </div>

          <div className="hidden md:flex flex-col gap-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">{activeTitle}</h2>
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2">
              <LangSwitcher />
            </div>
            <ThemeToggle />
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
              <Bell className="w-5 h-5 text-slate-500" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="relative" ref={profileRef}>
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:shadow-sm transition-all active:scale-95">
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
                    <div className="space-y-1 mb-2">
                      <button className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
                        <User className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                        {t.dashboard.profile}
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
                        <Settings className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                        {t.dashboard.preferences}
                      </button>
                    </div>

                    <Link href="/" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group border-t border-slate-100 dark:border-slate-800 mt-1">
                      <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      {t.dashboard.logout}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {activeTab === "home" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <BarChart3 className="w-3.5 h-3.5" /> Resumen del negocio
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.home}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Ventas, alertas y accesos rapidos para operar hoy.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
                    <PackageSearch className="w-4 h-4" /> Ver alertas
                  </button>
                  <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    <ShoppingCart className="w-4 h-4" /> Abrir POS
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Ingresos hoy" value={formatCurrencyMXN(kpis.todayRevenue)} subtitle="Corte parcial del dia" icon={<DollarSign className="w-6 h-6 text-emerald-600" />} trend="+8%" />
                <StatCard title="Ingresos semana" value={formatCurrencyMXN(kpis.weekRevenue)} subtitle="Ultimos 7 dias" icon={<TrendingUp className="w-6 h-6 text-sky-600" />} />
                <StatCard title="Mas vendido" value={kpis.topProduct.name} subtitle={`${kpis.topProduct.units} unidades`} icon={<Store className="w-6 h-6 text-amber-600" />} />
                <StatCard title="Inventario critico" value={`${kpis.criticalInventory.items} items`} subtitle={`${kpis.criticalInventory.sku}: ${kpis.criticalInventory.remaining} uds`} icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} trend="Atencion" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Ventas (7 dias)</h3>
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">MXN</div>
                  </div>
                  <div className="h-64">
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
                        <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                        <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} formatter={(v: unknown) => [formatCurrencyMXN(Number(v)), "Ventas"]} labelFormatter={(l) => `Dia: ${l}`} />
                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#salesFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Alertas</h3>
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Hoy</div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Stock bajo", desc: "Tortilla 12cm esta por debajo del minimo.", tone: "rose" as const },
                      { title: "Anomalia de venta", desc: "Ticket promedio subio 18% vs ayer.", tone: "amber" as const },
                      { title: "Pendiente de proveedor", desc: "Entrega: Pollo (hoy, 5:00 PM).", tone: "sky" as const },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/60 dark:bg-slate-800/50 rounded-2xl border border-slate-100/60 dark:border-slate-800/60">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
                            a.tone === "rose" && "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300",
                            a.tone === "amber" && "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300",
                            a.tone === "sky" && "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-300"
                          )}
                        >
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 dark:text-white truncate">{a.title}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug mt-1">{a.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Accesos rapidos</h3>
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operar</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Punto de Venta", icon: <ShoppingCart className="w-5 h-5" />, tab: "pos" as const },
                      { label: "Registro de Ventas", icon: <ClipboardList className="w-5 h-5" />, tab: "sales" as const },
                      { label: "Inventario", icon: <Box className="w-5 h-5" />, tab: "inventory" as const },
                      { label: "Prediccion IA", icon: <Brain className="w-5 h-5" />, tab: "prediction" as const },
                    ].map((x) => (
                      <button key={x.label} onClick={() => setActiveTab(x.tab)} className="text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                              {x.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-black text-slate-900 dark:text-white truncate">{x.label}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Abrir</div>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Brain className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-8 text-emerald-100 font-black text-[12px] uppercase tracking-[0.2em]">
                      <Zap className="w-4 h-4" /> Predicciones recientes
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: "Demanda alta (6:00 PM - 9:00 PM)", desc: "Aumenta produccion de tacos y refrescos.", badge: "Hoy" },
                        { title: "Riesgo de merma", desc: "Revisar inventario de vegetales antes del cierre.", badge: "48h" },
                        { title: "Reorden sugerido", desc: "Pollo: compra recomendada para 2 dias.", badge: "Semana" },
                      ].map((p, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-sm font-black truncate">{p.title}</div>
                              <div className="text-emerald-50/85 text-[12px] leading-snug mt-1">{p.desc}</div>
                            </div>
                            <div className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-2 py-1 rounded-lg">{p.badge}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <button onClick={() => setActiveTab("prediction")} className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-xl">
                        Ver prediccion IA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== "home" && <TabPlaceholder title={activeTitle} />}
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
