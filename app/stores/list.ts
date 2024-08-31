import { action, computed, makeObservable, observable } from "mobx";
import { Comparison, ComparisonData, Data, ItemData, SortType } from "../types";
import { AppStore } from "./app-store";
import { Item } from "./item";

export class List {
  get id() {
    return this.data.id;
  }

  name: string = "";
  description: string = "";
  sortType: SortType = "tournament";
  items: Item[] = [];
  comparisons: Comparison[] = [];
  discarded = new Set<string>();

  constructor(private appStore: AppStore, private data: Data) {
    this.importData(data);

    makeObservable(this, {
      id: computed,
      name: observable,
      description: observable,
      sortType: observable,
      items: observable,
      comparisons: observable,
      addItem: action,
      updateList: action,
      removeItem: action
    });
  }

  importData = (data: Data) => {
    const items: Item[] = JSON.parse(data.items).map(
      (itemData: ItemData) => new Item(itemData)
    );

    this.name = data.name;
    this.description = data.description;
    this.sortType = data.sortType;
    this.items = items;
    this.comparisons = this.importComparisons(data.comparisons, items);
    this.discarded = this.importDiscarded(data.discarded);
  };

  importComparisons = (comparisonsStr: string, items: Item[]): Comparison[] => {
    const comparisonData: ComparisonData[] = JSON.parse(comparisonsStr);
    return comparisonData.map((comparisonData) => {
      const left = items.find((item) => item.id === comparisonData.left);
      const right = items.find((item) => item.id === comparisonData.right);
      if (!left || !right) {
        throw new Error("Data invalid");
      }
      const winner = comparisonData.pick === "l" ? left : right;
      const loser = comparisonData.pick === "l" ? right : left;
      return {
        left,
        right,
        winner,
        loser,
        pick: comparisonData.pick
      };
    });
  };

  importDiscarded = (discardedStr: string): Set<string> => {
    return new Set(JSON.parse(discardedStr) as string[]);
  };

  exportList = (): Data => {
    return {
      id: this.data.id,
      name: this.name,
      description: this.description,
      sortType: this.sortType,
      items: JSON.stringify(this.items.map((item) => item.export())),
      comparisons: this.exportComparisons(),
      discarded: this.exportDiscarded()
    };
  };

  exportComparisons = (): string => {
    const comparisonData: ComparisonData[] = this.comparisons.map(
      (comparison) => ({
        left: comparison.left.id,
        right: comparison.right.id,
        pick: comparison.pick
      })
    );

    return JSON.stringify(comparisonData);
  };

  exportDiscarded = (): string => {
    return JSON.stringify(Array.from(this.discarded));
  };

  get nextId(): string {
    return String(
      this.items.reduce((number: number, item) => {
        const idNum = Number(item.id);
        if (idNum > number) return idNum;
        return number;
      }, 0) + 1
    );
  }

  updateList = (list: Partial<Data>) => {
    if (list.name !== undefined) {
      this.name = list.name;
    }

    if (list.description !== undefined) {
      this.description = list.description;
    }

    this.saveUpdate();
  };

  addItem = (item: Omit<ItemData, "id">) => {
    this.items.push(
      new Item({
        id: this.nextId,
        ...item
      })
    );
    this.saveUpdate();
  };

  removeItem = (item: Item) => {
    this.items = this.items.filter((existing) => existing.id !== item.id);
    this.saveUpdate();
  };

  timeout: number = 0;

  saveUpdate = () => {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.appStore.db.update(this.exportList());
    }, 1000);
  };

  shuffle = () => {
    const newArray: Item[] = [];
    this.items.forEach((item) => {
      const index = Math.floor(Math.random() * (newArray.length + 1));
      newArray.splice(index, 0, item);
    });
    this.items = newArray;
    this.saveUpdate();
  };

  getDiscardedKey = (winner: Item, loser: Item) => {
    return `${winner.id}>${loser.id}`;
  };

  getComparisonFromDiscarded = (
    left: Item,
    right: Item
  ): Comparison | undefined => {
    let winner: Item | undefined,
      loser: Item | undefined,
      pick: "l" | "r" | undefined;

    const keyA = this.getDiscardedKey(left, right);
    const keyB = this.getDiscardedKey(right, left);
    if (this.discarded.has(keyA)) {
      winner = left;
      loser = right;
      pick = "l";
    } else if (this.discarded.has(keyB)) {
      winner = right;
      loser = left;
      pick = "r";
    }

    this.discarded.delete(keyA);
    this.discarded.delete(keyB);

    if (winner && loser && pick) {
      return { winner, loser, pick, left, right };
    }
  };
}
