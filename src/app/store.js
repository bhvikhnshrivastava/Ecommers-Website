import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/redux/productsSlice';
import cartReducer from '@/redux/cartSlice';
import wishlistReducer from '@/redux/wishlistSlice';
import authReducer from '@/redux/authSlice';
import reviewsReducer from '@/redux/reviewsSlice';
import uiReducer from '@/redux/uiSlice';

export const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  reviews: reviewsReducer,
  ui: uiReducer,
});

export function setupStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: import.meta.env.DEV,
  });
}
