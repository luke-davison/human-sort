"use client";

import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction
} from "mobx";
import { AppStore } from "./app-store";
import { Comparison } from "../types";
import { List } from "./list";
import { Item } from "./item";

export class SortStore {
  constructor(private appStore: AppStore, public list: List) {
    makeObservable(this, {
      items: computed,
      comparisons: computed,
      initialRoundItems: computed,
      initialRound: computed,
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
      if (comparison.winner.id === item.id) {
        arr.push(comparison);
      }
      return arr;
    }, []);
  };

  get initialRoundItems(): Item[] {
    let powerOfTwo = 1;
    while (Math.pow(2, powerOfTwo) < this.items.length) {
      powerOfTwo++;
    }

    const remainder = this.items.length - Math.pow(2, powerOfTwo - 1);
    const size = this.items.length / remainder;

    const items: Item[] = [];
    for (let i = 0; i < remainder; i++) {
      const position = Math.floor(i * size);
      items.push(this.items[position]);
      items.push(this.items[position + 1]);
    }

    return items;
  }

  get initialRound(): Item[] {
    return this.initialRoundItems.filter((item) => {
      return this.comparisons.every(
        ({ winner, loser }) => loser.id !== item.id && winner.id !== item.id
      );
    });
  }

  get unbeatenItems() {
    const unsortedItems = this.items.filter((item) => {
      return this.comparisons.every(({ loser }) => loser.id !== item.id);
    });

    return unsortedItems.sort((itemA, itemB) => {
      let itemAWins = this.getWins(itemA).length;
      if (this.initialRoundItems.some((item) => item.id === itemA.id)) {
        itemAWins--;
      }
      let itemBWins = this.getWins(itemB).length;
      if (this.initialRoundItems.some((item) => item.id === itemB.id)) {
        itemBWins--;
      }

      return itemAWins - itemBWins;
    });
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
      unprunedTreeWins.every(({ loser }) => loser.id !== treeItem.id)
    );
  };

  get choices(): Item[] | undefined {
    if (this.initialRound.length) {
      const choiceA = this.initialRound[0];
      const choiceB = this.initialRound[1];
      if (choiceA && choiceB) return [choiceA, choiceB];
    } else if (this.unbeatenItems.length > 1) {
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

  submit = (left: Item, right: Item, pick: "l" | "r") => {
    runInAction(() => {
      const winner = pick === "l" ? left : right;
      const loser = pick === "l" ? right : left;
      this.list.comparisons.push({ winner, loser, pick, left, right });
    });

    const newChoiceA = this.choices?.[0];
    const newChoiceB = this.choices?.[1];

    if (newChoiceA && newChoiceB) {
      const existingComparison = this.list.getComparisonFromDiscarded(
        newChoiceA,
        newChoiceB
      );

      if (existingComparison) {
        const { left, right, pick } = existingComparison;
        this.submit(left, right, pick);
        return;
      }
    }

    this.appStore.saveList(this.list);
  };

  undo = () => {
    this.list.comparisons.pop();
    this.appStore.saveList(this.list);
  };

  redoResult = (item: Item) => {
    const firstComparisonIndex = this.comparisons.findIndex(
      (comparison) =>
        comparison.left.id === item.id || comparison.right.id === item.id
    );
    if (firstComparisonIndex !== -1) {
      const discarded = this.comparisons
        .splice(firstComparisonIndex)
        .filter(
          (comparison) =>
            comparison.left.id !== item.id && comparison.right.id !== item.id
        );
      discarded.forEach((comparison) =>
        this.list.discarded.add(
          this.list.getDiscardedKey(comparison.winner, comparison.loser)
        )
      );
    }
  };
}
