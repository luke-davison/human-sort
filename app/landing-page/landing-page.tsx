"use client";

import { observer } from "mobx-react";
import { LandingPageLists } from "./landing-page-lists";
import { useAppStore } from "../hooks/use-app-store";
import styles from "./landing-page.module.css";
import { RunTrialsButton } from "../components/run-trials-button";

export const LandingPage = observer(() => {
  const { startNewList, startADummyList } = useAppStore();

  return (
    <div className={styles.landingPage}>
      <div className={styles.optionsList}>
        <div>Start from scratch</div>
        <button className="landing-page-option" onClick={startNewList}>
          Create and sort a new list
        </button>
        <button className="landing-page-option" onClick={startADummyList}>
          Sort a list of example data
        </button>
      </div>

      <LandingPageLists />
    </div>
  );
});
