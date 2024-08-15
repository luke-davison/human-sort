"use client";

import { observer } from "mobx-react";
import { LandingPageLists } from "./landing-page-lists";
import { useAppStore } from "../hooks/use-app-store";

export const LandingPage = observer(() => {
  const { startNewList, startADummyList } = useAppStore();

  return (
    <div className="landing-page">
      <div className="landing-page-options">
        <a className="landing-page-option" onClick={startNewList}>
          Create and sort a new list
        </a>
        <a className="landing-page-option" onClick={startADummyList}>
          Sort a list of example data
        </a>
      </div>

      <LandingPageLists />
    </div>
  );
});
