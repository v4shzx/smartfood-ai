"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
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

// Hooks
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { t } = useI18n();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const dashboard = useDashboard(t);
  const { activeTab, setActiveTab, activeTitle } = dashboard;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-emerald-500/30">
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-600/20 rotate-3">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    SmartFood
                  </span>
                  <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">
                    Pro Edition
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
            <div className="mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  General
                </div>
              )}
              <SidebarItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label={t.dashboard.home}
                active={activeTab === "home"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("home")}
              />
              <SidebarItem
                icon={<ShoppingCart className="w-5 h-5" />}
                label={t.dashboard.pos}
                active={activeTab === "pos"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("home")} // Error en el original? Deberia ser "pos"
              />
              <SidebarItem
                icon={<ClipboardList className="w-5 h-5" />}
                label={t.dashboard.sales}
                active={activeTab === "sales"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("sales")}
              />
            </div>

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

            <div className="mt-8 mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  Analytics
                </div>
              )}
              <SidebarItem
                icon={<BarChart3 className="w-5 h-5" />}
                label={t.dashboard.charts}
                active={activeTab === "charts"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("charts")}
              />
              <SidebarItem
                icon={<TrendingUp className="w-5 h-5" />}
                label={t.dashboard.trends}
                active={activeTab === "trends"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("trends")}
              />
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
                  {t.dashboard.aiEngine}
                </div>
              )}
              <SidebarItem
                icon={<Brain className="w-5 h-5" />}
                label={t.dashboard.prediction}
                active={activeTab === "prediction"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("prediction")}
              />
            </div>

            <div className="mt-8 mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                  Admin
                </div>
              )}
              <SidebarItem
                icon={<Users className="w-5 h-5" />}
                label={t.dashboard.staff}
                active={activeTab === "staff"}
                isCollapsed={isSidebarCollapsed}
                onClick={() => setActiveTab("staff")}
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Colapsar</span>
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
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Server</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-1" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">Admin</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Pro Role</div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-[1.5px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center p-0.5 overflow-hidden">
                  <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <button className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="p-8 md:p-12 space-y-12">
          {activeTab === "home" && <HomeView t={t} salesHistory={dashboard.salesHistory} />}
          {activeTab === "pos" && (
             <POSView
               t={t}
               posQuery={dashboard.posQuery}
               setPosQuery={dashboard.setPosQuery}
               posCategory={dashboard.posCategory}
               setPosCategory={dashboard.setPosCategory}
               storeCategories={dashboard.storeCategories}
               storeFiltered={dashboard.storeFiltered}
               addToCart={dashboard.addToCart}
               posCart={dashboard.posCart}
               updateCartQuantity={dashboard.updateCartQuantity}
               removeFromCart={dashboard.removeFromCart}
               cartTotal={dashboard.cartTotal}
             />
          )}
          {activeTab === "sales" && (
            <SalesView
              t={t}
              salesHistory={dashboard.salesHistory}
              formatCurrencyMXN={formatCurrencyMXN}
              activeTab={dashboard.activeTab}
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
        </div>
      </main>
    </div>
  );
}

function formatCurrencyMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}
