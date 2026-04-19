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

  const [predictionScenario, setPredictionScenario] = useState<
    "baseline" | "promo" | "rain" | "event" | "heatwave" | "monthend"
  >("baseline");
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
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [invItems, setInvItems] = useState<any[]>([]);
  const [invMovements, setInvMovements] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [salesSeries, setSalesSeries] = useState<any[]>([]);
  const [trendsInsights, setTrendsInsights] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any[]>([]);
  const [basePrediction, setBasePrediction] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [lastSaleForTicket, setLastSaleForTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
        const tier = localStorage.getItem("smartfood_subscription_tier") || "basico";
        setSubscriptionTier(tier.toLowerCase());

        const fetchJson = (url: string) => fetch(url).then(r => r.ok ? r.json() : []);
        const fetchSingleJson = (url: string) => fetch(url).then(r => r.ok ? r.json() : null);

        const [menuRes, plansRes, statsRes, staffRes, productsRes, salesRes, invRes, movRes, supRes, seriesRes, trendsRes, predRes, catRes] = await Promise.all([
          fetchJson(`${API_URL}/cafeteria/menu?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/cafeteria/plans?owner_id=${sessionUserId}`),
          fetchSingleJson(`${API_URL}/stats/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/staff/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/products/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/sales/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/inventory/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/inventory/movements?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/suppliers/?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/stats/sales-series?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/stats/trends?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/stats/prediction?owner_id=${sessionUserId}`),
          fetchJson(`${API_URL}/categories/?owner_id=${sessionUserId}`)
        ]);

        setMenuItems(menuRes);
        setMealPlans(plansRes);
        setStats(statsRes);
        setStaff(staffRes);
        setProducts(productsRes);
        setCategories(catRes);
        setSalesHistory(salesRes);
        setInvItems(invRes);
        setInvMovements(movRes);
        setSuppliers(supRes);
        setSalesSeries(seriesRes);
        setTrendsInsights(trendsRes);
        setPrediction(predRes);
        setBasePrediction(predRes);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [API_URL]);
  
  // Computed Values
  const storeCategories = useMemo(() => {
    const fromProducts = Array.from(new Set(products.map((p) => p.category)));
    const fromDB = categories.map(c => c.name);
    return Array.from(new Set([...fromProducts, ...fromDB]));
  }, [products, categories]);

  const storeFiltered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(storeQuery.toLowerCase()) || p.category?.toLowerCase().includes(storeQuery.toLowerCase());
      const matchCat = storeCategory === "all" || p.category?.toLowerCase() === storeCategory.toLowerCase();
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

  const staffFiltered = useMemo(() => {
    return staff.filter((u) => u.name.toLowerCase().includes(staffQuery.toLowerCase()) || u.role.toLowerCase().includes(staffQuery.toLowerCase()));
  }, [staff, staffQuery]);

  const salesFiltered = useMemo(() => {
    return salesHistory.filter((s) => {
      const matchQuery = s.id.toLowerCase().includes(salesQuery.toLowerCase());
      const matchMethod = salesMethod === "all" || s.method?.toLowerCase() === salesMethod.toLowerCase();
      let matchDate = true;
      if (salesDateFrom || salesDateTo) {
        const saleDate = new Date(s.ts).toISOString().split('T')[0];
        if (salesDateFrom && saleDate < salesDateFrom) matchDate = false;
        if (salesDateTo && saleDate > salesDateTo) matchDate = false;
      }
      return matchQuery && matchMethod && matchDate;
    });
  }, [salesHistory, salesQuery, salesMethod, salesDateFrom, salesDateTo]);

  const posFilteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(posQuery.toLowerCase());
      return matchQuery && p.available;
    });
  }, [products, posQuery]);

  const posCartLines = useMemo(() => {
    return posCart.map((item, idx) => ({
      ...item,
      qty: item.quantity,
      lineKey: `${item.id}-${idx}`
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

  // Store Real API Actions
  const storeOpenCreate = () => {
    setStoreEditingId(null);
    setStoreForm({ name: "", category: storeCategories[0] || "General", price: 0, available: true });
    setStoreEditorOpen(true);
  };

  const storeOpenEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setStoreEditingId(id);
    setStoreForm({ name: p.name, category: p.category, price: p.price, available: p.available });
    setStoreEditorOpen(true);
  };

  const storeSave = async () => {
    try {
      const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
      const productData = { ...storeForm, owner_id: sessionUserId };

      if (storeEditingId) {
        const res = await fetch(`${API_URL}/products/${storeEditingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          const updatedProd = await res.json();
          setProducts((prev) => prev.map((p) => (p.id === storeEditingId ? updatedProd : p)));
        }
      } else {
        const res = await fetch(`${API_URL}/products/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          const newProd = await res.json();
          setProducts((prev) => [...prev, newProd]);
        }
      }
      setStoreEditorOpen(false);
    } catch (error) {
      console.error("Product save error:", error);
    }
  };

  const storeDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Product delete error:", error);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
      const res = await fetch(`${API_URL}/categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, owner_id: sessionUserId })
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories(prev => [...prev, newCat]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Create category error:", error);
      return false;
    }
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

  // Staff Edits
  const staffOpenCreate = () => {
    setStaffEditingId(null);
    setStaffForm({ name: "", role: "Cajero", active: true });
    setStaffEditorOpen(true);
  };

  const staffOpenEdit = (id: string) => {
    const s = staff.find((x) => x.id === id);
    if (!s) return;
    setStaffEditingId(id);
    setStaffForm({ name: s.name, role: s.role, active: s.active });
    setStaffEditorOpen(true);
  };

  const staffSave = async () => {
    try {
      const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
      const staffData = { ...staffForm, owner_id: sessionUserId };

      if (staffEditingId) {
        // Since backend update is missing, we update local state but keep it consistent with UI expectations
        setStaff((prev) => prev.map((u) => (u.id === staffEditingId ? { ...u, ...staffForm } : u)));
      } else {
        setStaff((prev) => [...prev, { id: Math.random().toString(36), ...staffForm, lastActiveAt: Date.now() }]);
      }
      setStaffEditorOpen(false);
    } catch (error) {
      console.error("Staff save error:", error);
    }
  };

  const staffDelete = async (id: string) => {
    if (!confirm("¿Eliminar este miembro del personal?")) return;
    setStaff((prev) => prev.filter((s) => s.id !== id));
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
    setSupForm({
      name: s.name,
      contact: s.contact,
      phone: s.phone,
      email: s.email,
      leadDays: s.leadDays,
      notes: s.notes,
    });
    setSupEditorOpen(true);
  };

  const supSave = async () => {
    try {
      const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
      const supplierData = { ...supForm, owner_id: sessionUserId };

      if (supEditingId) {
        const res = await fetch(`${API_URL}/suppliers/${supEditingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData),
        });
        if (res.ok) {
          const updated = await res.json();
          setSuppliers((prev) => prev.map((s) => (s.id === supEditingId ? updated : s)));
        } else {
          // Fallback if patch fails
          setSuppliers((prev) => prev.map((s) => (s.id === supEditingId ? { ...s, ...supForm } : s)));
        }
      } else {
        const res = await fetch(`${API_URL}/suppliers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData),
        });
        if (res.ok) {
          const newSup = await res.json();
          setSuppliers((prev) => [...prev, newSup]);
        } else {
          // Fallback
          setSuppliers((prev) => [...prev, { id: Math.random().toString(36), ...supForm, rating: 5.0 }]);
        }
      }
      setSupEditorOpen(false);
    } catch (error) {
      console.error("Supplier save error:", error);
    }
  };

  const handleSimulate = () => {
    let factor = 1;
    if (predictionScenario === "promo") factor += (predictionLift / 100);
    if (predictionScenario === "rain") factor -= 0.20;
    if (predictionScenario === "event") factor += 0.50;
    if (predictionScenario === "heatwave") factor += 0.15;
    if (predictionScenario === "monthend") factor -= 0.15;
    const simulated = basePrediction.map(p => ({ ...p, ventas: Math.round(p.ventas * factor) }));
    setPrediction(simulated);
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

  const kpis = useMemo(() => ({
    todayRevenue: stats?.todayRevenue || 0,
    yesterdayRevenue: stats?.yesterdayRevenue || 0,
    weekRevenue: stats?.weekRevenue || 0,
    topStudent: stats?.topProduct || "N/A",
    topProductQty: stats?.topProductQty || 0,
    activeStudents: stats?.totalOrdersAbs || 0,
    todayOrders: stats?.totalOrdersToday || 0,
    menuItemsCount: menuItems.length,
    criticalInventory: { 
      items: stats?.criticalInventory?.items || 0, 
      sku: stats?.criticalInventory?.sku || "N/A", 
      remaining: stats?.criticalInventory?.remaining || 0 
    }
  }), [stats, menuItems]);

  return {
    activeTab, setActiveTab,
    storeQuery, setStoreQuery,
    storeCategory, setStoreCategory,
    storeCategories,
    storeOnlyAvailable, setStoreOnlyAvailable,
    storeFiltered,
    storeOpenCreate, storeOpenEdit, storeDelete,
    storeEditorOpen, storeEditingId, storeForm, setStoreForm, storeSave, setStoreEditorOpen,
    invQuery, setInvQuery,
    invOnlyCritical, setInvOnlyCritical,
    invFiltered, invCritical,
    invOpen, invCommit, invEditorOpen, setInvEditorOpen,
    invSelectedId, setInvSelectedId,
    invMoveType, setInvMoveType, invMoveQty, setInvMoveQty, invMoveNote, setInvMoveNote,
    invMovements,
    supQuery, setSupQuery,
    supFiltered, supSelected, supSelectedId, setSupSelectedId,
    supOpenCreate, supOpenEdit, supSave, supEditorOpen, setSupEditorOpen,
    supEditingId, supForm, setSupForm,
    predictionScenario, setPredictionScenario, predictionLift, setPredictionLift, prediction,
    staffQuery, setStaffQuery, staffFiltered,
    staffOpenCreate, staffOpenEdit, staffDelete, staffEditorOpen, setStaffEditorOpen,
    staffEditingId, staffForm, setStaffForm, staffSave,
    posCart, setPosCart, posQuery, setPosQuery, posCategory, setPosCategory,
    posDiscount, setPosDiscount, posFilteredProducts, posCartLines, posSubtotal, posTotal,
    posAdd: (id: string) => {
      const p = products.find(x => x.id === id);
      if (p) addToCart(p);
    },
    posDec: (id: string) => updateCartQuantity(id, -1),
    posClear: () => setPosCart([]),
    posCheckout: async (method: "Cash" | "Card") => {
      if (posCart.length === 0) return;
      try {
        const sessionUserId = localStorage.getItem("smartfood_user_id") || "u_demo";
        const saleData = {
          user_id: sessionUserId,
          items: posCart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
          payment_method: method,
          discount: posDiscount
        };
        const res = await fetch(`${API_URL}/sales/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData)
        });
        if (res.ok) {
          const newSale = await res.json();
          setSalesHistory(prev => [newSale, ...prev]);
          setPosCart([]);
          setPosDiscount(0);
          setLastSaleForTicket(newSale);
          const statsRes = await fetch(`${API_URL}/stats/`).then(r => r.json());
          setStats(statsRes);
          setInvItems(prev => prev.map(inv => {
            const soldItem = posCart.find(cartItem => cartItem.id === inv.id);
            return soldItem ? { ...inv, onHand: inv.onHand - soldItem.quantity } : inv;
          }));
        } else {
          alert("Error al procesar la venta");
        }
      } catch (error) {
        console.error("Checkout error:", error);
      }
    },
    salesQuery, setSalesQuery, salesMethod, setSalesMethod,
    salesDateFrom, setSalesDateFrom, salesDateTo, setSalesDateTo,
    salesFiltered, selectedSaleId, setSelectedSaleId,
    salesHistory, trendsInsights, activeTitle, products,
    kpis, salesSeries,
    menuItems, mealPlans, isLoading, subscriptionTier,
    lastSaleForTicket, setLastSaleForTicket,
    handleSimulate, 
    categories, createCategory
  };
}

