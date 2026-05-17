import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// --- CẤU HÌNH GLOBAL STORE (Redux Toolkit) ---
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;