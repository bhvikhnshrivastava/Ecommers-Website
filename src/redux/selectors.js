import { createSelector } from '@reduxjs/toolkit';
import { computeTotals } from '@/utils/orderTotals';

export const selectProducts = (state) => state.products.items;
export const selectCategories = (state) => state.products.categories;
export const selectCatalogStatus = (state) => state.products.status;
export const selectCatalogError = (state) => state.products.error;
export const selectCatalogSource = (state) => state.products.source;
export const selectCatalogWarning = (state) => state.products.warning;
export const selectCatalogFetchedAt = (state) => state.products.fetchedAt;
export const selectIsCatalogLoading = (state) =>
  state.products.status === 'idle' || state.products.status === 'loading';

export const selectProductById = (state, id) =>
  state.products.items.find((product) => String(product.id) === String(id)) ?? null;

export const selectCategoryBySlug = (state, slug) =>
  state.products.categories.find((category) => category.slug === slug) ?? null;

export const selectProductsByCategory = (state, slug) =>
  state.products.items.filter((product) => product.category === slug);

export const selectTopRated = createSelector([selectProducts], (products) =>
  [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 4),
);

export const selectMostReviewed = createSelector([selectProducts], (products) =>
  [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
);

export const selectBestDiscounts = createSelector([selectProducts], (products) =>
  [...products].sort((a, b) => b.discount - a.discount).slice(0, 4),
);

export const selectCartItems = (state) => state.cart.items;
export const selectCartCoupon = (state) => state.cart.coupon;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
);

export const selectCartQuantity = (state, id) =>
  state.cart.items.find((item) => String(item.id) === String(id))?.quantity ?? 0;

export const selectIsInCart = (state, id) =>
  state.cart.items.some((item) => String(item.id) === String(id));

export const selectCartTotals = createSelector(
  [selectCartItems, selectCartCoupon],
  (items, coupon) => computeTotals(items, coupon),
);

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = createSelector([selectWishlistItems], (items) => items.length);
export const selectIsWishlisted = (state, id) =>
  state.wishlist.items.some((item) => String(item.id) === String(id));

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export const selectReviewsByProduct = (state, id) => state.reviews.byProduct[String(id)] ?? [];

export const selectToasts = (state) => state.ui.toasts;
export const selectNotificationsRead = (state) => state.ui.notificationsRead;
