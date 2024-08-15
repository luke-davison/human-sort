"use client";

import { observer } from "mobx-react";
import { dummyLists } from "./dummy-lists";
import { useAppStore } from "../hooks/use-app-store";

export const DummyDataPage = observer(() => {
  const { selectADummyList } = useAppStore();

  return (
    <div className="dummy-data-page">
      <div className="dummy-data-page-instructions">
        <div className="dummy-data-page-title">Pick an example list</div>
        <div className="dummy-data-page-instruction">
          Great idea. Jump straight into the fun of sorting without the hassle
          of having to think up things to sort.
        </div>
      </div>

      <div className="dummy-data-page-lists">
        {dummyLists.map((dummyList) => (
          <a
            key={dummyList.name}
            className="dummy-data-list"
            onClick={() => selectADummyList(dummyList)}
          >
            <div className="dummy-data-list-name">{dummyList.name}</div>
            <div className="dummy-data-list-description">
              {dummyList.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
});
