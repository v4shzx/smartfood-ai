"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Search,
  ChevronRight,
  Rocket,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Brain,
  Users,
  ShieldCheck,
  Menu,
  X,
  ArrowLeft,
  ExternalLink,
  Cpu,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/dashboard/shared/ThemeToggle";

const DOCS_STRUCTURE = [
  {
    id: "getting_started",
    icon: <Rocket className="w-4 h-4" />,
    items: ["welcome", "setup", "account"]
  },
  {
    id: "core_features",
    icon: <ShoppingCart className="w-4 h-4" />,
    items: ["dashboard_overview", "pos", "sales_registry", "inventory", "store"]
  },
  {
    id: "ai_intelligence",
    icon: <Brain className="w-4 h-4" />,
    items: ["prediction", "trends", "analytics", "reports"]
  },
  {
    id: "admin_guide",
    icon: <ShieldCheck className="w-4 h-4" />,
    items: ["suppliers", "staff"]
  },
  {
    id: "ai_science",
    icon: <Cpu className="w-4 h-4" />,
    items: ["ai_logic"]
  },
  {
    id: "security_privacy",
    icon: <Lock className="w-4 h-4" />,
    items: ["security_tech"]
  }
];

export default function DocumentationPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("welcome");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSearchResults, setShowShowSearchResults] = useState(false);

  const activeSection = t.docs.sections[activeTab as keyof typeof t.docs.sections];

  // Search Logic
  const allSections = useMemo(() => {
    return Object.entries(t.docs.sections).map(([id, data]: [string, any]) => ({
      id,
      title: data.title,
      content: data.content
    }));
  }, [t.docs.sections]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allSections.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.content.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, allSections]);

  // Logic for linear navigation through all sections
  const flatItems = DOCS_STRUCTURE.flatMap(group => group.items);
  const currentIndex = flatItems.indexOf(activeTab);
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveTab(flatItems[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < flatItems.length - 1) {
      setActiveTab(flatItems[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-[#1E293B] dark:text-slate-200 font-sans antialiased transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="SmartFood AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:inline-block">SmartFood <span className="text-emerald-600">Docs</span></span>
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder={t.docs.search_placeholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowShowSearchResults(true);
              }}
              onFocus={() => setShowShowSearchResults(true)}
              className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-full text-sm w-64 transition-all outline-none text-slate-900 dark:text-white"
            />
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchQuery.trim() && (
                <>
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setShowShowSearchResults(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50 p-2 min-w-[320px]"
                  >
                    {filteredResults.length > 0 ? (
                      <div className="space-y-1">
                        {filteredResults.map((res) => (
                          <button
                            key={res.id}
                            onClick={() => {
                              setActiveTab(res.id);
                              setSearchQuery("");
                              setShowShowSearchResults(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{res.title}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{res.content}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <div className="text-slate-400 dark:text-slate-600 text-sm font-medium">No se encontraron resultados</div>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <ThemeToggle />
          <Link href="/login" className="hidden sm:flex items-center gap-2 bg-emerald-600 dark:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-sm shadow-emerald-500/20">
            {t.nav.docs_cta} <ExternalLink className="w-3 h-3" />
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className="flex pt-16 max-w-8xl mx-auto">
        {/* Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={cn(
          "fixed md:sticky top-16 h-[calc(100vh-64px)] w-72 bg-white md:bg-transparent dark:bg-slate-950 md:dark:bg-transparent border-r border-slate-200/60 dark:border-slate-800/60 md:border-none p-6 overflow-y-auto transition-transform z-50 md:z-auto scrollbar-hide",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="space-y-8 pb-20">
            {DOCS_STRUCTURE.map((group) => (
              <div key={group.id} className="space-y-3">
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  {group.icon}
                  {t.docs[group.id as keyof typeof t.docs] as string}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveTab(item);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all group",
                        activeTab === item 
                          ? "bg-white dark:bg-slate-900 shadow-md shadow-slate-200/50 dark:shadow-none text-emerald-600 dark:text-emerald-400 border border-slate-200/50 dark:border-slate-800" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50"
                      )}
                    >
                      {t.docs.sections[item as keyof typeof t.docs.sections].title}
                      {activeTab === item && (
                        <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-6 py-10 md:px-16 lg:px-24 border-r border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-3xl mx-auto pb-20">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">SmartFood</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span>Docs</span>
                </nav>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {activeSection.title}
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {activeSection.content}
                </p>
              </div>

              {/* Dynamic Guide Content Based on Tab */}
              {activeTab === "welcome" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {[
                    { title: t.docs.features.dashboard.title, desc: t.docs.features.dashboard.desc, icon: <LayoutDashboard className="text-blue-500" /> },
                    { title: t.docs.features.prediction.title, desc: t.docs.features.prediction.desc, icon: <Brain className="text-emerald-500" /> },
                    { title: t.docs.features.sales.title, desc: t.docs.features.sales.desc, icon: <ShoppingCart className="text-amber-500" /> },
                    { title: t.docs.features.team.title, desc: t.docs.features.team.desc, icon: <Users className="text-purple-500" /> },
                  ].map((feat, i) => (
                    <motion.div 
                      whileHover={{ y: -4 }}
                      key={i} 
                      className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all cursor-default group"
                    >
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {feat.icon}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{feat.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{feat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "setup" && (
                <div className="space-y-6 pt-4 text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex gap-4 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30">
                    <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm font-black border border-emerald-100 dark:border-emerald-900/30">1</div>
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Crea tu cuenta</h4>
                      <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">Regístrate como Administrador para tener control total de tu cafetería.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                    <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm font-black border border-blue-100 dark:border-blue-900/30">2</div>
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300">Configura Productos</h4>
                      <p className="text-sm text-blue-700/80 dark:text-blue-400/80">Añade categorías y productos con sus respectivos precios y stock inicial.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic rendering of items with real content */}
              <div className="grid grid-cols-1 gap-12">
                {activeSection.items?.map((item: any, i: number) => (
                  <div key={i} className="group cursor-default animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-1.5 h-8 bg-emerald-500 rounded-full group-hover:h-10 transition-all" />
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                    </div>
                    <div className="relative pl-6">
                       <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 ml-px" />
                       <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                         {item.desc}
                       </p>
                       
                       {/* Subtle visual touch for AI sections */}
                       {activeTab.includes('ai') && (
                         <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                           <Sparkles className="w-3 h-3" /> Optimizando procesos
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-16 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <button 
                  onClick={handlePrev}
                  className={cn(
                    "flex items-center gap-2 font-bold transition-all active:scale-95",
                    currentIndex === 0 ? "opacity-0 pointer-events-none" : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>
                <button 
                  onClick={handleNext}
                  className={cn(
                    "flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all active:scale-95",
                    currentIndex === flatItems.length - 1 ? "opacity-0 pointer-events-none" : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  )}
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar - On this page */}
        <aside className="hidden lg:block w-64 pt-10 sticky top-16 h-[calc(100vh-64px)] px-6">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {t.docs.on_this_page}
            </h4>
            <div className="space-y-4 border-l-2 border-slate-100 dark:border-slate-800">
              {activeSection.items?.map((item: any, i: number) => (
                <button 
                  key={i} 
                  className={cn(
                    "block w-full text-left pl-4 text-sm font-bold transition-all border-l-2 -ml-[2px] py-1",
                    i === 0 ? "text-emerald-600 dark:text-emerald-400 border-emerald-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 border-transparent"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
