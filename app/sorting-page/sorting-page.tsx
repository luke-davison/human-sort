"use client";

import { observer } from "mobx-react";
import { useMemo } from "react";
import { SortStore } from "../stores/sort-store";
import { useAppStore } from "../hooks/use-app-store";
import { SortStoreContext } from "../hooks/use-sort-store";
import { ItemImage } from "../components/item.image";
import styles from "./sorting-page.module.css";
import { getEstimatedComparisons } from "./get-estimated-comparisons";

export const SortingPage = observer(() => {
  const appStore = useAppStore();

  const sortStore = useMemo(
    () => new SortStore(appStore, appStore.currentList!),
    [appStore]
  );

  const { choices, submit, undo, results, comparisons, list } = sortStore;

  const left = choices && choices.length > 1 ? choices[0] : undefined;
  const right = choices && choices.length > 1 ? choices[1] : undefined;

  return (
    <SortStoreContext.Provider value={sortStore}>
      <div className={styles.sortingPage}>
        <div className={styles.sortingPageTitle}>Which is better?</div>

        <div className={styles.sortingPageChoices}>
          {left && right && (
            <>
              <button
                className={styles.sortingPageChoice}
                onClick={() => submit(left, right, "l")}
              >
                <div>{left.name}</div>
                <ItemImage item={left} />
              </button>
              <div>or</div>
              <button
                className={styles.sortingPageChoice}
                onClick={() => submit(left, right, "r")}
              >
                <div>{right.name}</div>
                <ItemImage item={right} />
              </button>
            </>
          )}
        </div>

        <div className={styles.sortingPageAdditionalButtons}>
          <button className="sorting-page-undo" onClick={undo}>
            Undo
          </button>
        </div>

        <div className={styles.sortingPageInstructions}>
          The left and right arrows can be used if desired. The up arrow undoes
          the most recent selection.
        </div>

        <div className={styles.sortingPageOutputs}>
          <div className="sorting-page-comparisons">
            <div>
              Comparisons made - {comparisons.length} /{" "}
              {getEstimatedComparisons(list.items.length)} (approx)
            </div>
            {comparisons.map((comparison, index) => (
              <div key={index} className="sorting-page-comparison">
                {index + 1}
                {". "}
                {comparison.left.name}
                {comparison.pick === "l" ? " > " : " < "}
                {comparison.right.name}
              </div>
            ))}
          </div>
          <div className="sorting-page-results">
            {results.length > 0 && (
              <>
                <div>
                  Results - {results.length} / {list.items.length}
                </div>
                {results.map((result, index) => (
                  <div key={result.id} className="sorting-page-result">
                    {index + 1}
                    {". "}
                    {result.name}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </SortStoreContext.Provider>
  );
});
