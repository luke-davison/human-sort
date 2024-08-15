"use client";

import { createContext, useContext } from "react";
import { AppStore } from "../stores/app-store";

const store = new AppStore();

export const AppStoreContext = createContext(store);

export const useAppStore = () => {
  return useContext(AppStoreContext);
};
