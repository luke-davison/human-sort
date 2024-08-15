"use client";

import { DIVIDER_CHAR } from "../stores/db-store";
import { Data, NewData } from "../types";

const numbersList: NewData = {
  name: "Numbers",
  description:
    "Sort the numbers from 1 to 50.  Highest to lowest or lowest to highest - your choice",
  items: "",
  comparisons: "",
  sortType: "tournament"
};

for (let i = 1; i <= 50; i++) {
  numbersList.items += `${i}${DIVIDER_CHAR}`;
}

const moreNumbersList: NewData = {
  name: "More numbers",
  description: "Is 50 not enough? How about going for 100!",
  items: "",
  comparisons: "",
  sortType: "tournament"
};

for (let i = 1; i <= 100; i++) {
  moreNumbersList.items += `${i}${DIVIDER_CHAR}`;
}

export const dummyLists: NewData[] = [numbersList, moreNumbersList];
