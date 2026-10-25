import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupStore } from '@/app/store';
import { hydrateStore, snapshotState, startPersistence } from '@/app/persistence';
import { addItem } from '@/redux/cartSlice';
import { STORAGE_KEYS } from '@/utils/storage';
import { DEMO_USER, makeCartItem, makeProduct, PRODUCTS } from './fixtures';

const externalSnapshot = (cartItems = []) => ({
  version: 1,
  savedAt: Date.now(),
  cart: { items: cartItems, coupon: null },
  wishlist: { items: [] },
  auth: { user: DEMO_USER },
  reviews: { byProduct: {} },
  ui: { notificationsRead: true },
});

afterEach(() => {
  vi.useRealTimers();
});

describe('persistence', () => {
  it('hydrates each persisted slice', () => {
    const store = setupStore();

    hydrateStore(store, externalSnapshot([makeCartItem(PRODUCTS[0], 2)]));

    expect(store.getState().cart.items[0].quantity).toBe(2);
    expect(store.getState().auth.user.email).toBe(DEMO_USER.email);
    expect(store.getState().ui.notificationsRead).toBe(true);
  });

  it('builds a versioned snapshot without catalog or transient state', () => {
    const store = setupStore();
    store.dispatch(addItem(PRODUCTS[1]));

    const snapshot = snapshotState(store.getState());

    expect(snapshot.version).toBe(1);
    expect(snapshot.savedAt).toEqual(expect.any(Number));
    expect(snapshot.cart.items).toHaveLength(1);
    expect(snapshot).not.toHaveProperty('products');
    expect(snapshot).not.toHaveProperty('ui.toasts');
  });

  it('debounces local writes after a change', () => {
    vi.useFakeTimers();
    const store = setupStore();
    const stop = startPersistence(store);
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    store.dispatch(addItem(makeProduct({ id: 30, title: 'Debounced Piece' })));
    vi.advanceTimersByTime(300);

    expect(setItem).toHaveBeenCalledTimes(1);
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.state));
    expect(saved.cart.items[0].title).toBe('Debounced Piece');

    stop();
  });

  it('does not echo another tab snapshot back to localStorage', () => {
    vi.useFakeTimers();
    const store = setupStore();
    const stop = startPersistence(store);
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const incoming = externalSnapshot([makeCartItem(PRODUCTS[1], 1)]);

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEYS.state,
        newValue: JSON.stringify(incoming),
      }),
    );

    expect(store.getState().cart.items[0].id).toBe(2);
    vi.advanceTimersByTime(500);
    expect(setItem).not.toHaveBeenCalled();

    // Local changes after an external hydration should still be saved.
    store.dispatch(addItem(PRODUCTS[0]));
    vi.advanceTimersByTime(300);
    expect(setItem).toHaveBeenCalledTimes(1);

    stop();
  });
});
