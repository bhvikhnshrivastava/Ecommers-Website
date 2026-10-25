import { describe, expect, it } from 'vitest';
import cartReducer, {
  addItem,
  applyCoupon,
  clearCart,
  hydrate as hydrateCart,
  removeItem,
  setQuantity,
} from '@/redux/cartSlice';
import wishlistReducer, { hydrate as hydrateWishlist, toggleWishlist } from '@/redux/wishlistSlice';
import { makeCartItem, makeProduct, PRODUCTS } from './fixtures';

describe('cart slice', () => {
  it('adds a product once and increments it on subsequent adds', () => {
    let state = cartReducer(undefined, addItem(PRODUCTS[0]));
    state = cartReducer(state, addItem(PRODUCTS[0]));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      id: 1,
      title: 'Aurora Wireless Headphones',
      quantity: 2,
      price: 2499,
    });
  });

  it('never adds more than the available stock', () => {
    const product = makeProduct({ id: 10, stock: 2, title: 'Limited Piece' });
    let state = cartReducer(undefined, addItem(product));
    state = cartReducer(state, addItem(product));
    state = cartReducer(state, addItem(product));

    expect(state.items[0].quantity).toBe(2);
  });

  it('clamps quantity changes between one and the stock level', () => {
    const product = makeProduct({ id: 11, stock: 4 });
    let state = cartReducer(undefined, addItem(product));

    state = cartReducer(state, setQuantity({ id: 11, quantity: 99 }));
    expect(state.items[0].quantity).toBe(4);

    state = cartReducer(state, setQuantity({ id: 11, quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);

    state = cartReducer(state, setQuantity({ id: 11, quantity: 'not-a-number' }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clears an applied coupon when the last item is removed', () => {
    let state = cartReducer(undefined, addItem(PRODUCTS[1]));
    state = cartReducer(state, applyCoupon('ecasp10'));

    expect(state.coupon).toBe('ECASP10');

    state = cartReducer(state, removeItem(2));
    expect(state.items).toEqual([]);
    expect(state.coupon).toBeNull();

    state = cartReducer(state, applyCoupon('WELCOME200'));
    state = cartReducer(state, clearCart());
    expect(state.coupon).toBeNull();
  });

  it('sanitises persisted cart data on hydration', () => {
    const valid = makeCartItem(PRODUCTS[0], 99);
    const state = cartReducer(
      undefined,
      hydrateCart({
        coupon: 'welcome200',
        items: [valid, { id: null, quantity: 2 }, { ...valid, id: 77, quantity: 0 }],
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(valid.stock);
    expect(state.coupon).toBe('WELCOME200');
  });
});

describe('wishlist slice', () => {
  it('toggles a product in and out of the wishlist', () => {
    let state = wishlistReducer(undefined, toggleWishlist(PRODUCTS[2]));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 3, title: 'Linen Overshirt', rating: 3.8 });

    state = wishlistReducer(state, toggleWishlist(PRODUCTS[2]));
    expect(state.items).toEqual([]);
  });

  it('drops malformed entries while hydrating', () => {
    const state = wishlistReducer(
      undefined,
      hydrateWishlist({ items: [PRODUCTS[0], { title: 'Missing id' }, null] }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(1);
  });
});
