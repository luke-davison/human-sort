"use client";

import { observer } from "mobx-react";
import { FC, useState } from "react";
import styles from "./changeable-text.module.css";

interface ChangeableTextProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChangeableText: FC<ChangeableTextProps> = observer(
  ({ value, onChange }) => {
    const [isClicked, setIsClicked] = useState(false);

    if (!isClicked) {
      return (
        <div className={styles.changeableTextWrapper}>
          <div className={styles.changeableTextValue}>{value}</div>
          <div
            className={styles.changeableTextIcon}
            onClick={(event) => {
              event.stopPropagation();
              setIsClicked(true);
            }}
          >
            ⚙
          </div>
        </div>
      );
    }

    return (
      <div>
        <input
          onClick={(event) => event.stopPropagation()}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }
);
