const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatINR(value) {
  const amount = Number(value);
  return currencyFormatter.format(Number.isFinite(amount) ? Math.round(amount) : 0);
}

export function formatCount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '0';
  if (amount < 1000) return String(amount);
  return compactFormatter.format(amount).toLowerCase();
}

export function roundToNearest(value, nearest = 10) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount / nearest) * nearest;
}
