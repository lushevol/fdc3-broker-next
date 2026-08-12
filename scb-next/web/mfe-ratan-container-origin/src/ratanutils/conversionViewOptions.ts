import { filterArray } from "./conversionColDef";

export const conversionViewOptions = (
  businessFields: any,
  isTrade: boolean,
  workspace = "All",
  valueIsArray: string[] = []
) => {
  const newColDefs: any = [];

  let lastArray = "";
  businessFields.forEach((item: any) => {
    const { colDefs, indexedTerm, businessTerm, disabledView } = item;

    if (
      (Array.isArray(disabledView) && !disabledView.includes(workspace)) ||
      !disabledView
    ) {
      let config: any;
      const newArr = filterArray(indexedTerm.split("."), valueIsArray);
      if (lastArray !== JSON.stringify(newArr)) {
        lastArray = JSON.stringify(newArr);
        if (colDefs) {
          config = {
            headerName:
              businessTerm || newArr[newArr.length - 1].replace(/_/g, " "),
            field: indexedTerm,
            hide: colDefs.hide !== false,
            colDefs,
            group:
              newArr.length === 1
                ? isTrade
                  ? "Trade Detail"
                  : "Cashflow Detail"
                : newArr.length > 1
                ? newArr[0]
                : "Others",
          };
        } else {
          config = {
            headerName:
              businessTerm || newArr[newArr.length - 1].replace(/_/g, " "),
            field: indexedTerm,
            hide: true,
            group:
              newArr.length === 1
                ? isTrade
                  ? "Trade Detail"
                  : "Cashflow Detail"
                : newArr.length > 1
                ? newArr[0]
                : "Others",
          };
        }
        newColDefs.push(config);
      }
    }
  });

  const map = new Map();
  const valuesBuffer: any = [];
  newColDefs.forEach((item: any) => {
    if (!(item.colDefs && item.colDefs.pinned)) {
      if (map.has(item.group)) {
        const arr = map.get(item.group);
        arr.push(item);
        map.set(item.group, arr);
      } else {
        const len = valuesBuffer.push([item]);
        map.set(item.group, valuesBuffer[len - 1]);
      }
    }
  });

  // sort in alphabetical order by headerName field
  valuesBuffer.forEach((arr: Array<any>) => {
    arr.sort((first, second) =>
      first.headerName > second.headerName ? 1 : -1
    );
  });

  return map;
};
