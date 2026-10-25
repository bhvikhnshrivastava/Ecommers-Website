const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function addBusinessDays(date, count) {
  const result = new Date(date);
  let added = 0;
  while (added < count) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) added += 1;
  }
  return result;
}

export function getDeliveryEstimate(pincode, method = 'standard') {
  const digits = String(pincode ?? '').replace(/\D/g, '');
  const lastDigit = digits ? Number(digits.slice(-1)) : 0;
  const days = method === 'express' ? 2 : 3 + (lastDigit % 3);
  return addBusinessDays(new Date(), days);
}

export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return dateFormatter.format(date);
}

export function formatShortDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return shortDateFormatter.format(date);
}

export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return dateTimeFormatter.format(date);
}

export function formatDeliveryDate(value) {
  return formatShortDate(value);
}

export function createOrderNumber(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ECP-${year}${month}${day}-${suffix}`;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
