"use client";

import { createContext, useContext } from "react";
import { SortStore } from "../stores/sort-store";
import { AppStore } from "../stores/app-store";
import { List } from "../stores/list";

const appStore = new AppStore();
const store = new SortStore(
  appStore,
  new List(appStore, {
    id: 0,
    name: "",
    description: "",
    sortType: "tournament",
    items: JSON.stringify([]),
    comparisons: JSON.stringify([]),
    discarded: JSON.stringify([])
  })
);

export const SortStoreContext = createContext(store);

export const useAppStore = () => {
  return useContext(SortStoreContext);
};
