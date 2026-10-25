import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCatalog } from '@/api/catalog';

export const loadCatalog = createAsyncThunk(
  'products/loadCatalog',
  async (options = {}, { rejectWithValue }) => {
    try {
      return await fetchCatalog(options);
    } catch (error) {
      return rejectWithValue(error?.message || 'We could not load the collection.');
    }
  },
  {
    condition: (options = {}, { getState }) => {
      const { status } = getState().products;
      if (!options?.force && (status === 'loading' || status === 'refreshing')) return false;
      return true;
    },
  },
);

const initialState = {
  items: [],
  categories: [],
  status: 'idle',
  error: null,
  source: null,
  warning: null,
  fetchedAt: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCatalogWarning(state) {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = state.items.length > 0 ? 'refreshing' : 'loading';
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.categories = action.payload.categories;
        state.source = action.payload.source;
        state.warning = action.payload.warning ?? null;
        state.fetchedAt = action.payload.fetchedAt ?? null;
        state.error = null;
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'We could not load the collection.';
      });
  },
});

export const { clearCatalogWarning } = productsSlice.actions;
export default productsSlice.reducer;
