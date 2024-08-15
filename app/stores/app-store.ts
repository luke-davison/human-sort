import { action, makeObservable, observable, runInAction } from "mobx";
import { DBStore, DIVIDER_CHAR, SPLIT_CHAR } from "./db-store";
import { Comparison, Data, Item, List, NewData, Page } from "../types";

export class AppStore {
  db = new DBStore();

  listsLoaded = false;
  lists: List[] = [];

  page: Page = "landing";
  currentList: List | undefined;

  constructor() {
    this.loadLists();

    makeObservable(this, {
      listsLoaded: observable,
      page: observable,
      currentList: observable,
      goToList: action,
      startNewList: action,
      startADummyList: action,
      returnToLanding: action
    });
  }

  loadLists = async (): Promise<List[]> => {
    await this.db.init();

    const data = await this.db.getAll();
    const lists = data.map(this.convertDataToList);

    runInAction(() => {
      this.lists = lists;
      this.listsLoaded = true;
    });

    return lists;
  };

  createList = async (name: string, rest?: Partial<NewData>): Promise<List> => {
    const data = await this.db.create({
      name,
      description: "",
      items: "",
      comparisons: "",
      sortType: "tournament",
      ...rest
    });
    const list = this.convertDataToList(data);
    runInAction(() => {
      this.lists.push(list);
    });
    return list;
  };

  saveList = async (list: List): Promise<void> => {
    const data = this.convertListToData(list);
    await this.db.update(data);
  };

  convertDataToList = (data: Data): List => {
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

    return {
      ...data,
      items,
      comparisons
    };
  };

  convertListToData = (list: List): Data => {
    const highestKey = list.items.reduce((acc, item) => {
      return Number(item.key) > acc ? Number(item.key) : acc;
    }, 0);

    let items: string = "";

    for (let i = 1; i <= highestKey; i++) {
      const item = list.items.find((item) => item.key === String(i));
      items += `${item?.key ?? ""}${DIVIDER_CHAR}`;
    }

    const comparisons: string = list.comparisons
      .map(
        (comparison) =>
          `${comparison.winner.key}${SPLIT_CHAR}${comparison.loser.key}`
      )
      .join(DIVIDER_CHAR);

    return {
      ...list,
      items,
      comparisons
    };
  };

  goToList = (list: List) => {
    this.currentList = list;
    this.page = "listing";
  };

  startNewList = () => {
    this.page = "listing";
  };

  startADummyList = () => {
    this.page = "dummying";
  };

  selectADummyList = async (data: NewData) => {
    const list = await this.createList(data.name, data);
    runInAction(() => {
      this.currentList = list;
      this.page = "sorting";
    });
  };

  returnToLanding = () => {
    this.currentList = undefined;
    this.page = "landing";
  };
}
