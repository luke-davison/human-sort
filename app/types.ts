export interface Item {
  key: string;
  label: string;
}

export interface Comparison {
  winner: Item;
  loser: Item;
}

export interface List {
  id: number;
  name: string;
  description: string;
  items: Item[];
  comparisons: Comparison[];
  sortType: SortType;
}

export interface Data {
  id: number;
  name: string;
  description: string;
  items: string;
  comparisons: string;
  sortType: SortType;
}

export type NewData = Omit<Data, "id">;

export type SortType = "tournament";

export type Page = "landing" | "listing" | "dummying" | "sorting" | "uploading";
