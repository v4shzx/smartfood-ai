"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  CalendarRange,
  FileCheck,
} from "lucide-react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";
import { Translation } from "@/lib/i18n";
import { ReportStats } from "@/types/dashboard";

interface ReportsViewProps {
  t: Translations;
  reportsType: "sales" | "inventory" | "finance";
  setReportsType: (t: "sales" | "inventory" | "finance") => void;
  reportsRange: "today" | "7d" | "30d" | "custom";
  setReportsRange: (r: "today" | "7d" | "30d" | "custom") => void;
  reportsFrom: string;
  setReportsFrom: (d: string) => void;
  reportsTo: string;
  setReportsTo: (d: string) => void;
  reportsStats: ReportStats;
}

export function ReportsView({
  t,
  reportsType,
  setReportsType,
  reportsRange,
  setReportsRange,
  reportsFrom,
  setReportsFrom,
  reportsTo,
  setReportsTo,
  reportsStats,
}: ReportsViewProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedAt, setGeneratedAt] = React.useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = React.useState<string | null>(null);

  const getRangeLabel = () => {
    if (reportsRange === "today") return t.dashboard.report_ranges.today;
    if (reportsRange === "7d") return t.dashboard.report_ranges["7d"];
    if (reportsRange === "30d") return t.dashboard.report_ranges["30d"];
    return `${reportsFrom || "----"} / ${reportsTo || "----"}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedAt(new Date().toLocaleString());
    window.setTimeout(() => setIsGenerating(false), 900);
  };

  const handleExport = () => {
    const generatedLabel = generatedAt || new Date().toLocaleString();
    const reportTitle = `${t.dashboard.reports} - ${getRangeLabel()}`;
    const templates = t.dashboard.templates as any;
    const templateLabel = activeTemplate ? templates?.[activeTemplate]?.label || activeTemplate : null;
    
    let templateDesc = "";
    if (activeTemplate === "daily_cut") templateDesc = "Corte operativo del día con foco en ventas y cierre";
    else if (activeTemplate === "weekly_exec") templateDesc = "Resumen ejecutivo para seguimiento gerencial";
    else if (activeTemplate === "critical_inventory") templateDesc = "Prioriza inventario crítico y reposición";
    else if (activeTemplate === "sales_by_product") templateDesc = "Concentrado de venta por producto en el rango activo";

    let templateHighlights: string[] = [];
    if (activeTemplate === "critical_inventory") templateHighlights = ["Inventario crítico", "Reposición sugerida", "Unidades en riesgo"];
    else if (activeTemplate === "sales_by_product") templateHighlights = ["Productos top", "Rotación", "Ticket promedio"];
    else if (activeTemplate === "weekly_exec") templateHighlights = ["Tendencia semanal", "Ingresos acumulados", "Comparativo ejecutivo"];
    else templateHighlights = ["Cierre del día", "Ingresos actuales", "Tickets emitidos"];

    const popup = window.open("", "_blank", "width=1100,height=900");
    if (!popup) {
      alert("No se pudo abrir la vista de exportación.");
      return;
    }

    const content = `
      <!doctype html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; }
            h1 { margin: 0 0 8px; font-size: 26px; }
            .meta { color: #475569; margin-bottom: 24px; font-size: 13px; }
            .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
            .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: .14em; color: #64748b; margin-bottom: 8px; }
            .value { font-size: 28px; font-weight: 700; }
            .section { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            .section h2 { margin: 0 0 12px; font-size: 16px; }
            .list { margin: 0; padding-left: 18px; color: #334155; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
            @media print {
              body { margin: 18mm; }
            }
          </style>
        </head>
        <body>
          <h1>${t.dashboard.reports}</h1>
          <div class="meta">${t.dashboard.type_label}: ${reportsType} · ${t.dashboard.range_label}: ${getRangeLabel()} · Generado: ${generatedLabel}</div>
          ${templateLabel ? `<div class="section"><h2>Plantilla</h2><ul class="list"><li>${templateLabel}</li><li>${templateDesc}</li></ul></div>` : ""}
          <div class="grid">
            <div class="card">
              <div class="label">${t.dashboard.incomes}</div>
              <div class="value">${formatCurrencyMXN(reportsStats.revenue)}</div>
            </div>
            <div class="card">
              <div class="label">${t.dashboard.tickets}</div>
              <div class="value">${reportsStats.tickets}</div>
            </div>
            <div class="card">
              <div class="label">Merma (Est.)</div>
              <div class="value">${formatCurrencyMXN(reportsStats.merma)}</div>
            </div>
          </div>
          <div class="section">
            <h2>${t.dashboard.preview_label}</h2>
            <ul class="list">
              <li>${t.dashboard.incomes}: ${formatCurrencyMXN(reportsStats.revenue)}</li>
              <li>${t.dashboard.tickets}: ${reportsStats.tickets}</li>
              <li>Merma: ${formatCurrencyMXN(reportsStats.merma)}</li>
            </ul>
          </div>
          <div class="section">
            <h2>${t.dashboard.templates_label}</h2>
            <ul class="list">
              <li>${t.dashboard.templates.daily_cut}</li>
              <li>${t.dashboard.templates.weekly_exec}</li>
              <li>${t.dashboard.templates.critical_inventory}</li>
              <li>${t.dashboard.templates.sales_by_product}</li>
            </ul>
          </div>
          <div class="section">
            <h2>Enfoque del documento</h2>
            <ul class="list">
              ${templateHighlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="footer">${t.dashboard.generated_at || "Generado"}: ${generatedLabel}</div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    popup.document.open();
    popup.document.write(content);
    popup.document.close();
  };

  const applyTemplate = (key: string) => {
    setActiveTemplate(key);

    if (key === "daily_cut") {
      setReportsType("sales");
      setReportsRange("today");
      setReportsFrom("");
      setReportsTo("");
    }

    if (key === "weekly_exec") {
      setReportsType("sales");
      setReportsRange("7d");
      setReportsFrom("");
      setReportsTo("");
    }

    if (key === "critical_inventory") {
      setReportsType("inventory");
      setReportsRange("today");
      setReportsFrom("");
      setReportsTo("");
    }

    if (key === "sales_by_product") {
      setReportsType("sales");
      setReportsRange("30d");
      setReportsFrom("");
      setReportsTo("");
    }

    handleGenerate();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.reports}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">{t.dashboard.reports_desc}</p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-all text-slate-900 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 transition-all">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{t.dashboard.type_label}</div>
            <select value={reportsType} onChange={(e) => setReportsType(e.target.value as any)} className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
              <optgroup label={t.dashboard.type_label} className="dark:bg-slate-900">
                <option value="sales">{t.dashboard.report_types.sales}</option>
                <option value="inventory">{t.dashboard.report_types.inventory}</option>
                <option value="finance">{t.dashboard.report_types.finance}</option>
              </optgroup>
            </select>
          </div>
          <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 transition-all">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{t.dashboard.range_label}</div>
            <select value={reportsRange} onChange={(e) => setReportsRange(e.target.value as any)} className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
              <optgroup label={t.dashboard.range_label} className="dark:bg-slate-900">
                <option value="today">{t.dashboard.report_ranges.today}</option>
                <option value="7d">{t.dashboard.report_ranges["7d"]}</option>
                <option value="30d">{t.dashboard.report_ranges["30d"]}</option>
                <option value="custom">{t.dashboard.report_ranges.custom}</option>
              </optgroup>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-white"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating ? "..." : t.dashboard.generate_btn}
            </button>
            <button 
              onClick={handleExport}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all active:scale-95"
            >
              {t.dashboard.export_pdf_btn}
            </button>
          </div>
        </div>

        {reportsRange === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{t.dashboard.from_label}</div>
              <input type="date" value={reportsFrom} onChange={(e) => setReportsFrom(e.target.value)} className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{t.dashboard.to_label}</div>
              <input type="date" value={reportsTo} onChange={(e) => setReportsTo(e.target.value)} className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white" />
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all">
              <CalendarRange className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t.dashboard.report_ranges.custom}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-all hover:border-emerald-500/20 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" /> {t.dashboard.preview_label}
            </h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">REAL DATA</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.dashboard.incomes}</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">{formatCurrencyMXN(reportsStats.revenue)}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.dashboard.tickets}</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">{reportsStats.tickets}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Merma (Est.)</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">{formatCurrencyMXN(reportsStats.merma)}</div>
            </motion.div>
          </div>
          
          <div className="mt-8 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 italic text-sm">
            {generatedAt ? `${t.dashboard.generated_at || "Generado"}: ${generatedAt}` : "Genera un reporte para preparar la exportación en PDF"}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-all hover:border-emerald-500/20 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.templates_label}</h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">{t.dashboard.auto_label}</div>
          </div>
          <div className="space-y-4">
            {[
              { key: "daily_cut", label: t.dashboard.templates.daily_cut, desc: "Cierre total del día actual" },
              { key: "weekly_exec", label: t.dashboard.templates.weekly_exec, desc: "Resumen gerencial de la semana" },
              { key: "critical_inventory", label: t.dashboard.templates.critical_inventory, desc: "Listado de faltantes urgentes" },
              { key: "sales_by_product", label: t.dashboard.templates.sales_by_product, desc: "Desglose por volumen de venta" }
            ].map((x) => (
              <button 
                key={x.key} 
                className={[
                  "w-full text-left p-5 rounded-3xl border transition-all group",
                  activeTemplate === x.key
                    ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/50 hover:border-emerald-500/30",
                ].join(" ")}
                onClick={() => applyTemplate(x.key)}
              >
                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{x.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-normal">{x.desc}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-3 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  {activeTemplate === x.key ? "Activo" : t.dashboard.generate_btn} <ArrowRight className="w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
