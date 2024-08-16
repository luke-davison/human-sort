"use client";

import { XMLParser } from "fast-xml-parser";
import { BoardGame, SearchItem } from "../types";

const parser = new XMLParser({ ignoreAttributes: false });

interface ParsedXMLBoardGame {
  items: {
    item: {
      image: string;
    };
  };
}

interface ParsedXMLSearchItem {
  "@_id": string;
  name: {
    "@_value": string;
  };
  yearpublished?: {
    "@_value": string;
  };
}

interface ParsedXMLSearch {
  items: {
    item?: ParsedXMLSearchItem[];
  };
}
export class BggStore {
  convertParsedSearchItem = (item: ParsedXMLSearchItem): SearchItem => {
    return {
      id: item["@_id"],
      name: item.name["@_value"],
      year: item.yearpublished?.["@_value"]
    };
  };

  search = async (text: string): Promise<SearchItem[]> => {
    const response = await fetch(
      `https://boardgamegeek.com/xmlapi2/search?query=${text}&type=boardgame`
    );

    const textResult = await response.text();

    const output: ParsedXMLSearch = parser.parse(textResult);
    return output.items.item?.map(this.convertParsedSearchItem) ?? [];
  };

  get = async (item: SearchItem): Promise<BoardGame> => {
    const response = await fetch(
      `https://boardgamegeek.com/xmlapi2/thing?id=${item.id}`
    );

    const textResult = await response.text();

    const parsedResult: ParsedXMLBoardGame = parser.parse(textResult);

    return {
      ...item,
      image: parsedResult.items.item.image
    };
  };
}
