"use client";

import { observer } from "mobx-react";
import { SiteHeader } from "./site-header";
import { FC, PropsWithChildren } from "react";

export const Page: FC<PropsWithChildren> = observer(({ children }) => {
  return (
    <div className="app">
      <SiteHeader />
      <div className="page">{children}</div>
    </div>
  );
});
