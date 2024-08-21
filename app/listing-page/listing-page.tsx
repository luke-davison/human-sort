"use client";

import { observer } from "mobx-react";
import { useAppStore } from "../hooks/use-app-store";
import { ItemImage } from "../components/item.image";
import { BoardGameAdd } from "../components/boardgame-add";
import styles from "./listing-page.module.css";
import { useState } from "react";
import { action } from "mobx";
import ReactImageUploading, { ImageListType } from "react-images-uploading";

export const ListingPage = observer(() => {
  const { currentList } = useAppStore();
  const [inputValue, setInputValue] = useState<string>("");

  const submitAddItems = action(() => {
    inputValue.split(/\r?\n/).forEach((line) => {
      if (line) {
        currentList?.addItem({
          name: line
        });
      }
    });
    setInputValue("");
  });

  const uploadImages = action((images: ImageListType) => {
    images.forEach((image) => {
      const name =
        image.file?.name.substring(0, image.file?.name.lastIndexOf(".")) ?? "";
      currentList?.addItem({
        name,
        image: image.dataURL
      });
    });
  });

  return (
    <div className={styles.listingPage}>
      <div className={styles.listingPageDetails}>
        <div>
          <div>List name</div>
          <input
            value={currentList?.name ?? ""}
            onChange={(event) =>
              currentList?.updateList({ name: event.target.value })
            }
          />
        </div>
        <div>
          <div>Description</div>
          <input
            className={styles.descriptionInput}
            value={currentList?.description ?? ""}
            onChange={(event) =>
              currentList?.updateList({ description: event.target.value })
            }
          />
        </div>
      </div>
      <div className={styles.listingPageMain}>
        <div className={styles.listingPageAddItems}>
          <div className={styles.listingPageAddSubsection}>
            <div>Add items</div>
            <textarea
              className={styles.lstingPageAddItemsInput}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <div className={styles.listingPageAddItemsButtons}>
              <button onClick={submitAddItems}>Add</button>
              <button onClick={() => setInputValue("")}>Clear</button>
            </div>
          </div>

          <div className={styles.listingPageAddSubsection}>
            <div>Add a boardgame</div>
            <BoardGameAdd onAdd={(game) => currentList?.addItem(game)} />
          </div>

          <div className={styles.listingPageAddSubsection}>
            <div>Add images</div>
            <ReactImageUploading onChange={uploadImages} value={[]} multiple>
              {({ onImageUpload, dragProps }) => (
                <div>
                  <button {...dragProps} onClick={onImageUpload}>
                    Click or drop here
                  </button>
                </div>
              )}
            </ReactImageUploading>
          </div>
        </div>
        <div className="listing-page-added-items">
          <div>Added</div>

          {currentList?.items.map((item) => (
            <div key={item.id}>
              <div>{item.name}</div>
              <ItemImage item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
