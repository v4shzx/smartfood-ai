"use client";

import { useState, useMemo, useEffect } from "react";
import { formatCurrencyMXN } from "@/lib/dashboard-utils";

export function useDashboard(t: any) {
  const [subscriptionTier, setSubscriptionTier] = useState<string>("basico");

  const [activeTab, setActiveTab] = useState<
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
    | "staff"
    | "account"
  >("home");

  // Filter & Search States
  const [storeQuery, setStoreQuery] = useState("");
  const [storeCategory, setStoreCategory] = useState<string>("all");
  const [storeOnlyAvailable, setStoreOnlyAvailable] = useState(false);

  const [invQuery, setInvQuery] = useState("");
  const [invOnlyCritical, setInvOnlyCritical] = useState(false);

  const [supQuery, setSupQuery] = useState("");
  const [supSelectedId, setSupSelectedId] = useState<string | null>(null);

  const [chartsRange, setChartsRange] = useState<"7d" | "30d" | "90d">("30d");

  const [reportsType, setReportsType] = useState<"sales" | "inventory" | "finance">("sales");
  const [reportsRange, setReportsRange] = useState<"today" | "7d" | "30d" | "custom">("today");
  const [reportsFrom, setReportsFrom] = useState("");
  const [reportsTo, setReportsTo] = useState("");

  const [predictionScenario, setPredictionScenario] = useState<"baseline" | "promo" | "rain">("baseline");
  const [predictionLift, setPredictionLift] = useState(15);

  const [staffQuery, setStaffQuery] = useState("");

  // Sales View States
  const [salesQuery, setSalesQuery] = useState("");
  const [salesMethod, setSalesMethod] = useState<"all" | "cash" | "card">("all");
  const [salesDateFrom, setSalesDateFrom] = useState("");
  const [salesDateTo, setSalesDateTo] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  // POS State
  const [posCart, setPosCart] = useState<any[]>([]);
  const [posQuery, setPosQuery] = useState("");
  const [posDiscount, setPosDiscount] = useState(0);
  const [posCategory, setPosCategory] = useState("all");

  // Editor States
  const [storeEditorOpen, setStoreEditorOpen] = useState(false);
  const [storeEditingId, setStoreEditingId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState({
    name: "",
    category: "Tacos" as any,
    price: 0,
    available: true,
    imageUrl: "",
  });

  const [invEditorOpen, setInvEditorOpen] = useState(false);
  const [invSelectedId, setInvSelectedId] = useState<string | null>(null);
  const [invMoveType, setInvMoveType] = useState<"in" | "out" | "adjust">("in");
  const [invMoveQty, setInvMoveQty] = useState(0);
  const [invMoveNote, setInvMoveNote] = useState("");

  const [supEditorOpen, setSupEditorOpen] = useState(false);
  const [supEditingId, setSupEditingId] = useState<string | null>(null);
  const [supForm, setSupForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    leadDays: 3,
    notes: "",
  });

  const [staffEditorOpen, setStaffEditorOpen] = useState(false);
  const [staffEditingId, setStaffEditingId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "Cajero" as any,
    active: true,
  });

  // --- Real Data States ---
  const [students, setStudents] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Read the logged-in user ID from localStorage
        const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
        const tier = localStorage.getItem("smartfood_subscription_tier") || "basico";
        setSubscriptionTier(tier.toLowerCase());
        console.log("Loading dashboard for user:", sessionUserId, "Tier:", tier);

        const [studentsRes, menuRes, plansRes] = await Promise.all([
          fetch(`${API_URL}/cafeteria/students?parent_id=${sessionUserId}`).then(r => r.json()),
          fetch(`${API_URL}/cafeteria/menu`).then(r => r.json()),
          fetch(`${API_URL}/cafeteria/plans`).then(r => r.json())
        ]);

        setStudents(Array.isArray(studentsRes) && studentsRes.length > 0 ? studentsRes : [
          { id: "s1", first_name: "Juan", last_name: "Perez", grade: "5to Primaria" },
          { id: "s2", first_name: "Maria", last_name: "Lopez", grade: "3ro Primaria" }
        ]);
        setMenuItems(Array.isArray(menuRes) && menuRes.length > 0 ? menuRes : [
          { id: "m1", day_of_week: "Lunes", dish_name: "Tacos de Pollo", description: "Tacos con guarnición de arroz y frijoles." },
          { id: "m2", day_of_week: "Martes", dish_name: "Pasta Alfredo", description: "Pasta cremosa con pollo y pan de ajo." },
          { id: "m3", day_of_week: "Miércoles", dish_name: "Ensalada César", description: "Lechuga fresca con pollo a la plancha." }
        ]);
        setMealPlans(Array.isArray(plansRes) && plansRes.length > 0 ? plansRes : [
          { id: "p1", name: "Plan Básico", price_mxn: 0 },
          { id: "p2", name: "Plan Profesional", price_mxn: 299 }
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [API_URL]);
  const [products, setProducts] = useState([
    { id: "p1", name: "Sándwich de jamón y queso", category: "Comida", price: 35, available: true },
    { id: "p2", name: "Jugo natural de naranja", category: "Bebidas", price: 25, available: true },
    { id: "p3", name: "Galletas de avena", category: "Snacks", price: 15, available: true },
    { id: "p4", name: "Yogur con granola", category: "Desayuno", price: 30, available: true },
    { id: "p5", name: "Palomitas de maíz", category: "Snacks", price: 12, available: true },
    { id: "p6", name: "Barra de cereal casera", category: "Snacks", price: 18, available: true },
    { id: "p7", name: "Fruta picada (manzana)", category: "Frutas", price: 10, available: true },
    { id: "p8", name: "Mini pizza de pan pita", category: "Comida", price: 40, available: true },
    { id: "p9", name: "Batido de fresa con leche", category: "Bebidas", price: 28, available: true },
    { id: "p10", name: "Muffin de plátano", category: "Postres", price: 22, available: true },
  ]);

  const [invItems, setInvItems] = useState([
    { id: "i1", name: "Tortilla de Maiz", sku: "ING001", onHand: 50, min: 100, unit: "kg", updatedAt: Date.now() },
    { id: "i2", name: "Carne al Pastor", sku: "ING002", onHand: 12.5, min: 10, unit: "kg", updatedAt: Date.now() },
    { id: "i3", name: "Cebolla Blanca", sku: "ING003", onHand: 5, min: 3, unit: "kg", updatedAt: Date.now() },
    { id: "i4", name: "Cilantro Fresco", sku: "ING004", onHand: 2, min: 5, unit: "manojo", updatedAt: Date.now() },
  ]);

  const [invMovements, setInvMovements] = useState([
    { id: "m1", itemId: "i1", type: "out", qty: 25, ts: Date.now() - 3600000, note: "Ventas turno mañana" },
    { id: "m2", itemId: "i2", type: "in", qty: 20, ts: Date.now() - 7200000, note: "Recepcion proveedor" },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: "s1", name: "Carnicos Express", contact: "Juan Perez", phone: "555-0123", email: "ventas@carnicosexp.com", leadDays: 1, rating: 4.8, notes: "Excelente calidad, entrega antes de las 9 AM.", lastPurchaseAt: Date.now() - 86400000 * 2 },
    { id: "s2", name: "Tortilleria La Abuela", contact: "Doña Maria", phone: "555-9876", email: "pedidos@laabuela.mx", leadDays: 0, rating: 5.0, notes: "Tortilla recien hecha, pedido diario.", lastPurchaseAt: Date.now() - 3600000 * 5 },
    { id: "s3", name: "Salsas & Mas", contact: "Luis Garcia", phone: "555-5555", email: "lgarcia@salsasymas.com", leadDays: 3, rating: 4.2, notes: "Gran variedad de chiles secos.", lastPurchaseAt: null },
  ]);

  const [staff, setStaff] = useState([
    { id: "u1", name: "Admin User", role: "Admin", active: true, lastActiveAt: Date.now() - 600000 },
    { id: "u2", name: "Pedro Gomez", role: "Cajero", active: true, lastActiveAt: Date.now() - 3600000 },
    { id: "u3", name: "Chef Rodrigo", role: "Cocina", active: true, lastActiveAt: Date.now() - 7200000 },
    { id: "u4", name: "Maria Luna", role: "Gerente", active: false, lastActiveAt: Date.now() - 86400000 },
  ]);

  const salesHistory = useMemo(() => [
    { id: "tk-882", ts: Date.now() - 300000, total: 125, items: 3, type: "Card" },
    { id: "tk-881", ts: Date.now() - 1500000, total: 45, items: 1, type: "Cash" },
    { id: "tk-880", ts: Date.now() - 3600000, total: 210, items: 6, type: "Cash" },
    { id: "tk-879", ts: Date.now() - 86400000, total: 1540, items: 42, type: "Mixed" },
    { id: "tk-878", ts: Date.now() - 172800000, total: 1890, items: 51, type: "Mixed" },
    { id: "tk-877", ts: Date.now() - 259200000, total: 1250, items: 34, type: "Mixed" },
  ], []);

  const trendsInsights = useMemo(() => [
    { title: "Pico de demanda", desc: "Los viernes entre 8 PM y 11 PM las ventas suben 45%." },
    { title: "Producto Estrella", desc: "El Taco al Pastor representa el 38% de tus ingresos totales." },
    { title: "Oportunidad Merma", desc: "Se detecto un 12% de exceso en compra de Cilantro los martes." },
  ], []);

  // Computed Values
  const storeCategories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

  const storeFiltered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(storeQuery.toLowerCase()) || p.category.toLowerCase().includes(storeQuery.toLowerCase());
      const matchCat = storeCategory === "all" || p.category === storeCategory;
      const matchAvail = !storeOnlyAvailable || p.available;
      return matchQuery && matchCat && matchAvail;
    });
  }, [products, storeQuery, storeCategory, storeOnlyAvailable]);

  const invFiltered = useMemo(() => {
    return invItems.filter((it) => {
      const matchQuery = it.name.toLowerCase().includes(invQuery.toLowerCase()) || it.sku.toLowerCase().includes(invQuery.toLowerCase());
      const matchCritical = !invOnlyCritical || it.onHand <= it.min;
      return matchQuery && matchCritical;
    });
  }, [invItems, invQuery, invOnlyCritical]);

  const invCritical = useMemo(() => invItems.filter((it) => it.onHand <= it.min), [invItems]);

  const supFiltered = useMemo(() => {
    return suppliers.filter((s) => s.name.toLowerCase().includes(supQuery.toLowerCase()) || s.contact.toLowerCase().includes(supQuery.toLowerCase()));
  }, [suppliers, supQuery]);

  const supSelected = useMemo(() => suppliers.find((s) => s.id === supSelectedId), [suppliers, supSelectedId]);

  const chartsSales = useMemo(() => {
    const labels = chartsRange === "7d" ? ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"] : chartsRange === "30d" ? ["S1", "S2", "S3", "S4"] : ["Ene", "Feb", "Mar"];
    return labels.map((l) => ({ label: l, sales: Math.floor(Math.random() * 5000) + 2000, tickets: Math.floor(Math.random() * 100) + 40 }));
  }, [chartsRange]);

  const chartsTopProducts = useMemo(() => [
    { name: "Pastor", val: 450 },
    { name: "Bistec", val: 380 },
    { name: "Gringa", val: 290 },
    { name: "Horchata", val: 210 },
    { name: "Coca Cola", val: 180 },
  ], []);

  const prediction = useMemo(() => {
    const list = [];
    const baseVal = predictionScenario === "promo" ? 1.4 : predictionScenario === "rain" ? 0.7 : 1;
    for (let h = 10; h <= 24; h++) {
      const val = Math.floor((Math.sin((h - 15) / 2) + 1.2) * 20 * baseVal * (1 + predictionLift / 100));
      list.push({ hour: `${h}:00`, val });
    }
    return list;
  }, [predictionScenario, predictionLift]);

  const staffFiltered = useMemo(() => {
    return staff.filter((u) => u.name.toLowerCase().includes(staffQuery.toLowerCase()) || u.role.toLowerCase().includes(staffQuery.toLowerCase()));
  }, [staff, staffQuery]);

  const salesFiltered = useMemo(() => {
    return salesHistory.filter((s) => {
      // Basic mock filter
      const matchQuery = s.id.toLowerCase().includes(salesQuery.toLowerCase());
      const matchMethod = salesMethod === "all" || s.type.toLowerCase() === salesMethod.toLowerCase();
      return matchQuery && matchMethod;
    });
  }, [salesHistory, salesQuery, salesMethod]);

  const selectedSale = useMemo(() => {
    if (!selectedSaleId) return null;
    const s = salesHistory.find((x) => x.id === selectedSaleId);
    if (!s) return null;
    // Mocking lines for the detail view
    return {
      ...s,
      method: s.type.toLowerCase() as "cash" | "card",
      cashier: "Admin",
      subtotal: s.total,
      discount: 0,
      lines: [
        { name: "Taco al Pastor", qty: 3, price: 18 },
        { name: "Horchata 500ml", qty: 1, price: 25 },
      ]
    };
  }, [salesHistory, selectedSaleId]);

  const posFilteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(posQuery.toLowerCase());
      return matchQuery && p.available;
    });
  }, [products, posQuery]);

  const posCartLines = useMemo(() => {
    return posCart.map(item => ({
      ...item,
      qty: item.quantity
    }));
  }, [posCart]);

  const posSubtotal = useMemo(() => {
    return posCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [posCart]);

  const posTotal = useMemo(() => {
    return Math.max(0, posSubtotal - posDiscount);
  }, [posSubtotal, posDiscount]);

  // Actions
  const addToCart = (product: any) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setPosCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return newQty === 0 ? null : { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  const cartTotal = posCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Store Edits
  const storeOpenCreate = () => {
    setStoreEditingId(null);
    setStoreForm({ name: "", category: "Tacos", price: 0, available: true, imageUrl: "" });
    setStoreEditorOpen(true);
  };

  const storeOpenEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setStoreEditingId(id);
    setStoreForm({ ...p, imageUrl: "" });
    setStoreEditorOpen(true);
  };

  const storeDelete = (id: string) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const storeSave = () => {
    if (storeEditingId) {
      setProducts((prev) => prev.map((p) => (p.id === storeEditingId ? { ...p, ...storeForm } : p)));
    } else {
      setProducts((prev) => [...prev, { ...storeForm, id: Math.random().toString(36).substring(7) }]);
    }
    setStoreEditorOpen(false);
  };

  // Inventory Edits
  const invOpen = (id: string, type: "in" | "out" | "adjust") => {
    setInvSelectedId(id);
    setInvMoveType(type);
    setInvMoveQty(0);
    setInvMoveNote("");
    setInvEditorOpen(true);
  };

  const invCommit = () => {
    if (!invSelectedId) return;
    const it = invItems.find((x) => x.id === invSelectedId);
    if (!it) return;

    const diff = invMoveType === "in" ? invMoveQty : invMoveType === "out" ? -invMoveQty : invMoveQty;
    setInvItems((prev) => prev.map((x) => (x.id === invSelectedId ? { ...x, onHand: Math.max(0, x.onHand + diff), updatedAt: Date.now() } : x)));

    setInvMovements((prev) => [{ id: Math.random().toString(36), itemId: invSelectedId, type: invMoveType, qty: invMoveQty, ts: Date.now(), note: invMoveNote || it.name }, ...prev]);

    setInvEditorOpen(false);
  };

  // Supplier Edits
  const supOpenCreate = () => {
    setSupEditingId(null);
    setSupForm({ name: "", contact: "", phone: "", email: "", leadDays: 3, notes: "" });
    setSupEditorOpen(true);
  };

  const supOpenEdit = (id: string) => {
    const s = suppliers.find((x) => x.id === id);
    if (!s) return;
    setSupEditingId(id);
    setSupForm({ ...s });
    setSupEditorOpen(true);
  };

  const supSave = () => {
    if (supEditingId) {
      setSuppliers((prev) => prev.map((s) => (s.id === supEditingId ? { ...s, ...supForm } : s)));
    } else {
      setSuppliers((prev) => [...prev, { ...supForm, id: Math.random().toString(36).substring(7), rating: 5.0, lastPurchaseAt: null }]);
    }
    setSupEditorOpen(false);
  };

  // Staff Edits
  const staffOpenCreate = () => {
    setStaffEditingId(null);
    setStaffForm({ name: "", role: "Cajero", active: true });
    setStaffEditorOpen(true);
  };

  const staffOpenEdit = (id: string) => {
    const u = staff.find((x) => x.id === id);
    if (!u) return;
    setStaffEditingId(id);
    setStaffForm({ name: u.name, role: u.role, active: u.active });
    setStaffEditorOpen(true);
  };

  const staffSave = () => {
    if (staffEditingId) {
      setStaff((prev) => prev.map((u) => (u.id === staffEditingId ? { ...u, ...staffForm } : u)));
    } else {
      setStaff((prev) => [...prev, { id: Math.random().toString(36), ...staffForm, lastActiveAt: Date.now() }]);
    }
    setStaffEditorOpen(false);
  };

  const activeTitle = useMemo(() => {
    switch (activeTab) {
      case "home": return t.dashboard.home;
      case "pos": return t.dashboard.pos;
      case "sales": return t.dashboard.sales;
      case "store": return t.dashboard.store;
      case "inventory": return t.dashboard.inventory;
      case "suppliers": return t.dashboard.suppliers;
      case "charts": return t.dashboard.charts;
      case "trends": return t.dashboard.trends;
      case "reports": return t.dashboard.reports;
      case "prediction": return t.dashboard.prediction;
      case "staff": return t.dashboard.staff;
      case "account": return t.dashboard.profile;
      default: return "";
    }
  }, [activeTab, t]);

  const invSelected = useMemo(() => invItems.find(it => it.id === invSelectedId), [invItems, invSelectedId]);

  const kpis = useMemo(() => ({
    todayRevenue: salesHistory.reduce((acc, s) => acc + s.total, 0),
    weekRevenue: salesHistory.reduce((acc, s) => acc + s.total, 0) * 8.2, // Projection
    topStudent: products[0]?.name || "N/A", // Reused property name for Top Product
    activeStudents: salesHistory.length, // Reused property name for Total Orders
    menuItemsCount: menuItems.length,
    criticalInventory: { 
      items: invCritical.length, 
      sku: invCritical[0]?.name || "N/A", 
      remaining: invCritical[0]?.onHand || 0 
    }
  }), [salesHistory, invCritical, students, menuItems, products]);

  const salesSeries = useMemo(() => [
    { label: "Lun", value: 4200 },
    { label: "Mar", value: 3800 },
    { label: "Mie", value: 5100 },
    { label: "Jue", value: 4600 },
    { label: "Vie", value: 6800 },
    { label: "Sab", value: 8200 },
    { label: "Dom", value: 7400 },
  ], []);

  return {
    activeTab, setActiveTab,
    storeQuery, setStoreQuery,
    storeCategory, setStoreCategory,
    storeCategories,
    storeOnlyAvailable, setStoreOnlyAvailable,
    storeFiltered,
    storeOpenCreate, storeOpenEdit, storeDelete,
    storeEditorOpen, storeEditingId, storeForm, setStoreForm, storeSave, setStoreEditorOpen,
    pQuery: invQuery, // Alias if needed or consistent names
    invQuery, setInvQuery,
    invOnlyCritical, setInvOnlyCritical,
    invFiltered, invCritical,
    invOpen, invCommit, invEditorOpen, setInvEditorOpen,
    invSelectedId, setInvSelectedId, invSelected,
    invMoveType, setInvMoveType, invMoveQty, setInvMoveQty, invMoveNote, setInvMoveNote,
    invMovements,
    supQuery, setSupQuery,
    supFiltered, supSelectedId, setSupSelectedId, supSelected,
    supOpenCreate, supOpenEdit, supEditorOpen, setSupEditorOpen,
    supEditingId, supForm, setSupForm, supSave,
    chartsRange, setChartsRange, chartsSales, chartsTopProducts,
    reportsType, setReportsType, reportsRange, setReportsRange,
    reportsFrom, setReportsFrom, reportsTo, setReportsTo,
    predictionScenario, setPredictionScenario, predictionLift, setPredictionLift, prediction,
    staffQuery, setStaffQuery, staffFiltered,
    staffOpenCreate, staffOpenEdit, staffEditorOpen, setStaffEditorOpen,
    staffEditingId, staffForm, setStaffForm, staffSave,
    posCart, setPosCart, posQuery, setPosQuery, posCategory, setPosCategory,
    posDiscount, setPosDiscount, posFilteredProducts, posCartLines, posSubtotal, posTotal,
    posAdd: (id: string) => {
      const p = products.find(x => x.id === id);
      if (p) addToCart(p);
    },
    posDec: (id: string) => updateCartQuantity(id, -1),
    posClear: () => setPosCart([]),
    salesQuery, setSalesQuery, salesMethod, setSalesMethod,
    salesDateFrom, setSalesDateFrom, salesDateTo, setSalesDateTo,
    salesFiltered, selectedSaleId, setSelectedSaleId, selectedSale,
    addToCart, removeFromCart, updateCartQuantity, cartTotal,
    salesHistory, trendsInsights, activeTitle, products,
    kpis, salesSeries,
    students, menuItems, mealPlans, isLoading, subscriptionTier
  };
}
