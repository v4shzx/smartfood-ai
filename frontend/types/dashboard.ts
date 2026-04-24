export type SubscriptionTier = "basico" | "pro" | "enterprise";

export type SidebarTab =
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
  | "account";

export interface Category {
  id: string;
  name: string;
  owner_id: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
  min_stock?: number;
}

export interface Product extends MenuItem {
  on_hand: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  active: boolean;
  owner_id?: string;
}

export interface SaleItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  user_id: string;
  ts: string;
  total: number;
  method: string;
  items_detail: SaleItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  on_hand: number;
  min_stock: number;
  unit: string;
  updated_at: string | number;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: "in" | "out" | "adjust";
  qty: number;
  ts: number;
  note: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  leadDays: number;
  notes: string;
  rating?: number;
}

export interface DashboardStats {
  todayRevenue: number;
  yesterdayRevenue: number;
  weekRevenue: number;
  topProduct: string;
  topProductQty: number;
  totalOrdersAbs: number;
  totalOrdersToday: number;
  criticalInventory: {
    items: number;
    sku: string;
    remaining: number;
  };
}

export interface TrendInsight {
  key: string;
  params: Record<string, any>;
  category: "growth" | "warning" | "opportunity";
}

export interface PredictionData {
  fecha: string;
  ventas: number;
}

export interface ReportStats {
  revenue: number;
  tickets: number;
  merma: number;
}
