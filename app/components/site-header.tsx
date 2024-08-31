"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import styles from "./site-header.module.css";

export const SiteHeader = observer(() => {
  const { returnToLanding, page } = useAppStore();

  return (
    <div className={styles.siteHeader}>
      <a className={styles.siteTitle} onClick={returnToLanding}>
        You sort
      </a>
      {page === "landing" && (
        <div className={styles.siteDescription}>
          Why develop AI or algorithms to sort your data when you can do it
          yourself?
        </div>
      )}
    </div>
  );
});
