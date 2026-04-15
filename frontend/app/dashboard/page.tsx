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
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Download,
  Building2,
  Globe,
  History,
  LayoutDashboard,
  LineChart,
  LogOut,
  Mail,
  Menu,
  Moon,
  PackageSearch,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  MinusCircle,
  Settings,
  Share2,
  ShoppingCart,
  Store,
  Sun,
  TrendingUp,
  Trash2,
  Truck,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as ReLineChart,
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
  const [posQuery, setPosQuery] = useState("");
  const [posDiscount, setPosDiscount] = useState(0);
  const [posCart, setPosCart] = useState<Record<string, number>>({});
  const [salesQuery, setSalesQuery] = useState("");
  const [salesMethod, setSalesMethod] = useState<"all" | "cash" | "card">("all");
  const [salesDateFrom, setSalesDateFrom] = useState("");
  const [salesDateTo, setSalesDateTo] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [storeQuery, setStoreQuery] = useState("");
  const [storeCategory, setStoreCategory] = useState<"all" | "Tacos" | "Antojitos" | "Bebidas" | "Postres">("all");
  const [storeOnlyAvailable, setStoreOnlyAvailable] = useState(false);
  const [storeEditorOpen, setStoreEditorOpen] = useState(false);
  const [storeEditingId, setStoreEditingId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState<{ name: string; category: "Tacos" | "Antojitos" | "Bebidas" | "Postres"; price: number; available: boolean; imageUrl: string }>({
    name: "",
    category: "Tacos",
    price: 0,
    available: true,
    imageUrl: "",
  });
  const [storeProducts, setStoreProducts] = useState<
    { id: string; name: string; category: "Tacos" | "Antojitos" | "Bebidas" | "Postres"; price: number; available: boolean; imageUrl: string }[]
  >([
    { id: "p1", name: "Taco al Pastor", category: "Tacos", price: 22, available: true, imageUrl: "" },
    { id: "p2", name: "Taco de Suadero", category: "Tacos", price: 24, available: true, imageUrl: "" },
    { id: "p3", name: "Quesadilla", category: "Antojitos", price: 35, available: true, imageUrl: "" },
    { id: "p4", name: "Agua de Horchata", category: "Bebidas", price: 28, available: true, imageUrl: "" },
    { id: "p5", name: "Flan", category: "Postres", price: 40, available: false, imageUrl: "" },
  ]);
  const [invQuery, setInvQuery] = useState("");
  const [invOnlyCritical, setInvOnlyCritical] = useState(false);
  const [invEditorOpen, setInvEditorOpen] = useState(false);
  const [invSelectedId, setInvSelectedId] = useState<string | null>(null);
  const [invMoveType, setInvMoveType] = useState<"in" | "out" | "adjust">("out");
  const [invMoveQty, setInvMoveQty] = useState(1);
  const [invMoveNote, setInvMoveNote] = useState("");
  const [invItems, setInvItems] = useState<
    { id: string; name: string; sku: string; unit: string; onHand: number; min: number; updatedAt: string }[]
  >([
    { id: "i1", name: "Tortilla 12cm", sku: "TOR-12", unit: "pz", onHand: 18, min: 40, updatedAt: "2026-04-15T09:10:00" },
    { id: "i2", name: "Pollo", sku: "POL-01", unit: "kg", onHand: 12, min: 8, updatedAt: "2026-04-15T08:55:00" },
    { id: "i3", name: "Cebolla", sku: "CEB-01", unit: "kg", onHand: 3, min: 5, updatedAt: "2026-04-15T07:40:00" },
    { id: "i4", name: "Cilantro", sku: "CIL-01", unit: "kg", onHand: 1.2, min: 2, updatedAt: "2026-04-14T20:11:00" },
    { id: "i5", name: "Refresco Lata", sku: "REF-LAT", unit: "pz", onHand: 96, min: 60, updatedAt: "2026-04-14T18:22:00" },
  ]);
  const [invMovements, setInvMovements] = useState<
    { id: string; ts: string; itemId: string; type: "in" | "out" | "adjust"; qty: number; note: string }[]
  >([
    { id: "m1", ts: "2026-04-15T09:12:00", itemId: "i1", type: "out", qty: 22, note: "Ventas (estimado)" },
    { id: "m2", ts: "2026-04-15T08:30:00", itemId: "i2", type: "in", qty: 6, note: "Recepcion proveedor" },
    { id: "m3", ts: "2026-04-14T20:15:00", itemId: "i3", type: "adjust", qty: -1, note: "Merma" },
  ]);
  const [supQuery, setSupQuery] = useState("");
  const [supEditorOpen, setSupEditorOpen] = useState(false);
  const [supEditingId, setSupEditingId] = useState<string | null>(null);
  const [supSelectedId, setSupSelectedId] = useState<string | null>(null);
  const [supForm, setSupForm] = useState<{ name: string; contact: string; phone: string; email: string; leadDays: number; notes: string }>({
    name: "",
    contact: "",
    phone: "",
    email: "",
    leadDays: 2,
    notes: "",
  });
  const [suppliers, setSuppliers] = useState<
    { id: string; name: string; contact: string; phone: string; email: string; leadDays: number; lastPurchaseAt: string; rating: number; notes: string }[]
  >([
    { id: "v1", name: "Distribuidora La Huerta", contact: "Carlos M.", phone: "+52 55 1234 5678", email: "ventas@lahuerta.mx", leadDays: 1, lastPurchaseAt: "2026-04-14T18:00:00", rating: 4.6, notes: "Verduras y hierbas frescas. Entrega diaria." },
    { id: "v2", name: "Carnes El Toro", contact: "Sofia R.", phone: "+52 55 2222 1111", email: "pedidos@eltoro.mx", leadDays: 2, lastPurchaseAt: "2026-04-13T10:30:00", rating: 4.2, notes: "Res y cerdo. Confirmar cortes con un dia." },
    { id: "v3", name: "Abarrotes Centro", contact: "Luis P.", phone: "+52 55 3333 9090", email: "contacto@abarrotescentro.mx", leadDays: 3, lastPurchaseAt: "2026-04-10T09:20:00", rating: 4.0, notes: "Desechables, refrescos, salsas." },
  ]);
  const [chartsRange, setChartsRange] = useState<"7d" | "30d" | "90d">("30d");
  const [reportsRange, setReportsRange] = useState<"today" | "7d" | "30d" | "custom">("7d");
  const [reportsFrom, setReportsFrom] = useState("");
  const [reportsTo, setReportsTo] = useState("");
  const [reportsType, setReportsType] = useState<"sales" | "inventory" | "finance">("sales");
  const [predictionScenario, setPredictionScenario] = useState<"baseline" | "promo" | "rain">("baseline");
  const [predictionLift, setPredictionLift] = useState(10); // promo %
  const [staffQuery, setStaffQuery] = useState("");
  const [staffEditorOpen, setStaffEditorOpen] = useState(false);
  const [staffEditingId, setStaffEditingId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState<{ name: string; role: "Admin" | "Gerente" | "Cajero" | "Cocina"; active: boolean }>({
    name: "",
    role: "Cajero",
    active: true,
  });
  const [staff, setStaff] = useState<
    { id: string; name: string; role: "Admin" | "Gerente" | "Cajero" | "Cocina"; active: boolean; lastActiveAt: string }[]
  >([
    { id: "u1", name: "Alejandro", role: "Admin", active: true, lastActiveAt: "2026-04-15T09:20:00" },
    { id: "u2", name: "Ana", role: "Cajero", active: true, lastActiveAt: "2026-04-15T10:05:00" },
    { id: "u3", name: "Luis", role: "Cocina", active: true, lastActiveAt: "2026-04-14T20:11:00" },
    { id: "u4", name: "Sofia", role: "Gerente", active: false, lastActiveAt: "2026-04-01T12:00:00" },
  ]);

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

  const salesData = useMemo(
    () => [
      { id: "S-10492", ts: "2026-04-15T09:12:00", items: 5, total: 312, method: "cash" as const, cashier: "Ana" },
      { id: "S-10493", ts: "2026-04-15T10:05:00", items: 2, total: 78, method: "card" as const, cashier: "Ana" },
      { id: "S-10494", ts: "2026-04-15T12:34:00", items: 8, total: 496, method: "cash" as const, cashier: "Luis" },
      { id: "S-10495", ts: "2026-04-14T18:22:00", items: 3, total: 165, method: "card" as const, cashier: "Luis" },
      { id: "S-10496", ts: "2026-04-14T20:11:00", items: 9, total: 612, method: "cash" as const, cashier: "Ana" },
      { id: "S-10497", ts: "2026-04-13T14:48:00", items: 4, total: 208, method: "card" as const, cashier: "Sofia" },
    ],
    []
  );

  const salesFiltered = useMemo(() => {
    const q = salesQuery.trim().toLowerCase();
    const from = salesDateFrom ? new Date(`${salesDateFrom}T00:00:00`) : null;
    const to = salesDateTo ? new Date(`${salesDateTo}T23:59:59`) : null;
    return salesData.filter((s) => {
      if (salesMethod !== "all" && s.method !== salesMethod) return false;
      const d = new Date(s.ts);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (q) {
        const hay = `${s.id} ${s.cashier} ${s.method}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [salesData, salesDateFrom, salesDateTo, salesMethod, salesQuery]);

  const selectedSale = useMemo(() => {
    if (!selectedSaleId) return null;
    const base = salesData.find((s) => s.id === selectedSaleId);
    if (!base) return null;
    // Mock line items for now (replace with backend)
    const lines = [
      { name: "Taco al Pastor", qty: 6, price: 22 },
      { name: "Agua de Horchata", qty: 2, price: 28 },
    ];
    const subtotal = lines.reduce((acc, l) => acc + l.qty * l.price, 0);
    const discount = Math.round(subtotal * 0.05);
    return { ...base, lines, subtotal, discount, total: Math.max(0, subtotal - discount) };
  }, [salesData, selectedSaleId]);

  const storeCategories = useMemo(() => ["Tacos", "Antojitos", "Bebidas", "Postres"] as const, []);

  const storeFiltered = useMemo(() => {
    const q = storeQuery.trim().toLowerCase();
    return storeProducts.filter((p) => {
      if (storeCategory !== "all" && p.category !== storeCategory) return false;
      if (storeOnlyAvailable && !p.available) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [storeCategory, storeOnlyAvailable, storeProducts, storeQuery]);

  function storeOpenCreate() {
    setStoreEditingId(null);
    setStoreForm({ name: "", category: "Tacos", price: 0, available: true, imageUrl: "" });
    setStoreEditorOpen(true);
  }

  function storeOpenEdit(id: string) {
    const p = storeProducts.find((x) => x.id === id);
    if (!p) return;
    setStoreEditingId(id);
    setStoreForm({ name: p.name, category: p.category, price: p.price, available: p.available, imageUrl: p.imageUrl });
    setStoreEditorOpen(true);
  }

  function storeSave() {
    const name = storeForm.name.trim();
    if (!name) return;
    if (storeEditingId) {
      setStoreProducts((prev) =>
        prev.map((p) => (p.id === storeEditingId ? { ...p, ...storeForm, name, price: Math.max(0, Number(storeForm.price) || 0) } : p))
      );
    } else {
      const id = `p_${Date.now().toString(36)}`;
      setStoreProducts((prev) => [{ id, ...storeForm, name, price: Math.max(0, Number(storeForm.price) || 0) }, ...prev]);
    }
    setStoreEditingId(null);
    setStoreForm({ name: "", category: "Tacos", price: 0, available: true, imageUrl: "" });
    setStoreEditorOpen(false);
  }

  function storeCloseEditor() {
    setStoreEditorOpen(false);
    setStoreEditingId(null);
    setStoreForm({ name: "", category: "Tacos", price: 0, available: true, imageUrl: "" });
  }

  function storeDelete(id: string) {
    setStoreProducts((prev) => prev.filter((p) => p.id !== id));
    if (storeEditingId === id) setStoreEditingId(null);
  }

  const invCritical = useMemo(() => invItems.filter((i) => i.onHand <= i.min), [invItems]);

  const invFiltered = useMemo(() => {
    const q = invQuery.trim().toLowerCase();
    return invItems.filter((i) => {
      if (invOnlyCritical && !(i.onHand <= i.min)) return false;
      if (!q) return true;
      const hay = `${i.name} ${i.sku}`.toLowerCase();
      return hay.includes(q);
    });
  }, [invItems, invOnlyCritical, invQuery]);

  const invSelected = useMemo(() => {
    if (!invSelectedId) return null;
    return invItems.find((x) => x.id === invSelectedId) ?? null;
  }, [invItems, invSelectedId]);

  function invOpen(itemId: string, type: "in" | "out" | "adjust") {
    setInvSelectedId(itemId);
    setInvMoveType(type);
    setInvMoveQty(1);
    setInvMoveNote("");
    setInvEditorOpen(true);
  }

  function invClose() {
    setInvEditorOpen(false);
    setInvSelectedId(null);
    setInvMoveQty(1);
    setInvMoveNote("");
  }

  function invCommit() {
    if (!invSelected) return;
    const qty = Math.max(0, Number(invMoveQty) || 0);
    if (qty === 0) return;

    const delta = invMoveType === "in" ? qty : invMoveType === "out" ? -qty : qty; // adjust uses signed qty from input
    const finalDelta = invMoveType === "adjust" ? Number(invMoveQty) || 0 : delta;

    setInvItems((prev) =>
      prev.map((it) =>
        it.id === invSelected.id
          ? {
              ...it,
              onHand: Math.max(0, it.onHand + finalDelta),
              updatedAt: new Date().toISOString(),
            }
          : it
      )
    );

    setInvMovements((prev) => [
      {
        id: `m_${Date.now().toString(36)}`,
        ts: new Date().toISOString(),
        itemId: invSelected.id,
        type: invMoveType,
        qty: invMoveType === "adjust" ? finalDelta : qty,
        note: invMoveNote.trim() || (invMoveType === "in" ? "Entrada" : invMoveType === "out" ? "Salida" : "Ajuste"),
      },
      ...prev,
    ]);

    invClose();
  }

  const supFiltered = useMemo(() => {
    const q = supQuery.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => {
      const hay = `${s.name} ${s.contact} ${s.email} ${s.phone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [supQuery, suppliers]);

  const supSelected = useMemo(() => {
    const id = supSelectedId ?? (suppliers[0]?.id ?? null);
    if (!id) return null;
    return suppliers.find((s) => s.id === id) ?? null;
  }, [supSelectedId, suppliers]);

  function supOpenCreate() {
    setSupEditingId(null);
    setSupForm({ name: "", contact: "", phone: "", email: "", leadDays: 2, notes: "" });
    setSupEditorOpen(true);
  }

  function supOpenEdit(id: string) {
    const s = suppliers.find((x) => x.id === id);
    if (!s) return;
    setSupEditingId(id);
    setSupForm({ name: s.name, contact: s.contact, phone: s.phone, email: s.email, leadDays: s.leadDays, notes: s.notes });
    setSupEditorOpen(true);
  }

  function supClose() {
    setSupEditorOpen(false);
    setSupEditingId(null);
    setSupForm({ name: "", contact: "", phone: "", email: "", leadDays: 2, notes: "" });
  }

  function supSave() {
    const name = supForm.name.trim();
    if (!name) return;
    const leadDays = Math.max(0, Math.round(Number(supForm.leadDays) || 0));
    if (supEditingId) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === supEditingId ? { ...s, ...supForm, name, leadDays } : s))
      );
      setSupSelectedId(supEditingId);
    } else {
      const id = `v_${Date.now().toString(36)}`;
      setSuppliers((prev) => [
        { id, name, contact: supForm.contact, phone: supForm.phone, email: supForm.email, leadDays, lastPurchaseAt: "", rating: 4.0, notes: supForm.notes },
        ...prev,
      ]);
      setSupSelectedId(id);
    }
    supClose();
  }

  const chartsSales = useMemo(() => {
    if (chartsRange === "7d") {
      return [
        { label: "Lun", sales: 8400, tickets: 92 },
        { label: "Mar", sales: 10250, tickets: 104 },
        { label: "Mie", sales: 9600, tickets: 98 },
        { label: "Jue", sales: 11800, tickets: 110 },
        { label: "Vie", sales: 14100, tickets: 132 },
        { label: "Sab", sales: 17700, tickets: 160 },
        { label: "Dom", sales: 12400, tickets: 118 },
      ];
    }
    if (chartsRange === "90d") {
      return [
        { label: "Ene", sales: 312000, tickets: 3400 },
        { label: "Feb", sales: 298000, tickets: 3220 },
        { label: "Mar", sales: 336000, tickets: 3650 },
      ];
    }
    return [
      { label: "Sem 1", sales: 76200, tickets: 830 },
      { label: "Sem 2", sales: 81400, tickets: 870 },
      { label: "Sem 3", sales: 85600, tickets: 910 },
      { label: "Sem 4", sales: 80100, tickets: 885 },
    ];
  }, [chartsRange]);

  const chartsTopProducts = useMemo(
    () => [
      { name: "Taco al Pastor", val: 1280 },
      { name: "Quesadilla", val: 740 },
      { name: "Agua de Horchata", val: 690 },
      { name: "Gringa", val: 410 },
      { name: "Flan", val: 280 },
    ],
    []
  );

  const trendsInsights = useMemo(
    () => [
      { title: "Pico de demanda", desc: "El horario 6:00 PM - 9:00 PM concentra el mayor volumen de tickets." },
      { title: "Ticket promedio", desc: "Con tarjeta el ticket promedio es 12% mayor que en efectivo." },
      { title: "Productos complementarios", desc: "Horchata se vende con tacos en 34% de los tickets." },
      { title: "Riesgo de merma", desc: "Cilantro y cebolla caen a stock crítico 3 veces por semana." },
    ],
    []
  );

  const prediction = useMemo(() => {
    const base = [
      { hour: "12", val: 22 },
      { hour: "13", val: 28 },
      { hour: "14", val: 34 },
      { hour: "15", val: 30 },
      { hour: "16", val: 26 },
      { hour: "17", val: 31 },
      { hour: "18", val: 46 },
      { hour: "19", val: 58 },
      { hour: "20", val: 52 },
      { hour: "21", val: 38 },
    ];
    if (predictionScenario === "rain") return base.map((x) => ({ ...x, val: Math.round(x.val * 0.92) }));
    if (predictionScenario === "promo") return base.map((x) => ({ ...x, val: Math.round(x.val * (1 + predictionLift / 100)) }));
    return base;
  }, [predictionLift, predictionScenario]);

  const staffFiltered = useMemo(() => {
    const q = staffQuery.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((u) => `${u.name} ${u.role}`.toLowerCase().includes(q));
  }, [staff, staffQuery]);

  function staffOpenCreate() {
    setStaffEditingId(null);
    setStaffForm({ name: "", role: "Cajero", active: true });
    setStaffEditorOpen(true);
  }

  function staffOpenEdit(id: string) {
    const u = staff.find((x) => x.id === id);
    if (!u) return;
    setStaffEditingId(id);
    setStaffForm({ name: u.name, role: u.role, active: u.active });
    setStaffEditorOpen(true);
  }

  function staffClose() {
    setStaffEditorOpen(false);
    setStaffEditingId(null);
    setStaffForm({ name: "", role: "Cajero", active: true });
  }

  function staffSave() {
    const name = staffForm.name.trim();
    if (!name) return;
    if (staffEditingId) {
      setStaff((prev) => prev.map((u) => (u.id === staffEditingId ? { ...u, ...staffForm, name } : u)));
    } else {
      const id = `u_${Date.now().toString(36)}`;
      setStaff((prev) => [{ id, name, role: staffForm.role, active: staffForm.active, lastActiveAt: new Date().toISOString() }, ...prev]);
    }
    staffClose();
  }

  const posProducts = useMemo(
    () => [
      { id: "taco_pastor", name: "Taco al Pastor", price: 22, category: "Tacos" },
      { id: "taco_suadero", name: "Taco de Suadero", price: 24, category: "Tacos" },
      { id: "quesadilla", name: "Quesadilla", price: 35, category: "Antojitos" },
      { id: "gringa", name: "Gringa", price: 65, category: "Antojitos" },
      { id: "agua_horchata", name: "Agua de Horchata", price: 28, category: "Bebidas" },
      { id: "refresco", name: "Refresco", price: 25, category: "Bebidas" },
      { id: "postre_flann", name: "Flan", price: 40, category: "Postres" },
    ],
    []
  );

  const posFilteredProducts = useMemo(() => {
    const q = posQuery.trim().toLowerCase();
    if (!q) return posProducts;
    return posProducts.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [posProducts, posQuery]);

  const posCartLines = useMemo(() => {
    const byId = new Map(posProducts.map((p) => [p.id, p]));
    return Object.entries(posCart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = byId.get(id);
        if (!p) return null;
        const lineTotal = p.price * qty;
        return { ...p, qty, lineTotal };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [posCart, posProducts]);

  const posSubtotal = useMemo(() => posCartLines.reduce((acc, l) => acc + l.lineTotal, 0), [posCartLines]);
  const posDiscountValue = useMemo(() => Math.min(posSubtotal, Math.max(0, posDiscount)), [posDiscount, posSubtotal]);
  const posTotal = useMemo(() => Math.max(0, posSubtotal - posDiscountValue), [posDiscountValue, posSubtotal]);

  function posAdd(id: string) {
    setPosCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function posDec(id: string) {
    setPosCart((prev) => {
      const next = { ...prev };
      const cur = next[id] ?? 0;
      if (cur <= 1) delete next[id];
      else next[id] = cur - 1;
      return next;
    });
  }

  function posClear() {
    setPosCart({});
    setPosDiscount(0);
  }

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

          {activeTab === "pos" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <ShoppingCart className="w-3.5 h-3.5" /> {t.dashboard.pos}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.pos}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Crea ventas rapido: productos, carrito, descuento y pago.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button
                    onClick={posClear}
                    className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-rose-500/40 transition-all shadow-sm text-rose-600 dark:text-rose-300"
                  >
                    <X className="w-4 h-4" /> Limpiar
                  </button>
                  <button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    onClick={() => setActiveTab("sales")}
                  >
                    <ClipboardList className="w-4 h-4" /> Ver registro
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Catalog */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Catalogo</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Busqueda rapida</p>
                    </div>
                    <div className="w-full md:w-[320px]">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <PackageSearch className="w-4 h-4 text-slate-400" />
                        <input
                          value={posQuery}
                          onChange={(e) => setPosQuery(e.target.value)}
                          placeholder="Buscar producto o categoria..."
                          className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {posFilteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => posAdd(p.id)}
                        className="text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 hover:bg-emerald-50/60 dark:hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-black text-slate-900 dark:text-white truncate">{p.name}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">{p.category}</div>
                          </div>
                          <div className="shrink-0 text-emerald-700 dark:text-emerald-300 font-black text-sm">{formatCurrencyMXN(p.price)}</div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Agregar</div>
                          <ArrowUpRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cart */}
                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Carrito</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{posCartLines.length} items</div>
                  </div>

                  <div className="space-y-3">
                    {posCartLines.length === 0 && (
                      <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                        Agrega productos desde el catalogo.
                      </div>
                    )}

                    {posCartLines.map((l) => (
                      <div key={l.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-800/60">
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 dark:text-white truncate">{l.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                            {formatCurrencyMXN(l.price)} c/u
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => posDec(l.id)} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 font-black text-slate-700 dark:text-slate-200">
                            -
                          </button>
                          <div className="w-10 text-center font-black text-slate-900 dark:text-white">{l.qty}</div>
                          <button onClick={() => posAdd(l.id)} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 font-black text-slate-700 dark:text-slate-200">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                      <span>Subtotal</span>
                      <span className="font-black">{formatCurrencyMXN(posSubtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">Descuento</div>
                      <div className="w-[140px] flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <input
                          inputMode="numeric"
                          value={posDiscount}
                          onChange={(e) => setPosDiscount(Number(e.target.value || 0))}
                          className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white">
                      <span>Total</span>
                      <span className="font-black">{formatCurrencyMXN(posTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                      disabled={posCartLines.length === 0}
                      className="flex items-center justify-between gap-3 bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <span>Pagar (Efectivo)</span>
                      <span>{formatCurrencyMXN(posTotal)}</span>
                    </button>
                    <button
                      disabled={posCartLines.length === 0}
                      className="flex items-center justify-between gap-3 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 disabled:opacity-60 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
                    >
                      <span>Pagar (Tarjeta)</span>
                      <span>{formatCurrencyMXN(posTotal)}</span>
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                      Ticket/factura, promociones e integracion con inventario: siguiente iteracion.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "sales" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <ClipboardList className="w-3.5 h-3.5" /> {t.dashboard.sales}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.sales}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Historial, filtros y detalle por transaccion.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Exportar CSV
                  </button>
                  <button
                    onClick={() => setActiveTab("pos")}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" /> Ir a POS
                  </button>
                </motion.div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <PackageSearch className="w-4 h-4 text-slate-400" />
                      <input
                        value={salesQuery}
                        onChange={(e) => setSalesQuery(e.target.value)}
                        placeholder="Buscar por folio, cajero o metodo..."
                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Metodo</div>
                      <select
                        value={salesMethod}
                        onChange={(e) => setSalesMethod(e.target.value as "all" | "cash" | "card")}
                        className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                      >
                        <option value="all">Todos</option>
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Desde</div>
                      <input
                        type="date"
                        value={salesDateFrom}
                        onChange={(e) => setSalesDateFrom(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Hasta</div>
                      <input
                        type="date"
                        value={salesDateTo}
                        onChange={(e) => setSalesDateTo(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Transacciones</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{salesFiltered.length} resultados</div>
                  </div>

                  <div className="space-y-3">
                    {salesFiltered.map((s) => {
                      const d = new Date(s.ts);
                      const methodLabel = s.method === "cash" ? "Efectivo" : "Tarjeta";
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSaleId(s.id)}
                          className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-black text-slate-900 dark:text-white">{s.id}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                  {methodLabel}
                                </div>
                              </div>
                              <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                                {d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} · Cajero:{" "}
                                <span className="font-bold">{s.cashier}</span> · Items: <span className="font-bold">{s.items}</span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(s.total)}</div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mt-1">Ver detalle</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Resumen</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Filtrado</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                      <span>Ingresos</span>
                      <span className="font-black">{formatCurrencyMXN(salesFiltered.reduce((acc, s) => acc + s.total, 0))}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                      <span>Tickets</span>
                      <span className="font-black">{salesFiltered.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                      <span>Ticket promedio</span>
                      <span className="font-black">
                        {formatCurrencyMXN(salesFiltered.length ? salesFiltered.reduce((acc, s) => acc + s.total, 0) / salesFiltered.length : 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Siguiente</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-1">Export PDF, notas y devoluciones</div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">Lo conectamos cuando integremos facturacion y reglas de caja.</div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {selectedSale && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedSaleId(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[520px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Detalle</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedSale.id}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(selectedSale.ts).toLocaleString()} · Cajero: <span className="font-bold">{selectedSale.cashier}</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedSaleId(null)} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {selectedSale.lines.map((l, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100/60 dark:border-slate-800/60">
                            <div className="min-w-0">
                              <div className="text-sm font-black text-slate-900 dark:text-white truncate">{l.name}</div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                                {l.qty} x {formatCurrencyMXN(l.price)}
                              </div>
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrencyMXN(l.qty * l.price)}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                          <span>Subtotal</span>
                          <span className="font-black">{formatCurrencyMXN(selectedSale.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                          <span>Descuento</span>
                          <span className="font-black">-{formatCurrencyMXN(selectedSale.discount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white pt-2">
                          <span>Total</span>
                          <span className="font-black">{formatCurrencyMXN(selectedSale.total)}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                          Reimprimir ticket
                        </button>
                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                          Exportar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab === "store" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Store className="w-3.5 h-3.5" /> {t.dashboard.store}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.store}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Productos, categorias, precios e imagenes.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button
                    onClick={storeOpenCreate}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Nuevo producto
                  </button>
                </motion.div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <PackageSearch className="w-4 h-4 text-slate-400" />
                      <input
                        value={storeQuery}
                        onChange={(e) => setStoreQuery(e.target.value)}
                        placeholder="Buscar producto o categoria..."
                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Categoria</div>
                      <select
                        value={storeCategory}
                        onChange={(e) => setStoreCategory(e.target.value as typeof storeCategory)}
                        className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                      >
                        <option value="all">Todas</option>
                        {storeCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Disponibles</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Solo activos</div>
                    </div>
                    <button
                      onClick={() => setStoreOnlyAvailable((v) => !v)}
                      className={cn(
                        "w-12 h-7 rounded-full border transition-all relative",
                        storeOnlyAvailable
                          ? "bg-emerald-600 border-emerald-600"
                          : "bg-white/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800"
                      )}
                      aria-label="Toggle availability filter"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                          storeOnlyAvailable ? "left-6" : "left-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm pb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Productos</h3>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{storeFiltered.length} resultados</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {storeFiltered.map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 dark:text-white truncate">{p.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">{p.category}</div>
                          <div className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-3">{formatCurrencyMXN(p.price)}</div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <div
                            className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border",
                              p.available
                                ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-500/10"
                                : "border-slate-200 text-slate-500 bg-white dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950/30"
                            )}
                          >
                            {p.available ? "Activo" : "Inactivo"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <button
                          onClick={() => storeOpenEdit(p.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest"
                        >
                          <Pencil className="w-4 h-4" /> Editar
                        </button>
                        <button
                          onClick={() => storeDelete(p.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/60 dark:bg-rose-500/10 text-rose-700 dark:text-rose-200 text-xs font-black uppercase tracking-widest"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {storeEditorOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={storeCloseEditor} />
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Tienda</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{storeEditingId ? "Editar producto" : "Nuevo producto"}</div>
                        </div>
                        <button onClick={storeCloseEditor} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Nombre</div>
                          <input
                            value={storeForm.name}
                            onChange={(e) => setStoreForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Ej. Taco al pastor"
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Categoria</div>
                          <select
                            value={storeForm.category}
                            onChange={(e) => setStoreForm((f) => ({ ...f, category: e.target.value as typeof storeForm.category }))}
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          >
                            {storeCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Precio (MXN)</div>
                          <input
                            inputMode="numeric"
                            value={storeForm.price}
                            onChange={(e) => setStoreForm((f) => ({ ...f, price: Number(e.target.value || 0) }))}
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Estado</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{storeForm.available ? "Disponible" : "No disponible"}</div>
                          </div>
                          <button
                            onClick={() => setStoreForm((f) => ({ ...f, available: !f.available }))}
                            className={cn("w-12 h-7 rounded-full border transition-all relative", storeForm.available ? "bg-emerald-600 border-emerald-600" : "bg-white/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800")}
                            aria-label="Toggle availability"
                          >
                            <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm", storeForm.available ? "left-6" : "left-1")} />
                          </button>
                        </div>
                        <div className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Imagen URL</div>
                          <input
                            value={storeForm.imageUrl}
                            onChange={(e) => setStoreForm((f) => ({ ...f, imageUrl: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={storeCloseEditor}
                          className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={storeSave}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                        >
                          Guardar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab === "inventory" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Box className="w-3.5 h-3.5" /> {t.dashboard.inventory}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.inventory}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Stock, alertas, movimientos y ajustes.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button
                    onClick={() => setInvOnlyCritical((v) => !v)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm transition-all",
                      invOnlyCritical
                        ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-200"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                    )}
                  >
                    <AlertTriangle className="w-4 h-4" /> Criticos
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Existencias</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Busqueda por nombre o SKU</p>
                    </div>
                    <div className="w-full md:w-[360px]">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <PackageSearch className="w-4 h-4 text-slate-400" />
                        <input
                          value={invQuery}
                          onChange={(e) => setInvQuery(e.target.value)}
                          placeholder="Buscar inventario..."
                          className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {invFiltered.map((it) => {
                      const critical = it.onHand <= it.min;
                      return (
                        <div
                          key={it.id}
                          className={cn(
                            "p-4 rounded-2xl border transition-all",
                            critical
                              ? "border-rose-200 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/5"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30"
                          )}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-black text-slate-900 dark:text-white truncate">{it.name}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                  {it.sku}
                                </div>
                                {critical && (
                                  <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-200 bg-rose-50 dark:bg-rose-500/10">
                                    Bajo
                                  </div>
                                )}
                              </div>
                              <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                                Stock: <span className="font-black text-slate-900 dark:text-white">{it.onHand}</span> {it.unit} · Minimo:{" "}
                                <span className="font-black">{it.min}</span> {it.unit}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => invOpen(it.id, "in")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest">
                                <PlusCircle className="w-4 h-4" /> Entrada
                              </button>
                              <button onClick={() => invOpen(it.id, "out")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest">
                                <MinusCircle className="w-4 h-4" /> Salida
                              </button>
                              <button onClick={() => invOpen(it.id, "adjust")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest">
                                <Pencil className="w-4 h-4" /> Ajuste
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Alertas</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Stock bajo</div>
                  </div>

                  <div className="space-y-3">
                    {invCritical.length === 0 && (
                      <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                        Sin alertas por ahora.
                      </div>
                    )}
                    {invCritical.map((it) => (
                      <div key={it.id} className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{it.name}</div>
                        <div className="text-[12px] text-slate-600 dark:text-slate-300 mt-1">
                          {it.onHand} {it.unit} disponible · Minimo {it.min} {it.unit}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                      <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Movimientos recientes
                    </div>
                    <div className="mt-4 space-y-3">
                      {invMovements.slice(0, 5).map((m) => {
                        const it = invItems.find((x) => x.id === m.itemId);
                        const label = m.type === "in" ? "Entrada" : m.type === "out" ? "Salida" : "Ajuste";
                        return (
                          <div key={m.id} className="flex items-start justify-between gap-3 text-[12px]">
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 dark:text-white truncate">{it?.name ?? m.itemId}</div>
                              <div className="text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {label} · {new Date(m.ts).toLocaleString()} · {m.note}
                              </div>
                            </div>
                            <div className={cn("shrink-0 font-black", m.type === "in" ? "text-emerald-700 dark:text-emerald-300" : m.type === "out" ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-200")}>
                              {m.type === "in" ? "+" : ""}
                              {m.qty}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {invEditorOpen && invSelected && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={invClose} />
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Inventario</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{invSelected.name}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                            SKU {invSelected.sku} · Stock actual: <span className="font-black">{invSelected.onHand}</span> {invSelected.unit}
                          </div>
                        </div>
                        <button onClick={invClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Tipo</div>
                          <select
                            value={invMoveType}
                            onChange={(e) => setInvMoveType(e.target.value as typeof invMoveType)}
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          >
                            <option value="in">Entrada</option>
                            <option value="out">Salida</option>
                            <option value="adjust">Ajuste</option>
                          </select>
                        </div>
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
                            Cantidad ({invSelected.unit}) {invMoveType === "adjust" ? "(puede ser negativa)" : ""}
                          </div>
                          <input
                            inputMode="numeric"
                            value={invMoveQty}
                            onChange={(e) => setInvMoveQty(Number(e.target.value || 0))}
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="md:col-span-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Nota</div>
                          <input
                            value={invMoveNote}
                            onChange={(e) => setInvMoveNote(e.target.value)}
                            placeholder="Ej. Recepcion proveedor, merma, ajuste por conteo..."
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button onClick={invClose} className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                          Cancelar
                        </button>
                        <button onClick={invCommit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                          Guardar movimiento
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab === "suppliers" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Truck className="w-3.5 h-3.5" /> {t.dashboard.suppliers}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.suppliers}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Contactos, historial y tiempos de entrega.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button
                    onClick={supOpenCreate}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Nuevo proveedor
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Proveedores</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{supFiltered.length}</div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <PackageSearch className="w-4 h-4 text-slate-400" />
                      <input
                        value={supQuery}
                        onChange={(e) => setSupQuery(e.target.value)}
                        placeholder="Buscar proveedor..."
                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {supFiltered.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSupSelectedId(s.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border transition-all",
                          (supSelected?.id ?? "") === s.id
                            ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-sm font-black text-slate-900 dark:text-white truncate">{s.name}</div>
                            <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                              Contacto: <span className="font-bold">{s.contact || "—"}</span>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Lead</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{s.leadDays}d</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  {!supSelected ? (
                    <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      Selecciona un proveedor.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="min-w-0">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Proveedor</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white truncate mt-1">{supSelected.name}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
                            Lead time estimado: <span className="font-black text-slate-900 dark:text-white">{supSelected.leadDays}</span> dias · Calificacion:{" "}
                            <span className="font-black text-slate-900 dark:text-white">{supSelected.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex gap-2">
                          <button
                            onClick={() => supOpenEdit(supSelected.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest"
                          >
                            <Pencil className="w-4 h-4" /> Editar
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest"
                            onClick={() => {
                              setActiveTab("inventory");
                            }}
                          >
                            <Box className="w-4 h-4" /> Ir a inventario
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Contacto
                          </div>
                          <div className="text-sm font-black text-slate-900 dark:text-white mt-3">{supSelected.contact || "—"}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Responsable de ventas</div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                            <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Telefono
                          </div>
                          <div className="text-sm font-black text-slate-900 dark:text-white mt-3">{supSelected.phone || "—"}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Contacto directo</div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Email
                          </div>
                          <div className="text-sm font-black text-slate-900 dark:text-white mt-3 truncate">{supSelected.email || "—"}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Pedidos y facturas</div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Historial</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Mock</div>
                          </div>
                          <div className="mt-4 space-y-3">
                            {[
                              { label: "Ultima compra", value: supSelected.lastPurchaseAt ? new Date(supSelected.lastPurchaseAt).toLocaleString() : "—" },
                              { label: "Tiempo de entrega", value: `${supSelected.leadDays} dias` },
                              { label: "Estado", value: "Activo" },
                            ].map((x) => (
                              <div key={x.label} className="flex items-center justify-between text-sm">
                                <div className="text-slate-500 dark:text-slate-400 font-bold">{x.label}</div>
                                <div className="text-slate-900 dark:text-white font-black">{x.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Ordenes de compra</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Siguiente</div>
                          </div>
                          <div className="mt-4 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Aqui vamos a crear OC, registrar recepcion y medir cumplimiento de tiempos. Por ahora dejamos la ficha y el historial.
                          </div>
                          <div className="mt-5 flex gap-3">
                            <button className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                              Nueva OC
                            </button>
                            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                              Registrar recepcion
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Notas</div>
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold mt-2 whitespace-pre-wrap">
                          {supSelected.notes || "—"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {supEditorOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={supClose} />
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Proveedor</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{supEditingId ? "Editar proveedor" : "Nuevo proveedor"}</div>
                        </div>
                        <button onClick={supClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 md:col-span-2">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Nombre</div>
                          <input
                            value={supForm.name}
                            onChange={(e) => setSupForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Nombre del proveedor"
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Contacto</div>
                          <input
                            value={supForm.contact}
                            onChange={(e) => setSupForm((f) => ({ ...f, contact: e.target.value }))}
                            placeholder="Persona"
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>

                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Lead time (dias)</div>
                          <input
                            inputMode="numeric"
                            value={supForm.leadDays}
                            onChange={(e) => setSupForm((f) => ({ ...f, leadDays: Number(e.target.value || 0) }))}
                            className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Telefono</div>
                          <input
                            value={supForm.phone}
                            onChange={(e) => setSupForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="+52 ..."
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>

                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Email</div>
                          <input
                            value={supForm.email}
                            onChange={(e) => setSupForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="ventas@..."
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>

                        <div className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Notas</div>
                          <input
                            value={supForm.notes}
                            onChange={(e) => setSupForm((f) => ({ ...f, notes: e.target.value }))}
                            placeholder="Condiciones, dias de entrega, etc."
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button onClick={supClose} className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                          Cancelar
                        </button>
                        <button onClick={supSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                          Guardar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab === "charts" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <LineChart className="w-3.5 h-3.5" /> {t.dashboard.charts}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.charts}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Ventas, tickets y productos mas vendidos.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm">
                    <CalendarRange className="w-4 h-4 text-slate-400" />
                    <select
                      value={chartsRange}
                      onChange={(e) => setChartsRange(e.target.value as typeof chartsRange)}
                      className="bg-transparent outline-none text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200"
                    >
                      <option value="7d">7 dias</option>
                      <option value="30d">30 dias</option>
                      <option value="90d">90 dias</option>
                    </select>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Ventas y tickets</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">MXN</div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={chartsSales} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                        <Tooltip
                          contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }}
                          formatter={(v: unknown, n: unknown) => {
                            if (n === "sales") return [formatCurrencyMXN(Number(v)), "Ventas"];
                            return [Number(v), "Tickets"];
                          }}
                        />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="sales" name="Ventas" stroke="#10b981" strokeWidth={3} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="tickets" name="Tickets" stroke="#3b82f6" strokeWidth={3} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Top productos</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Unidades</div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartsTopProducts} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgba(100,116,139,0.6)" interval={0} angle={-30} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                        <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} />
                        <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                          {chartsTopProducts.map((_, idx) => (
                            <Cell key={idx} fill={idx === 0 ? "#10b981" : idx === 1 ? "#3b82f6" : idx === 2 ? "#f59e0b" : "#94a3b8"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "trends" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <TrendingUp className="w-3.5 h-3.5" /> {t.dashboard.trends}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.trends}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Patrones, insights y oportunidades.</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Insights</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Auto</div>
                  </div>
                  <div className="space-y-3">
                    {trendsInsights.map((x, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{x.title}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{x.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Acciones</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Siguiente</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Ajustar produccion", desc: "Sube la produccion en el pico (6-9 PM) y reduce merma." },
                      { title: "Bundles", desc: "Bundle Taco + Horchata para subir ticket promedio." },
                      { title: "Reorden automatico", desc: "Activa reorden para cilantro/cebolla con stock critico." },
                    ].map((a, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{a.title}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">{a.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "reports" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Download className="w-3.5 h-3.5" /> {t.dashboard.reports}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.reports}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Genera reportes y exporta.</p>
                </motion.div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Tipo</div>
                    <select value={reportsType} onChange={(e) => setReportsType(e.target.value as typeof reportsType)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
                      <option value="sales">Ventas</option>
                      <option value="inventory">Inventario</option>
                      <option value="finance">Financiero</option>
                    </select>
                  </div>
                  <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Rango</div>
                    <select value={reportsRange} onChange={(e) => setReportsRange(e.target.value as typeof reportsRange)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
                      <option value="today">Hoy</option>
                      <option value="7d">7 dias</option>
                      <option value="30d">30 dias</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      <Download className="w-4 h-4" /> Generar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                      Exportar PDF
                    </button>
                  </div>
                </div>

                {reportsRange === "custom" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Desde</div>
                      <input type="date" value={reportsFrom} onChange={(e) => setReportsFrom(e.target.value)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Hasta</div>
                      <input type="date" value={reportsTo} onChange={(e) => setReportsTo(e.target.value)} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                      <CalendarRange className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Rango personalizado
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Vista previa</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Mock</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Ingresos</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatCurrencyMXN(81240)}</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Tickets</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">885</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Merma</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatCurrencyMXN(1240)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Plantillas</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Auto</div>
                  </div>
                  <div className="space-y-3">
                    {["Corte diario", "Semanal ejecutivo", "Inventario critico", "Ventas por producto"].map((x) => (
                      <button key={x} className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/50 transition-all">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{x}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Genera con un click.</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "prediction" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Brain className="w-3.5 h-3.5" /> {t.dashboard.prediction}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.prediction}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Demanda por hora y recomendaciones de stock.</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Prediccion hoy</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Tickets estimados por hora</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Escenario</div>
                        <select value={predictionScenario} onChange={(e) => setPredictionScenario(e.target.value as typeof predictionScenario)} className="bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white w-full">
                          <option value="baseline">Base</option>
                          <option value="promo">Promocion</option>
                          <option value="rain">Lluvia</option>
                        </select>
                      </div>
                      {predictionScenario === "promo" && (
                        <div className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Lift</div>
                          <input type="range" min={0} max={40} value={predictionLift} onChange={(e) => setPredictionLift(Number(e.target.value))} className="w-40" />
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{predictionLift}%</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prediction} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                        <YAxis tick={{ fontSize: 12 }} stroke="rgba(100,116,139,0.6)" />
                        <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.25)" }} />
                        <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fill="url(#predFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Recomendaciones</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">IA</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Sube produccion", desc: "Aumenta tacos y refrescos para 6-9 PM." },
                      { title: "Reorden", desc: "Tortilla 12cm: compra sugerida para 2 dias." },
                      { title: "Merma", desc: "Revisar cilantro/cebolla antes del cierre." },
                    ].map((r, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{r.title}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                      Simular
                    </button>
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "staff" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Users className="w-3.5 h-3.5" /> {t.dashboard.staff}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.staff}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg">Roles, estado y ultima actividad.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                  <button onClick={staffOpenCreate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    <Plus className="w-4 h-4" /> Nuevo usuario
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Equipo</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Busqueda y roles</p>
                    </div>
                    <div className="w-full md:w-[360px]">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <PackageSearch className="w-4 h-4 text-slate-400" />
                        <input value={staffQuery} onChange={(e) => setStaffQuery(e.target.value)} placeholder="Buscar por nombre o rol..." className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {staffFiltered.map((u) => (
                      <div key={u.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                            Rol: <span className="font-bold">{u.role}</span> · Ultima actividad:{" "}
                            <span className="font-bold">{new Date(u.lastActiveAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border", u.active ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-500/10" : "border-slate-200 text-slate-500 bg-white dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950/30")}>
                            {u.active ? "Activo" : "Inactivo"}
                          </div>
                          <button onClick={() => staffOpenEdit(u.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 text-xs font-black uppercase tracking-widest">
                            <Pencil className="w-4 h-4" /> Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Permisos</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Roles</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { role: "Admin", desc: "Acceso total, usuarios y configuracion." },
                      { role: "Gerente", desc: "Reportes, inventario, proveedores, ajustes." },
                      { role: "Cajero", desc: "POS y registro de ventas." },
                      { role: "Cocina", desc: "Produccion y consumos (siguiente)." },
                    ].map((r) => (
                      <div key={r.role} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{r.role}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {staffEditorOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={staffClose} />
                    <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute right-4 left-4 md:left-auto md:right-10 top-24 md:top-28 md:w-[560px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Personal</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{staffEditingId ? "Editar usuario" : "Nuevo usuario"}</div>
                        </div>
                        <button onClick={staffClose} className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Nombre</div>
                          <input value={staffForm.name} onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nombre" className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Rol</div>
                          <select value={staffForm.role} onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value as typeof staffForm.role }))} className="w-full bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white">
                            <option value="Admin">Admin</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Cajero">Cajero</option>
                            <option value="Cocina">Cocina</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Estado</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{staffForm.active ? "Activo" : "Inactivo"}</div>
                          </div>
                          <button onClick={() => setStaffForm((f) => ({ ...f, active: !f.active }))} className={cn("w-12 h-7 rounded-full border transition-all relative", staffForm.active ? "bg-emerald-600 border-emerald-600" : "bg-white/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800")} aria-label="Toggle active">
                            <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm", staffForm.active ? "left-6" : "left-1")} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button onClick={staffClose} className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                          Cancelar
                        </button>
                        <button onClick={staffSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                          Guardar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab !== "home" &&
            activeTab !== "pos" &&
            activeTab !== "sales" &&
            activeTab !== "store" &&
            activeTab !== "inventory" &&
            activeTab !== "suppliers" &&
            activeTab !== "charts" &&
            activeTab !== "trends" &&
            activeTab !== "reports" &&
            activeTab !== "prediction" &&
            activeTab !== "staff" && (
            <TabPlaceholder title={activeTitle} />
          )}
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
