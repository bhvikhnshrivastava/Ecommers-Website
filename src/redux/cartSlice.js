import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  coupon: null,
};

function toCartItem(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice ?? product.price,
    discount: product.discount ?? 0,
    image: product.image ?? null,
    category: product.category,
    categoryLabel: product.categoryLabel,
    stock: Math.max(1, Number(product.stock) || 10),
    quantity: 1,
  };
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const product = action.payload;
      if (!product?.id) return;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.stock);
        return;
      }

      state.items.push(toCartItem(product));
    },
    incrementItem(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.quantity = Math.min(item.quantity + 1, item.stock);
    },
    decrementItem(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.quantity = Math.max(1, item.quantity - 1);
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload ?? {};
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;
      const next = Math.round(Number(quantity));
      if (!Number.isFinite(next)) return;
      item.quantity = Math.min(Math.max(1, next), item.stock);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.items.length === 0) state.coupon = null;
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
    applyCoupon(state, action) {
      state.coupon =
        String(action.payload ?? '')
          .trim()
          .toUpperCase() || null;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    hydrate(state, action) {
      const items = Array.isArray(action.payload?.items) ? action.payload.items : [];
      state.items = items
        .filter((item) => item && item.id && item.quantity > 0)
        .map((item) => ({
          ...toCartItem(item),
          quantity: Math.max(1, Math.min(Number(item.quantity) || 1, Number(item.stock) || 10)),
        }));
      state.coupon =
        typeof action.payload?.coupon === 'string' && action.payload.coupon
          ? action.payload.coupon.toUpperCase()
          : null;
    },
  },
});

export const {
  addItem,
  incrementItem,
  decrementItem,
  setQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  hydrate,
} = cartSlice.actions;

export default cartSlice.reducer;
