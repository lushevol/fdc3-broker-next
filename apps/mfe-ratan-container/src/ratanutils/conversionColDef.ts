import omit from "lodash/omit";
export const filterArray = (arr: string[], valueIsArray: string[]) => {
  const newArr: string[] = [];
  let isArray = false;
  arr.forEach((item: string) => {
    if (!isArray) {
      newArr.push(item);
      if (valueIsArray.includes(item)) {
        isArray = true;
      }
    }
  });
  return newArr;
};

export const conversionColDef = (
  businessFields: any,
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
      const keyArray = filterArray(indexedTerm.split("."), valueIsArray);
      if (lastArray !== JSON.stringify(keyArray)) {
        lastArray = JSON.stringify(keyArray);
        const headerName =
          businessTerm || keyArray[keyArray.length - 1].replace(/_/g, " ");
        if (colDefs) {
          config = {
            headerName,
            headerTooltip: headerName,
            field: indexedTerm,
            hide: colDefs.hide !== false,
            enableRowGroup: true,
            valueGetter: (params: any) => {
              let value = params.data;
              for (let i = 0, l = keyArray.length; i < l; i++) {
                const item = keyArray[i];
                if (i === keyArray.length - 1) {
                  return value ? value[item] : null;
                } else {
                  value = value && value[item] ? value[item] : null;
                }
              }
            },
            ...omit(colDefs, ["disabledFilter"]),
          };
        } else {
          config = {
            headerName,
            headerTooltip: headerName,
            enableRowGroup: true,
            field: indexedTerm,
            hide: true,
          };
        }
        newColDefs.push(config);
      }
    }
  });
  newColDefs.unshift({
    headerName: "Select",
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    sortable: false,
    filter: false,
    menuTabs: [],
    resizable: false,
    maxWidth: 42,
    minWidth: 42,
    hide: false,
    pinned: "left",
    lockPosition: true,
  });
  return newColDefs;
};
