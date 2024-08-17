"use-client";

import { observer } from "mobx-react";
import { BggSearchItem, BoardGame } from "../types";
import { FC, useEffect, useState } from "react";
import { BggStore } from "../stores/bgg-store";
import styles from "./boardgame-add.module.css";

interface BoardGameAddProps {
  onAdd: (game: BoardGame) => void;
}

const bggStore = new BggStore();

const refineSearchResult = (
  results: BggSearchItem[],
  searchString: string
): BggSearchItem[] => {
  const sortedResults = Array.from(results).sort((resultA, resultB) => {
    const aBeginsWithStr = resultA.name
      .toLowerCase()
      .startsWith(searchString.toLowerCase());
    const bBeginsWithStr = resultB.name
      .toLowerCase()
      .startsWith(searchString.toLowerCase());
    console.log(aBeginsWithStr, bBeginsWithStr);

    if (aBeginsWithStr && !bBeginsWithStr) return -1;
    if (bBeginsWithStr && !aBeginsWithStr) return 1;
    return 0;
  });

  return sortedResults.slice(0, 25);
};

export const BoardGameAdd: FC<BoardGameAddProps> = observer(({ onAdd }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchItems, setSearchItems] = useState<BggSearchItem[] | undefined>();

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (!searchValue) return;
      setIsSearching(true);
      const results = await bggStore.search(searchValue);
      setIsSearching(false);
      setSearchItems(refineSearchResult(results, searchValue));
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  const onSelect = async (item: BggSearchItem) => {
    setSearchItems(undefined);
    const game = await bggStore.get(item);
    onAdd(game);
  };

  return (
    <div className={styles.boardgameAdd}>
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />

      <div className={styles.boardgameAddModal}>
        {isSearching ? (
          <div>Searching</div>
        ) : (
          <>
            {searchItems?.map((item) => (
              <a key={item.bggId} onClick={() => onSelect(item)}>
                <div>{item.name}</div>
                <div>({item.bggYear})</div>
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  );
});
