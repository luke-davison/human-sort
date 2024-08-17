import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction
} from "mobx";
import { Comparison, ComparisonData, Data, Item, SortType } from "../types";
import { AppStore } from "./app-store";

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
      removeItem: action
    });
  }

  importData = (data: Data) => {
    const items: Item[] = JSON.parse(data.items);
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

  addItem = async (item: Omit<Item, "id">) => {
    runInAction(() => {
      this.items.push({
        id: this.nextId,
        ...item
      });
    });
    this.appStore.db.update(this.exportList()).catch((x) => console.log(x));
  };

  removeItem = (item: Item) => {
    this.items = this.items.filter((existing) => existing.id !== item.id);
    this.appStore.db.update(this.exportList());
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
