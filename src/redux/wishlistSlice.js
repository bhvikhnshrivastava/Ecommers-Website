import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

function toWishlistItem(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice ?? product.price,
    discount: product.discount ?? 0,
    image: product.image ?? null,
    category: product.category,
    categoryLabel: product.categoryLabel,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    stock: Math.max(1, Number(product.stock) || 10),
  };
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      if (!product?.id) return;
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(toWishlistItem(product));
      }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
    hydrate(state, action) {
      const items = Array.isArray(action.payload?.items) ? action.payload.items : [];
      state.items = items.filter((item) => item && item.id).map(toWishlistItem);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, hydrate } = wishlistSlice.actions;
export default wishlistSlice.reducer;
