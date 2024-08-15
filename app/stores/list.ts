import { computed, makeObservable, observable } from "mobx";
import { Comparison, Data, Item, SortType } from "../types";
import { DIVIDER_CHAR, SPLIT_CHAR } from "./db-store";

export class List {
  get id() {
    return this.data.id;
  }

  name: string = "";
  description: string = "";
  sortType: SortType = "tournament";
  items: Item[] = [];
  comparisons: Comparison[] = [];

  constructor(private data: Data) {
    this.importData(data);

    makeObservable(this, {
      id: computed,
      name: observable,
      description: observable,
      sortType: observable,
      items: observable,
      comparisons: observable
    });
  }

  importData = (data: Data) => {
    const items: Item[] = data.items
      .split(DIVIDER_CHAR)
      .reduce((arr: Item[], label, index) => {
        if (label) {
          arr.push({
            key: String(index),
            label
          });
        }
        return arr;
      }, []);

    const comparisons: Comparison[] = data.comparisons
      .split(DIVIDER_CHAR)
      .reduce((arr: Comparison[], substr) => {
        const [winnerKey, loserKey] = substr.split(SPLIT_CHAR);
        const winner = items.find((item) => item.key === winnerKey);
        const loser = items.find((item) => item.key === loserKey);
        if (winner && loser) {
          arr.push({ winner, loser });
        }
        return arr;
      }, []);

    this.name = data.name;
    this.description = data.description;
    this.sortType = data.sortType;
    this.items = items;
    this.comparisons = comparisons;
  };

  exportList = (): Data => {
    const highestKey = this.items.reduce((acc, item) => {
      return Number(item.key) > acc ? Number(item.key) : acc;
    }, 0);

    let items: string = "";

    for (let i = 1; i <= highestKey; i++) {
      const item = this.items.find((item) => item.key === String(i));
      items += `${item?.key ?? ""}${DIVIDER_CHAR}`;
    }

    const comparisons: string = this.comparisons
      .map(
        (comparison) =>
          `${comparison.winner.key}${SPLIT_CHAR}${comparison.loser.key}`
      )
      .join(DIVIDER_CHAR);

    return {
      id: this.data.id,
      name: this.name,
      description: this.description,
      sortType: this.sortType,
      items,
      comparisons
    };
  };

  shuffle = () => {
    const newArray: Item[] = [];
    this.items.forEach((item) => {
      const index = Math.floor(Math.random() * (newArray.length + 1));
      newArray.splice(index, 0, item);
    });
    this.items = newArray;
  };
}
