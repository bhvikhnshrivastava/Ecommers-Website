import { setupStore } from '@/app/store';
import { hydrate as hydrateCart } from '@/redux/cartSlice';
import { hydrate as hydrateWishlist } from '@/redux/wishlistSlice';
import { hydrate as hydrateAuth } from '@/redux/authSlice';
import { hydrate as hydrateReviews } from '@/redux/reviewsSlice';
import { hydrate as hydrateUi } from '@/redux/uiSlice';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/utils/storage';

const STATE_VERSION = 1;
const SAVE_DELAY = 220;

export function loadPersistedState() {
  const persisted = readJSON(STORAGE_KEYS.state, null);
  if (!persisted || persisted.version !== STATE_VERSION) return null;
  return persisted;
}

export function hydrateStore(store, persisted) {
  if (!persisted) return;
  if (persisted.cart) store.dispatch(hydrateCart(persisted.cart));
  if (persisted.wishlist) store.dispatch(hydrateWishlist(persisted.wishlist));
  if (persisted.auth) store.dispatch(hydrateAuth(persisted.auth));
  if (persisted.reviews) store.dispatch(hydrateReviews(persisted.reviews));
  if (persisted.ui) store.dispatch(hydrateUi(persisted.ui));
}

export function snapshotState(state) {
  return {
    version: STATE_VERSION,
    savedAt: Date.now(),
    cart: { items: state.cart.items, coupon: state.cart.coupon },
    wishlist: { items: state.wishlist.items },
    auth: { user: state.auth.user },
    reviews: { byProduct: state.reviews.byProduct },
    ui: { notificationsRead: state.ui.notificationsRead },
  };
}

export function savePersistedState(state) {
  return writeJSON(STORAGE_KEYS.state, snapshotState(state));
}

/**
 * Compare snapshots without their per-write timestamp. `savedAt` changes on every
 * save, so including it would make two otherwise-identical states look different
 * and let two open tabs write the same state back and forth forever.
 */
function serialiseForComparison(snapshot) {
  return JSON.stringify({ ...snapshot, savedAt: 0 });
}

export function startPersistence(store) {
  let timer = null;
  let lastSerialised = '';
  let applyingExternalState = false;

  const flush = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    const snapshot = snapshotState(store.getState());
    const serialised = serialiseForComparison(snapshot);
    if (serialised === lastSerialised) return;
    writeJSON(STORAGE_KEYS.state, snapshot);
    lastSerialised = serialised;
  };

  const unsubscribe = store.subscribe(() => {
    if (applyingExternalState) return;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(flush, SAVE_DELAY);
  });

  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEYS.state || !event.newValue) return;
    try {
      const next = JSON.parse(event.newValue);
      if (next?.version !== STATE_VERSION) return;

      applyingExternalState = true;
      try {
        hydrateStore(store, next);
      } finally {
        applyingExternalState = false;
      }

      // Do not echo the incoming snapshot straight back to the other tab.
      lastSerialised = serialiseForComparison(snapshotState(store.getState()));
    } catch {
      // A corrupt write from another tab should not break this session.
    }
  };

  const handlePageHide = () => flush();

  window.addEventListener('storage', handleStorage);
  window.addEventListener('pagehide', handlePageHide);

  return () => {
    unsubscribe();
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('pagehide', handlePageHide);
    if (timer) window.clearTimeout(timer);
  };
}

export function createAppStore() {
  const store = setupStore();
  hydrateStore(store, loadPersistedState());
  const stopPersistence = startPersistence(store);
  return { store, stopPersistence };
}
