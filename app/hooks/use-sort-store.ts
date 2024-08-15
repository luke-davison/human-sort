"use client";

import { createContext, useContext } from "react";
import { SortStore } from "../stores/sort-store";

const store = new SortStore();

export const SortStoreContext = createContext(store);

export const useAppStore = () => {
  return useContext(SortStoreContext);
};
