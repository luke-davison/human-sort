"use client";

import { observer } from "mobx-react";
import { FC } from "react";
import { Item } from "../stores/item";

import styles from "./item-image.module.css";

export const ItemImage: FC<{ item: Item }> = observer(({ item }) => {
  return (
    <div className={styles.itemImage}>
      {item.bggImage && <img src={item.bggImage} alt="Image" />}
      {item.image && <img src={item.image} alt="Image" />}
    </div>
  );
});
