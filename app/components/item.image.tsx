import { observer } from "mobx-react";
import { FC } from "react";
import { Item } from "../types";

export const ItemImage: FC<{ item: Item }> = observer(({ item }) => {
  return (
    <div>
      {item.bggImage && <img src={item.bggImage} alt="Image" width={200} />}
    </div>
  );
});
