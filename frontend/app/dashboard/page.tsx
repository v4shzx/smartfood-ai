"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bell,
  Box,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  User,
  Users,
  BarChart3,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Components
import { SidebarItem } from "@/components/dashboard/SidebarItem";
import { ThemeToggle } from "@/components/dashboard/shared/ThemeToggle";
import { HomeView } from "@/components/dashboard/HomeView";
import { POSView } from "@/components/dashboard/POSView";
import { SalesView } from "@/components/dashboard/SalesView";
import { StoreView } from "@/components/dashboard/StoreView";
import { InventoryView } from "@/components/dashboard/InventoryView";
import { SuppliersView } from "@/components/dashboard/SuppliersView";
import { ChartsView } from "@/components/dashboard/ChartsView";
import { TrendsView } from "@/components/dashboard/ai/TrendsView";
import { ReportsView } from "@/components/dashboard/ReportsView";
import { PredictionView } from "@/components/dashboard/ai/PredictionView";
import { StaffView } from "@/components/dashboard/StaffView";
import { AccountView } from "@/components/dashboard/AccountView";
import { TicketModal } from "@/components/dashboard/shared/TicketModal";

// Hooks
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { t } = useI18n();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: "Inventario Bajo", message: "Quedan pocos 'Tacos de Pollo'.", time: "Hace 5 min", type: "warning" },
    { id: 2, title: "Venta Exitosa", message: "Nueva orden de $450.00 MXN.", time: "Hace 12 min", type: "success" },
    { id: 3, title: "Nueva Predicción", message: "La IA sugiere subir stock de bebidas.", time: "Hace 1 hora", type: "info" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const dashboard = useDashboard(t);
  const { activeTab, setActiveTab, activeTitle, subscriptionTier } = dashboard;
  const isProOrAbove = subscriptionTier === "profesional" || subscriptionTier === "empresarial";
  const router = useRouter();

  const handleLogout = () => {
    // Simulated logout logic
    localStorage.removeItem("app-session"); // Assuming there's some session key
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans font-normal selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-40 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col h-full bg-linear-to-b from-transparent via-transparent to-slate-50/50 dark:to-slate-900/10">
          {/* Logo Section */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0">
                <img src="/logo.png" alt="SmartFood Logo" className="w-full h-full object-contain" />
              </div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    SmartFood
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
            <div className="mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  {t.dashboard.menu_title}
                </div>
              )}
              <SidebarItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label={t.dashboard.home}
                active={activeTab === "home"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("home")}
              />
              
              {/* POS: Only for Pro+ */}
              {isProOrAbove && (
                <SidebarItem
                  icon={<ShoppingCart className="w-5 h-5" />}
                  label={t.dashboard.pos}
                  active={activeTab === "pos"}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab("pos")}
                />
              )}

              <SidebarItem
                icon={<ClipboardList className="w-5 h-5" />}
                label={t.dashboard.sales}
                active={activeTab === "sales"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("sales")}
              />
            </div>

            {/* Ops Section: Only for Pro+ */}
            {isProOrAbove && (
              <div className="mt-8 mb-4">
                {!isSidebarCollapsed && (
                  <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                    {t.dashboard.store}
                  </div>
                )}
                <SidebarItem
                  icon={<Store className="w-5 h-5" />}
                  label={t.dashboard.store}
                  active={activeTab === "store"}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab("store")}
                />
                <SidebarItem
                  icon={<Box className="w-5 h-5" />}
                  label={t.dashboard.inventory}
                  active={activeTab === "inventory"}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab("inventory")}
                />
                <SidebarItem
                  icon={<Truck className="w-5 h-5" />}
                  label={t.dashboard.suppliers}
                  active={activeTab === "suppliers"}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab("suppliers")}
                />
              </div>
            )}

            <div className="mt-8 mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  {t.dashboard.ana_title}
                </div>
              )}
              <SidebarItem
                icon={<BarChart3 className="w-5 h-5" />}
                label={t.dashboard.charts}
                active={activeTab === "charts"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("charts")}
              />
              
              {/* Advanced Analytics: Only for Pro+ */}
              {isProOrAbove && (
                <>
                  <SidebarItem
                    icon={<TrendingUp className="w-5 h-5" />}
                    label={t.dashboard.trends}
                    active={activeTab === "trends"}
                    isCollapsed={isSidebarCollapsed}
                    onClick={() => setActiveTab("trends")}
                  />
                  <SidebarItem
                    icon={<Brain className="w-5 h-5" />}
                    label={t.dashboard.prediction}
                    active={activeTab === "prediction"}
                    isCollapsed={isSidebarCollapsed}
                    onClick={() => setActiveTab("prediction")}
                  />
                </>
              )}

              <SidebarItem
                icon={<Download className="w-5 h-5" />}
                label={t.dashboard.reports}
                active={activeTab === "reports"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("reports")}
              />
            </div>

            <div className="mt-8 mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  {t.dashboard.adm_title}
                </div>
              )}
              
              {/* Staff: Only for Pro+ */}
              {isProOrAbove && (
                <SidebarItem
                  icon={<Users className="w-5 h-5" />}
                  label={t.dashboard.staff}
                  active={activeTab === "staff"}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab("staff")}
                />
              )}

              <SidebarItem
                icon={<User className="w-5 h-5" />}
                label={t.dashboard.profile}
                active={activeTab === "account"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("account")}
              />
            </div>
          </nav>

          {/* Sidebar Toggle */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full h-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-emerald-600 transition-all group overflow-hidden"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
              ) : (
                <div className="flex items-center gap-2 px-4 w-full">
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-normal uppercase tracking-widest text-slate-500">{t.dashboard.collapse}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-screen",
          isSidebarCollapsed ? "ml-20" : "ml-72"
        )}
      >
        {/* Header */}
        <header className="h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <LangSwitcher />
            <ThemeToggle />
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all relative"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50 p-2 backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 mb-2">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{t.dashboard.notifications}</div>
                    </div>
                    
                    <div className="max-h-[320px] overflow-y-auto no-scrollbar space-y-1">
                      {notifications.map((n) => (
                        <div 
                          key={n.id}
                          className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-default"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            n.type === "warning" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" :
                            n.type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" :
                            "bg-blue-50 dark:bg-blue-500/10 text-blue-500"
                          )}>
                            {n.type === "warning" ? <AlertCircle className="w-4 h-4" /> :
                             n.type === "success" ? <CheckCircle2 className="w-4 h-4" /> :
                             <Info className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              {n.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 p-1">
                      <button 
                        onClick={() => {
                          setActiveTab("reports");
                          setIsNotificationsOpen(false);
                        }}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all rounded-xl"
                      >
                        {t.dashboard.view_all_reports}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center group ml-2"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20">
                  <span className="text-xs font-normal text-white uppercase tracking-wider">AB</span>
                </div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50 p-2 backdrop-blur-xl"
                  >
                    {/* User info removed as requested */}
                    
                    <button 
                      onClick={() => {
                        setActiveTab("account");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-normal uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all rounded-2xl"
                    >
                      <User className="w-4 h-4" />
                      {t.dashboard.profile}
                    </button>
                    
                    <div className="h-px bg-slate-100 dark:bg-slate-800/50 my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-normal uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-2xl"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.dashboard.logout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="p-8 md:p-12 space-y-12">
          {activeTab === "home" && (
            <HomeView 
              t={t} 
              kpis={dashboard.kpis} 
              salesSeries={dashboard.salesSeries} 
              setActiveTab={setActiveTab} 
              menuItems={dashboard.menuItems}
              subscriptionTier={subscriptionTier}
            />
          )}
          {activeTab === "pos" && (
            <POSView
              t={t}
              posQuery={dashboard.posQuery}
              setPosQuery={dashboard.setPosQuery}
              posFilteredProducts={dashboard.posFilteredProducts}
              posAdd={dashboard.posAdd}
              posDec={dashboard.posDec}
              posClear={dashboard.posClear}
              posCartLines={dashboard.posCartLines}
              posSubtotal={dashboard.posSubtotal}
              posDiscount={dashboard.posDiscount}
              setPosDiscount={dashboard.setPosDiscount}
              posTotal={dashboard.posTotal}
              posCheckout={dashboard.posCheckout}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "sales" && (
            <SalesView
              t={t}
              salesQuery={dashboard.salesQuery}
              setSalesQuery={dashboard.setSalesQuery}
              salesMethod={dashboard.salesMethod}
              setSalesMethod={dashboard.setSalesMethod}
              salesDateFrom={dashboard.salesDateFrom}
              setSalesDateFrom={dashboard.setSalesDateFrom}
              salesDateTo={dashboard.salesDateTo}
              setSalesDateTo={dashboard.setSalesDateTo}
              salesFiltered={dashboard.salesFiltered}
              setSelectedSaleId={dashboard.setSelectedSaleId}
              selectedSale={dashboard.selectedSale}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "store" && (
            <StoreView
              t={t}
              storeQuery={dashboard.storeQuery}
              setStoreQuery={dashboard.setStoreQuery}
              storeCategory={dashboard.storeCategory}
              setStoreCategory={dashboard.setStoreCategory}
              storeCategories={dashboard.storeCategories}
              storeOnlyAvailable={dashboard.storeOnlyAvailable}
              setStoreOnlyAvailable={dashboard.setStoreOnlyAvailable}
              storeFiltered={dashboard.storeFiltered}
              storeOpenCreate={dashboard.storeOpenCreate}
              storeOpenEdit={dashboard.storeOpenEdit}
              storeDelete={dashboard.storeDelete}
              storeEditorOpen={dashboard.storeEditorOpen}
              storeEditingId={dashboard.storeEditingId}
              storeForm={dashboard.storeForm}
              setStoreForm={dashboard.setStoreForm}
              storeSave={dashboard.storeSave}
              storeCloseEditor={() => dashboard.setStoreEditorOpen(false)}
            />
          )}
          {activeTab === "inventory" && (
            <InventoryView
              t={t}
              invQuery={dashboard.invQuery}
              setInvQuery={dashboard.setInvQuery}
              invOnlyCritical={dashboard.invOnlyCritical}
              setInvOnlyCritical={dashboard.setInvOnlyCritical}
              invCritical={dashboard.invCritical}
              invFiltered={dashboard.invFiltered}
              invOpen={dashboard.invOpen}
              invEditorOpen={dashboard.invEditorOpen}
              invSelected={dashboard.invSelected}
              invMoveType={dashboard.invMoveType}
              setInvMoveType={dashboard.setInvMoveType}
              invMoveQty={dashboard.invMoveQty}
              setInvMoveQty={dashboard.setInvMoveQty}
              invMoveNote={dashboard.invMoveNote}
              setInvMoveNote={dashboard.setInvMoveNote}
              invCommit={dashboard.invCommit}
              invClose={() => dashboard.setInvEditorOpen(false)}
              invMovements={dashboard.invMovements}
            />
          )}
          {activeTab === "suppliers" && (
            <SuppliersView
              t={t}
              supQuery={dashboard.supQuery}
              setSupQuery={dashboard.setSupQuery}
              supFiltered={dashboard.supFiltered}
              supSelected={dashboard.supSelected}
              setSupSelectedId={dashboard.setSupSelectedId}
              supOpenCreate={dashboard.supOpenCreate}
              supOpenEdit={dashboard.supOpenEdit}
              supEditorOpen={dashboard.supEditorOpen}
              supEditingId={dashboard.supEditingId}
              supForm={dashboard.supForm}
              setSupForm={dashboard.setSupForm}
              supSave={dashboard.supSave}
              supClose={() => dashboard.setSupEditorOpen(false)}
            />
          )}
          {activeTab === "charts" && (
            <ChartsView
              t={t}
              chartsRange={dashboard.chartsRange}
              setChartsRange={dashboard.setChartsRange}
              chartsSales={dashboard.chartsSales}
              chartsTopProducts={dashboard.chartsTopProducts}
            />
          )}
          {activeTab === "trends" && <TrendsView t={t} trendsInsights={dashboard.trendsInsights} />}
          {activeTab === "reports" && (
            <ReportsView
              t={t}
              reportsType={dashboard.reportsType}
              setReportsType={dashboard.setReportsType}
              reportsRange={dashboard.reportsRange}
              setReportsRange={dashboard.setReportsRange}
              reportsFrom={dashboard.reportsFrom}
              setReportsFrom={dashboard.setReportsFrom}
              reportsTo={dashboard.reportsTo}
              setReportsTo={dashboard.setReportsTo}
            />
          )}
          {activeTab === "prediction" && (
            <PredictionView
              t={t}
              predictionScenario={dashboard.predictionScenario}
              setPredictionScenario={dashboard.setPredictionScenario}
              predictionLift={dashboard.predictionLift}
              setPredictionLift={dashboard.setPredictionLift}
              prediction={dashboard.prediction}
              trends={dashboard.trendsInsights}
              onSimulate={dashboard.handleSimulate}
              onApply={dashboard.handleApplyPrediction}
            />
          )}
          {activeTab === "staff" && (
            <StaffView
              t={t}
              staffQuery={dashboard.staffQuery}
              setStaffQuery={dashboard.setStaffQuery}
              staffFiltered={dashboard.staffFiltered}
              staffOpenCreate={dashboard.staffOpenCreate}
              staffOpenEdit={dashboard.staffOpenEdit}
              staffEditorOpen={dashboard.staffEditorOpen}
              staffEditingId={dashboard.staffEditingId}
              staffForm={dashboard.staffForm}
              setStaffForm={dashboard.setStaffForm}
              staffSave={dashboard.staffSave}
              staffClose={() => dashboard.setStaffEditorOpen(false)}
            />
          )}
          {activeTab === "account" && (
            <AccountView 
              t={t} 
              handleLogout={handleLogout} 
              mealPlans={dashboard.mealPlans}
            />
          )}
        </div>
      </main>

      <TicketModal 
        sale={dashboard.lastSaleForTicket} 
        onClose={() => dashboard.setLastSaleForTicket(null)} 
      />
    </div>
  );
}

function formatCurrencyMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}
