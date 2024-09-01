"use client";

import { observer } from "mobx-react";
import { useEffect, useMemo, useRef } from "react";
import { SortStore } from "../stores/sort-store";
import { useAppStore } from "../hooks/use-app-store";
import { SortStoreContext } from "../hooks/use-sort-store";
import { ItemImage } from "../components/item.image";
import styles from "./sorting-page.module.css";
import { getEstimatedComparisons } from "./get-estimated-comparisons";
import { action } from "mobx";
import { Item } from "../stores/item";
import { ChangeableText } from "../components/changeable-text";
import { SiteHeader } from "../components/site-header";
import { SortItem } from "./sort-item";

export const SortingPage = observer(() => {
  const appStore = useAppStore();

  const sortStore = useMemo(
    () => new SortStore(appStore, appStore.currentList!),
    [appStore]
  );

  const resultsListRef = useRef<HTMLDivElement | null>(null);
  const comparisonsListRef = useRef<HTMLDivElement | null>(null);

  const { choices, submit, undo, results, comparisons, list, redoResult } =
    sortStore;

  const left = choices && choices.length > 1 ? choices[0] : undefined;
  const right = choices && choices.length > 1 ? choices[1] : undefined;

  const onChangeChoiceName = action((choice: Item, name: string) => {
    choice.name = name;
    sortStore.list.saveUpdate();
  });

  const scrollToResults = () => {
    resultsListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToComaprisons = () => {
    comparisonsListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        undo();
      } else if (choices && choices.length > 1) {
        if (event.key === "ArrowRight") {
          submit(choices[0], choices[1], "r");
        } else if (event.key === "ArrowLeft") {
          submit(choices[0], choices[1], "l");
        }
      }
    };

    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [choices, submit, undo]);

  const resultsText = `Results - ${results.length} / ${list.items.length}`;
  const comparisonsText = `Comparisons - ${
    comparisons.length
  } / ${getEstimatedComparisons(list.items.length)}`;

  return (
    <SortStoreContext.Provider value={sortStore}>
      <div className={styles.sortingPageTopContainer}>
        <div className={styles.sortingPageTopInner}>
          <SiteHeader />
          <div className={styles.sortingPageTitle}>Which is better?</div>

          <div className={styles.sortingPageChoices}>
            {left && right && (
              <>
                <SortItem
                  item={left}
                  onSubmit={() => submit(left, right, "l")}
                  onChange={(value) => onChangeChoiceName(left, value)}
                />
                <div>or</div>
                <SortItem
                  item={right}
                  onSubmit={() => submit(left, right, "r")}
                  onChange={(value) => onChangeChoiceName(right, value)}
                />
              </>
            )}
          </div>
          <div className={styles.sortingPageAdditionalButtons}>
            <button className="sorting-page-undo" onClick={undo}>
              Undo
            </button>
          </div>
          <div className={styles.sortingPageInstructions}>
            The left and right arrows can be used if desired. The up arrow
            undoes the most recent selection.
          </div>
        </div>
        <div className={styles.linksToLists}>
          {comparisons.length > 0 && (
            <button onClick={scrollToComaprisons}>{comparisonsText}</button>
          )}
          {results.length > 0 && (
            <button onClick={scrollToResults}>{resultsText}</button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div
          ref={resultsListRef}
          className={styles.sortingPageResultsContainer}
        >
          <div>{resultsText}</div>

          <div className={styles.sortingPageResults}>
            {results.map((result, index) => (
              <div key={result.id} className={styles.sortingPageResult}>
                <span>
                  {index + 1}
                  {". "}
                </span>
                <span className={styles.sortingPageResultName}>
                  {result.name}
                </span>
                <button onClick={() => redoResult(result)}>x</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        ref={comparisonsListRef}
        className={styles.sortingPageResultsContainer}
      >
        <div>{comparisonsText} (approx)</div>
        <div className={styles.sortingPageResults}>
          {comparisons
            .slice(-20)
            .reverse()
            .map((comparison, index) => (
              <div key={index} className={styles.sortingPageResult}>
                {comparisons.length - index}
                {". "}
                {comparison.left.name}
                {comparison.pick === "l" ? " > " : " < "}
                {comparison.right.name}
              </div>
            ))}
        </div>
      </div>
    </SortStoreContext.Provider>
  );
});
