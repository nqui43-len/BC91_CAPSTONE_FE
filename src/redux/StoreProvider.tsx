"use client";

import { Provider } from "react-redux";
import { store } from "./store";

// --- GLOBAL STATE PROVIDER ---
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
