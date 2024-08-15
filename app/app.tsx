"use client";

import { observer } from "mobx-react";
import { useAppStore } from "./hooks/use-app-store";
import { LandingPage } from "./landing-page/landing-page";
import { SortingPage } from "./sorting-page/sorting-page";
import { DummyDataPage } from "./dummy-data-page/dummy-data-page";
import { ListingPage } from "./listing-page/listing-page";

export const App = observer(() => {
  const { page } = useAppStore();
  return (
    <>
      {page === "landing" && <LandingPage />}
      {page === "listing" && <ListingPage />}
      {page === "dummying" && <DummyDataPage />}
      {page === "sorting" && <SortingPage />}
    </>
  );
});
