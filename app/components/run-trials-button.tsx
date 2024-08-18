import { observer } from "mobx-react";
import { SortStore } from "../stores/sort-store";
import { List } from "../stores/list";
import { AppStore } from "../stores/app-store";
import { Item } from "../types";

export const RunTrialsButton = observer(() => {
  const onClick = () => {
    const numOfTrials = 50;
    const listSize = 30;
    const resultsArr: number[] = [];

    const generateSortStore = () => {
      const appStore = {
        saveList: () => undefined,
        db: { update: () => undefined }
      } as unknown as AppStore;

      const items: Item[] = [];
      for (let i = 1; i <= listSize; i++) {
        items.push({ id: String(i), name: String(i) });
      }

      const list = new List(appStore, {
        id: 1,
        name: "trial",
        description: "",
        items: JSON.stringify(items),
        comparisons: JSON.stringify([]),
        sortType: "tournament"
      });

      list.shuffle();

      return new SortStore(appStore, list);
    };

    for (let i = 0; i < numOfTrials; i++) {
      const sortStore = generateSortStore();
      while (sortStore.choices) {
        const choiceA = sortStore.choices[0];
        const choiceB = sortStore.choices[1];
        sortStore.submit(
          choiceA,
          choiceB,
          Number(choiceA.id) > Number(choiceB.id) ? "l" : "r"
        );
      }
      console.log(sortStore.comparisons.length);
      resultsArr.push(sortStore.comparisons.length);
    }

    const arr = resultsArr.sort();
    const sum = arr.reduce((sum, num) => sum + num, 0);
    console.log("");
    console.log(sum / arr.length);
    console.log(arr);
  };

  return <button onClick={onClick}>Run trials</button>;
});
