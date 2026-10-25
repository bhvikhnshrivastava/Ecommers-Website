import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  byProduct: {},
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: {
      reducer(state, action) {
        const { productId, ...review } = action.payload;
        if (!productId) return;
        const key = String(productId);
        const existing = state.byProduct[key] ?? [];
        state.byProduct[key] = [review, ...existing];
      },
      prepare(review) {
        return {
          payload: {
            ...review,
            id: nanoid(),
            date: new Date().toISOString(),
            isDemo: false,
          },
        };
      },
    },
    removeReview(state, action) {
      const { productId, reviewId } = action.payload ?? {};
      const key = String(productId);
      if (!state.byProduct[key]) return;
      state.byProduct[key] = state.byProduct[key].filter((review) => review.id !== reviewId);
    },
    hydrate(state, action) {
      const byProduct = action.payload?.byProduct;
      state.byProduct =
        byProduct && typeof byProduct === 'object' && !Array.isArray(byProduct) ? byProduct : {};
    },
  },
});

export const { addReview, removeReview, hydrate } = reviewsSlice.actions;
export default reviewsSlice.reducer;
