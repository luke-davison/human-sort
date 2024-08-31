"use client";

import { observer } from "mobx-react";
import { useMemo } from "react";
import { SortStore } from "../stores/sort-store";
import { useAppStore } from "../hooks/use-app-store";
import { SortStoreContext } from "../hooks/use-sort-store";
import { ItemImage } from "../components/item.image";
import styles from "./sorting-page.module.css";
import { getEstimatedComparisons } from "./get-estimated-comparisons";
import { action } from "mobx";
import { Item } from "../stores/item";
import { ChangeableText } from "../components/changeable-text";

const getFontSize = (value: string) => {
  if (value.length < 50) return 24;
  if (value.length < 100) return 18;
  if (value.length < 200) return 16;
};

export const SortingPage = observer(() => {
  const appStore = useAppStore();

  const sortStore = useMemo(
    () => new SortStore(appStore, appStore.currentList!),
    [appStore]
  );

  const { choices, submit, undo, results, comparisons, list, redoResult } =
    sortStore;

  const left = choices && choices.length > 1 ? choices[0] : undefined;
  const right = choices && choices.length > 1 ? choices[1] : undefined;

  const onChangeChoiceName = action((choice: Item, name: string) => {
    choice.name = name;
    sortStore.list.saveUpdate();
  });

  return (
    <SortStoreContext.Provider value={sortStore}>
      <div className={styles.sortingPage}>
        <div className={styles.sortingPageTitle}>Which is better?</div>

        <div className={styles.sortingPageChoices}>
          {left && right && (
            <>
              <div>
                <button
                  className={styles.sortingPageChoice}
                  style={{ fontSize: getFontSize(left.name) }}
                  onClick={() => submit(left, right, "l")}
                >
                  <ChangeableText
                    value={left.name}
                    onChange={(value) => onChangeChoiceName(left, value)}
                  />
                  <ItemImage item={left} />
                </button>
              </div>
              <div>or</div>
              <div>
                <button
                  className={styles.sortingPageChoice}
                  style={{ fontSize: getFontSize(right.name) }}
                  onClick={() => submit(left, right, "r")}
                >
                  <ChangeableText
                    value={right.name}
                    onChange={(value) => onChangeChoiceName(right, value)}
                  />
                  <ItemImage item={right} />
                </button>
              </div>
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
          <div>
            <div>
              Comparisons made - {comparisons.length} /{" "}
              {getEstimatedComparisons(list.items.length)} (approx)
            </div>
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
          <div>
            <div>
              Results - {results.length} / {list.items.length}
            </div>

            <div className={styles.sortingPageResults}>
              {results.length > 0 && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SortStoreContext.Provider>
  );
});
