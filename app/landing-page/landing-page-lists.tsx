"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import styles from "./landing-page-lists.module.css";

export const LandingPageLists = observer(() => {
  const { listsLoaded, lists, goToList, deleteList } = useAppStore();

  return (
    <div className={styles.landingPageLists}>
      <div className="landing-page-lists-subheading">
        View or continue sorting an existing list
      </div>

      <div className={styles.landingPageListsContainer}>
        {listsLoaded && lists.length === 0 && (
          <div className="no-lists-message">No lists created yet</div>
        )}

        {lists.map((list) => (
          <div key={list.id} className={styles.landingPageListContainer}>
            <button
              className={styles.landingPageList}
              onClick={() => goToList(list)}
            >
              <div className="landing-page-list-name">{list.name}</div>
              <div className={styles.landingPageListRow}>
                <div className="landing-page-list-size">
                  {list.items.length} items
                </div>
                <div className="landing-page-list-comparisons">
                  {list.comparisons.length} comparisons made
                </div>
              </div>
            </button>
            <button onClick={() => deleteList(list)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
});
