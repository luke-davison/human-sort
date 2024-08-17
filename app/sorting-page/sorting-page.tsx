"use client";

import { observer } from "mobx-react";
import { useMemo } from "react";
import { SortStore } from "../stores/sort-store";
import { useAppStore } from "../hooks/use-app-store";
import { SortStoreContext } from "../hooks/use-sort-store";
import { ItemImage } from "../components/item.image";

export const SortingPage = observer(() => {
  const appStore = useAppStore();

  const sortStore = useMemo(
    () => new SortStore(appStore, appStore.currentList!),
    [appStore]
  );

  const { choices, submit, undo, results, comparisons } = sortStore;

  const left = choices && choices.length > 1 ? choices[0] : undefined;
  const right = choices && choices.length > 1 ? choices[1] : undefined;

  return (
    <SortStoreContext.Provider value={sortStore}>
      <div className="sorting-page">
        <div className="sorting-page-instructions">
          <div className="sorting-page-title">Which is better?</div>
          <div className="sorting-page-instruction">
            The left and right arrows can be used if desired. The up arrow
            undoes the most recent selection.
          </div>
        </div>

        <div className="sorting-page-choices">
          {left && right && (
            <>
              <a
                className="sorting-page-choice"
                onClick={() => submit(left, right, "l")}
              >
                <div>{left.name}</div>
                <ItemImage item={left} />
              </a>
              <a
                className="sorting-page-choice"
                onClick={() => submit(left, right, "r")}
              >
                <div>{right.name}</div>
                <ItemImage item={right} />
              </a>
            </>
          )}
        </div>

        <div className="sorting-page-additional-buttons">
          <a className="sorting-page-undo" onClick={undo}>
            Undo
          </a>
        </div>

        <div className="sorting-page-results">
          {results.map((result, index) => (
            <div key={result.id} className="sorting-page-result">
              {index + 1}
              {". "}
              {result.name}
            </div>
          ))}
        </div>

        <div className="sorting-page-comparisons">
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
      </div>
    </SortStoreContext.Provider>
  );
});
