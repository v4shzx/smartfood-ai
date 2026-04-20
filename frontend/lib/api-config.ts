export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Asegurar que no termine en /
export const BASE_URL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

export const ENDPOINTS = {
  auth: `${BASE_URL}/auth`,
  products: `${BASE_URL}/products`,
  inventory: `${BASE_URL}/inventory`,
  sales: `${BASE_URL}/sales`,
  stats: `${BASE_URL}/stats`,
  staff: `${BASE_URL}/staff`,
  suppliers: `${BASE_URL}/suppliers`,
  cafeteria: `${BASE_URL}/cafeteria`,
  categories: `${BASE_URL}/categories`,
  admin: `${BASE_URL}/admin`,
  contact: `${BASE_URL}/contact/`,
};
