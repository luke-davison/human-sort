"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";

export const SiteHeader = observer(() => {
  const { returnToLanding } = useAppStore();

  return (
    <div className="site-header">
      <a className="site-title" onClick={returnToLanding}>
        Human sort
      </a>
      <div className="site-subtitle">
        Why develop AI or algorithms to sort your data when you can get humans
        to do it?
      </div>
    </div>
  );
});
