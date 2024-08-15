"use client";

import { observer } from "mobx-react";
import { SiteHeader } from "./site-header";
import { FC, PropsWithChildren } from "react";
import styles from "./page.module.css";

export const Page: FC<PropsWithChildren> = observer(({ children }) => {
  return (
    <div className={styles.app}>
      <SiteHeader />
      {children}
    </div>
  );
});
