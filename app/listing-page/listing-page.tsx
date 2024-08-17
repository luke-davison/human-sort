"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import { useEffect, useState } from "react";
import { BggStore } from "../stores/bgg-store";
import { BoardGame, BggSearchItem } from "../types";
import { ItemImage } from "../components/item.image";

const bggStore = new BggStore();

export const ListingPage = observer(() => {
  const { currentList } = useAppStore();

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchItems, setSearchItems] = useState<BggSearchItem[] | undefined>();

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

  const onSelect = async (item: BggSearchItem) => {
    setSearchItems(undefined);
    const game = await bggStore.get(item);
    currentList?.addItem({
      name: game.name,
      bggId: game.id,
      bggImage: game.image,
      bggYear: game.year
    });
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

        {currentList?.items.map((item) => (
          <div key={item.id}>
            <div>{item.name}</div>
            <ItemImage item={item} />
          </div>
        ))}
      </div>
    </div>
  );
});
