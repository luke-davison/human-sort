import { observer } from "mobx-react";
import { Item } from "../stores/item";
import { ChangeableText } from "../components/changeable-text";
import styles from "./sort-item.module.css";
import { ItemImage } from "../components/item-image";

interface SortItemProps {
  item: Item;
  onSubmit: () => void;
  onChange: (name: string) => void;
}

const getFontSize = (value: string, hasImage: boolean) => {
  if (hasImage) return 16;
  if (value.length < 10) return 28;
  if (value.length < 50) return 24;
  if (value.length < 100) return 18;
  if (value.length < 200) return 16;
};

export const SortItem = observer((props: SortItemProps) => {
  const { item, onSubmit, onChange } = props;

  return (
    <div>
      <button
        key={item.id}
        className={styles.sortingPageChoice}
        style={{
          fontSize: getFontSize(item.name, !!item.bggImage || !!item.image)
        }}
        onClick={onSubmit}
      >
        <ChangeableText value={item.name} onChange={onChange} />
        <ItemImage item={item} />
      </button>
    </div>
  );
});
