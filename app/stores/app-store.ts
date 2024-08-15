"use client";

import { action, makeObservable, observable, runInAction } from "mobx";
import { DBStore } from "./db-store";
import { NewData, Page } from "../types";
import { List } from "./list";

export class AppStore {
  db = new DBStore();

  listsLoaded = false;
  lists: List[] = [];

  page: Page = "landing";
  currentList: List | undefined = undefined;

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
    const lists = data.map((datum) => new List(datum));

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
    const list = new List(data);
    runInAction(() => {
      this.lists.push(list);
    });
    return list;
  };

  saveList = async (list: List): Promise<void> => {
    const data = list.exportList();
    await this.db.update(data);
  };

  goToList = (list: List) => {
    this.currentList = list;
    this.page = "sorting";
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
    list.shuffle();
    this.saveList(list);
  };

  returnToLanding = () => {
    this.currentList = undefined;
    this.page = "landing";
  };
}
