"use client";

import { action, computed, makeObservable, observable } from "mobx";
import { AppStore } from "./app-store";
import { Comparison, Item } from "../types";
import { List } from "./list";

export class SortStore {
  constructor(private appStore: AppStore, public list: List) {
    makeObservable(this, {
      items: computed,
      comparisons: computed,
      unbeatenItems: computed,
      results: computed,
      choices: computed,
      submit: action,
      undo: action
    });
  }

  get items() {
    return this.list.items;
  }

  get comparisons() {
    return this.list.comparisons;
  }

  getWins = (item: Item): Comparison[] => {
    return this.comparisons.reduce((arr: Comparison[], comparison) => {
      if (comparison.winner.key === item.key) {
        arr.push(comparison);
      }
      return arr;
    }, []);
  };

  get unbeatenItems() {
    const unsortedItems = this.items.filter((item) => {
      return this.comparisons.every(({ loser }) => loser.key !== item.key);
    });

    return unsortedItems.sort(
      (itemA, itemB) => this.getWins(itemA).length - this.getWins(itemB).length
    );
  }

  get results(): Item[] {
    const output: Item[] = [];

    if (this.unbeatenItems.length === 1) {
      output.push(this.unbeatenItems[0]);

      for (let index = 1; index < this.items.length; index++) {
        const tree = this.getTree(output[output.length - 1]);
        if (tree.length === 1) {
          output.push(tree[0]);
        } else {
          return output;
        }
      }
    }

    return output;
  }

  getTree = (item: Item): Item[] => {
    const unprunedTree = this.getWins(item).map((branch) => branch.loser);
    const unprunedTreeWins = unprunedTree
      .map((treeItem) => this.getWins(treeItem))
      .flat();
    return unprunedTree.filter((treeItem) =>
      unprunedTreeWins.every(({ loser }) => loser.key !== treeItem.key)
    );
  };

  get choices(): Item[] | undefined {
    if (this.unbeatenItems.length > 1) {
      const choiceA = this.unbeatenItems[0];
      const choiceB = this.unbeatenItems[1];
      if (choiceA && choiceB) return [choiceA, choiceB];
    } else {
      const tree = this.getTree(this.results[this.results.length - 1]);
      const choiceA = tree[0];
      const choiceB = tree[1];
      if (choiceA && choiceB) return [choiceA, choiceB];
    }
  }

  submit = (winner: Item, loser: Item) => {
    this.list.comparisons.push({ winner, loser });
    this.appStore.saveList(this.list);
  };

  undo = () => {
    this.list.comparisons.pop();
    this.appStore.saveList(this.list);
  };
}
