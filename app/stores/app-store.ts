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
      lists: observable,
      currentList: observable,
      goToList: action,
      startNewList: action,
      startADummyList: action,
      returnToLanding: action,
      deleteList: action
    });
  }

  loadLists = async (): Promise<List[]> => {
    await this.db.init();

    const data = await this.db.getAll();
    const lists = data.map((datum) => new List(this, datum));

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
      items: "[]",
      comparisons: JSON.stringify([]),
      discarded: JSON.stringify([]),
      sortType: "tournament",
      ...rest
    });
    const list = new List(this, data);
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
    if (list.comparisons.length === 0) {
      list.shuffle();
    }
    this.currentList = list;
    this.page = "sorting";
  };

  startNewList = () => {
    this.page = "listing";
    this.createList("New list").then(
      action((list) => {
        this.currentList = list;
      })
    );
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

  deleteList = (list: List) => {
    this.db.delete(list.id);
    this.lists = this.lists.filter((existing) => existing.id !== list.id);
  };
}
