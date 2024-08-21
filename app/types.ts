import { Item } from "./stores/item";

export interface ItemData extends Partial<Omit<BoardGame, "name">> {
  id: string;
  name: string;
  image?: string;
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
  discarded: string;
}

export type NewData = Omit<Data, "id">;

export type SortType = "tournament";

export type Page = "landing" | "listing" | "dummying" | "sorting" | "uploading";

export interface BggSearchItem {
  bggId: string;
  name: string;
  bggYear: string | undefined;
}

export interface BoardGame extends BggSearchItem {
  bggImage: string;
}
