"use client";

import { observer } from "mobx-react";
import { FC } from "react";
import { Item } from "../stores/item";

export const ItemImage: FC<{ item: Item }> = observer(({ item }) => {
  return (
    <div>
      {item.bggImage && <img src={item.bggImage} alt="Image" width={200} />}
      {item.image && <img src={item.image} alt="Image" width={300} />}
    </div>
  );
});
