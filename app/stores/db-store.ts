"use client";

import { Data } from "../types";

const DBNAME = "sortdb";
const STORENAME = "sorts";

export class DBStore {
  db: IDBDatabase | undefined;

  init = () => {
    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open(DBNAME, 1);

      request.onerror = () => {
        reject();
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        const objectStore = db.createObjectStore(STORENAME, {
          keyPath: "id",
          autoIncrement: true
        });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("description", "description", {
          unique: false
        });
        objectStore.createIndex("items", "items", { unique: false });
        objectStore.createIndex("sorttype", "sorttype", { unique: false });
        objectStore.createIndex("comparisons", "comparisons", {
          unique: false
        });
      };
    });
  };

  create = (data: Omit<Data, "id">) => {
    return new Promise<Data>((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(STORENAME, "readwrite");
        const objectStore = transaction.objectStore(STORENAME);

        const request = objectStore.add(data);
        request.onsuccess = () => {
          resolve({ ...data, id: Number(request.result) });
        };
        request.onerror = () => {
          reject("Create error");
        };
      } else {
        reject("No database");
      }
    });
  };

  update = (data: Data) => {
    return new Promise<Data>((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(STORENAME, "readwrite");
        const objectStore = transaction.objectStore(STORENAME);

        const requestUpdate = objectStore.put(data);
        requestUpdate.onsuccess = (event) => {
          resolve(data);
        };

        requestUpdate.onerror = () => {
          reject("Update error");
        };
      } else {
        reject("No database");
      }
    });
  };

  delete = (dataId: number) => {
    return new Promise<void>((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(STORENAME, "readwrite");
        const objectStore = transaction.objectStore(STORENAME);

        const request = objectStore.delete(dataId);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject("Delete error");
        };
      } else {
        reject("No database");
      }
    });
  };

  getAll = () => {
    return new Promise<Data[]>((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(STORENAME);
        const objectStore = transaction.objectStore(STORENAME);
        const all: IDBRequest<Data[]> = objectStore.getAll();

        all.onsuccess = () => {
          resolve(all.result);
        };

        all.onerror = () => {
          reject("getAll error");
        };
      } else {
        reject("No database");
      }
    });
  };
}
