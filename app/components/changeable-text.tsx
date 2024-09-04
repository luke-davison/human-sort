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

    return (
      <div className={styles.changeableTextWrapper}>
        {isClicked ? (
          <input
            autoFocus
            onClick={(event) => event.stopPropagation()}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={() => setIsClicked(false)}
            className={styles.changeableTextInput}
          />
        ) : (
          <div className={styles.changeableTextValue}>{value}</div>
        )}
        <button
          className={styles.changeableTextIcon}
          onClick={(event) => {
            event.stopPropagation();
            setIsClicked(true);
          }}
        >
          ⚙
        </button>
      </div>
    );
  }
);
