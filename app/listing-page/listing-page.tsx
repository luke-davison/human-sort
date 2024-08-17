"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import { ItemImage } from "../components/item.image";
import { BoardGameAdd } from "../components/boardgame-add";

export const ListingPage = observer(() => {
  const { currentList } = useAppStore();

  return (
    <div className="listing-page">
      <BoardGameAdd onAdd={(game) => currentList?.addItem(game)} />

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
