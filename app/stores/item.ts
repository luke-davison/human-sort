import { makeObservable, observable } from "mobx";
import { ItemData } from "../types";

export class Item {
  id: string;
  name: string;
  deleted?: boolean;
  image?: string;
  bggImage?: string;
  bggId?: string;
  bggYear?: string;

  constructor(data: ItemData) {
    this.id = data.id;
    this.name = data.name;
    this.deleted = data.deleted;
    this.image = data.image;
    this.bggImage = data.bggImage;
    this.bggId = data.bggId;
    this.bggYear = data.bggYear;

    makeObservable(this, {
      name: observable,
      deleted: observable,
      image: observable,
      bggImage: observable,
      bggId: observable,
      bggYear: observable
    });
  }

  export = (): ItemData => {
    return {
      id: this.id,
      name: this.name,
      deleted: this.deleted,
      image: this.image,
      bggId: this.bggId,
      bggImage: this.bggImage,
      bggYear: this.bggYear
    };
  };
}
