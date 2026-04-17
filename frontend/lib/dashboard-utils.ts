export function formatCurrencyMXN(value: number) {
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
}
