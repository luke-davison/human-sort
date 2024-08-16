"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import { useEffect, useState } from "react";
import { BggStore } from "../stores/bgg-store";
import { BoardGame, SearchItem } from "../types";

const bggStore = new BggStore();

export const ListingPage = observer(() => {
  const { currentList } = useAppStore();

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchItems, setSearchItems] = useState<SearchItem[] | undefined>();
  const [selected, setSelected] = useState<BoardGame[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (!searchValue) return;
      setIsSearching(true);
      const results = await bggStore.search(searchValue);
      setIsSearching(false);
      setSearchItems(results);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  const onSelect = async (item: SearchItem) => {
    setSearchItems(undefined);
    const game = await bggStore.get(item);
    setSelected([...selected, game]);
  };

  return (
    <div className="listing-page">
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />

      <div>
        {isSearching ? (
          <div>Searching</div>
        ) : (
          <>
            {searchItems?.map((item) => (
              <a key={item.id} onClick={() => onSelect(item)}>
                <div>{item.name}</div>
                <div>{item.year}</div>
              </a>
            ))}
          </>
        )}
      </div>

      <div>
        <div>Selected</div>

        {selected.map((boardgame) => (
          <div key={boardgame.id}>
            <div>{boardgame.name}</div>
            <div>
              <img src={boardgame.image} alt="Image" width={200} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
