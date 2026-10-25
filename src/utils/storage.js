export const STORAGE_KEYS = {
  state: 'ecaspian.state.v1',
  catalog: 'ecaspian.catalog.v1',
  recent: 'ecaspian.recent.v1',
  searches: 'ecaspian.searches.v1',
  newsletter: 'ecaspian.newsletter.v1',
  orders: 'ecaspian.orders.v1',
  address: 'ecaspian.address.v1',
  pincode: 'ecaspian.pincode.v1',
};

export function hasStorage() {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function readJSON(key, fallback = null) {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readString(key, fallback = '') {
  if (!hasStorage()) return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key, value) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
