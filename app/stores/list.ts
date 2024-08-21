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
    const comparisonData: ComparisonData[] = JSON.parse(data.comparisons);
    const comparisons: Comparison[] = comparisonData.map((comparisonData) => {
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

    this.name = data.name;
    this.description = data.description;
    this.sortType = data.sortType;
    this.items = items;
    this.comparisons = comparisons;
  };

  exportList = (): Data => {
    const comparisons: ComparisonData[] = this.comparisons.map(
      (comparison) => ({
        left: comparison.left.id,
        right: comparison.right.id,
        pick: comparison.pick
      })
    );

    return {
      id: this.data.id,
      name: this.name,
      description: this.description,
      sortType: this.sortType,
      items: JSON.stringify(this.items),
      comparisons: JSON.stringify(comparisons)
    };
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
}
