"use client";

import { Provider } from 'react-redux';
import { store } from './store';

// Cái hộp này sẽ bọc lấy toàn bộ trang web của chúng ta
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}