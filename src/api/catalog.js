import fallbackSnapshot from '@/data/fakeStoreSnapshot.json';
import { normalizeCatalog } from '@/utils/normalizeProduct';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/utils/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';
const CACHE_TTL = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT = 12000;

function readCache() {
  const cached = readJSON(STORAGE_KEYS.catalog, null);
  if (
    !cached ||
    !Array.isArray(cached.products) ||
    !Array.isArray(cached.categories) ||
    typeof cached.savedAt !== 'number'
  ) {
    return null;
  }
  return cached;
}

function writeCache(products, categories) {
  writeJSON(STORAGE_KEYS.catalog, {
    savedAt: Date.now(),
    products,
    categories,
  });
}

async function request(path, signal) {
  const response = await fetch(`${API_BASE}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`The catalogue service responded with ${response.status}.`);
  }
  return response.json();
}

function present(raw, source, fetchedAt, warning = null) {
  const normalized = normalizeCatalog(raw);
  if (!normalized.products.length) {
    throw new Error('The catalogue came back empty.');
  }
  return {
    ...normalized,
    source,
    fetchedAt,
    warning,
  };
}

export async function fetchCatalog({ force = false } = {}) {
  const cached = readCache();
  if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL) {
    return present(cached, 'cache', cached.savedAt);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const [products, categories] = await Promise.all([
      request('/products', controller.signal),
      request('/products/categories', controller.signal),
    ]);

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('The catalogue came back empty.');
    }

    writeCache(products, Array.isArray(categories) ? categories : []);
    return present(
      { products, categories: Array.isArray(categories) ? categories : [] },
      'network',
      Date.now(),
    );
  } catch (error) {
    console.warn('Ecaspian catalogue fetch failed:', error?.message ?? error);

    if (cached) {
      return present(
        cached,
        'cache',
        cached.savedAt,
        'We could not reach the catalogue just now, so you are browsing a saved edit.',
      );
    }

    return present(
      fallbackSnapshot,
      'fallback',
      null,
      'You are browsing a saved edit of the collection while we reconnect to the catalogue.',
    );
  } finally {
    clearTimeout(timeout);
  }
}
