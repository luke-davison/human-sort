"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";

export const LandingPageLists = observer(() => {
  const { listsLoaded, lists, goToList } = useAppStore();

  return (
    <div className="landing-page-lists">
      <div className="landing-page-lists-subheading">
        View or continue sorting an existing list
      </div>

      <div className="landing-page-lists-container">
        {listsLoaded && lists.length === 0 && (
          <div className="no-lists-message">No lists created yet</div>
        )}

        {lists.map((list) => (
          <a
            key={list.id}
            className="landing-page-list"
            onClick={() => goToList(list)}
          >
            <div className="landing-page-list-name">{list.name}</div>
            <div className="landing-page-list-size">
              {list.items.length} items
            </div>
            <div className="landing-page-list-comparisons">
              {list.comparisons.length} comparisons made
            </div>
          </a>
        ))}
      </div>
    </div>
  );
});
