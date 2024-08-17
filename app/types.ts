export interface Item {
  id: string;
  name: string;
  bggId?: string;
  bggYear?: string;
  bggImage?: string;
  deleted?: boolean;
}

export interface Comparison {
  left: Item;
  right: Item;
  pick: "l" | "r";
  winner: Item;
  loser: Item;
}

export interface ComparisonData {
  left: string;
  right: string;
  pick: "l" | "r";
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

export interface BggSearchItem {
  id: string;
  name: string;
  year: string | undefined;
}

export interface BoardGame extends BggSearchItem {
  image: string;
}
