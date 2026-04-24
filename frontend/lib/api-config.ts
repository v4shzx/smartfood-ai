const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
let baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

// Si la URL no contiene ya /api/v1, lo agregamos para coincidir con el backend
if (baseUrl && !baseUrl.includes("/api/v1")) {
  baseUrl = `${baseUrl}/api/v1`;
}

export const API_URL = baseUrl;
export const BASE_URL = baseUrl;

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
