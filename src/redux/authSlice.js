import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authenticate } from '@/api/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authenticate(credentials);
    } catch (error) {
      return rejectWithValue(error?.message || 'We could not sign you in.');
    }
  },
);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    hydrate(state, action) {
      const user = action.payload?.user;
      state.user = user && user.email ? user : null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'We could not sign you in.';
      });
  },
});

export const { logout, clearAuthError, hydrate } = authSlice.actions;
export default authSlice.reducer;
