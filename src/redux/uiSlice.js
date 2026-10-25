import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  notificationsRead: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts = [...state.toasts.slice(-2), action.payload];
      },
      prepare({ message, type = 'success', title = null }) {
        return { payload: { id: nanoid(), message, type, title } };
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
    markNotificationsRead(state) {
      state.notificationsRead = true;
    },
    hydrate(state, action) {
      state.notificationsRead = Boolean(action.payload?.notificationsRead);
    },
  },
});

export const { addToast, dismissToast, clearToasts, markNotificationsRead, hydrate } =
  uiSlice.actions;
export default uiSlice.reducer;
