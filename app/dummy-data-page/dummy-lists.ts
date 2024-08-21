"use client";

import { Item } from "../stores/item";
import { NewData } from "../types";

const numbersListItems: Item[] = [];

for (let i = 1; i <= 10; i++) {
  numbersListItems.push(new Item({ id: String(i), name: String(i) }));
}

const numbersList: NewData = {
  name: "Numbers",
  description:
    "Sort the numbers from 1 to 50.  Highest to lowest or lowest to highest - your choice",
  items: JSON.stringify(numbersListItems),
  comparisons: JSON.stringify([]),
  discarded: JSON.stringify([]),
  sortType: "tournament"
};

const moreNumbersListItems: Item[] = [];

const fourHundredNumbers: number[] = [];

for (let i = 1; i <= 400; i++) {
  fourHundredNumbers.push(i);
}

for (let i = 1; i <= 100; i++) {
  const index = Math.floor(Math.random() * fourHundredNumbers.length);
  const num = fourHundredNumbers.splice(index, 1)[0];
  moreNumbersListItems.push(new Item({ id: String(num), name: String(num) }));
}

const moreNumbersList: NewData = {
  name: "More numbers",
  description: "Is 50 not enough? How about going for 100!",
  items: JSON.stringify(moreNumbersListItems),
  comparisons: JSON.stringify([]),
  discarded: JSON.stringify([]),
  sortType: "tournament"
};

export const dummyLists: NewData[] = [numbersList, moreNumbersList];
