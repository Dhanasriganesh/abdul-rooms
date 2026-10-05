export function euro(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(number);
}

export function shortDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function availableLabel(iso) {
  if (!iso) return "Date open";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date open";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date <= today) return "Available now";
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);
}

export function referenceFor(id) {
  return `WB-${String(id).replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}`;
}
