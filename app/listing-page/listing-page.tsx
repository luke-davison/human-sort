"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";

export const ListingPage = observer(() => {
  const { currentList } = useAppStore();

  return <div className="listing-page"></div>;
});
