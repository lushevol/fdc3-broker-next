import { ColDef } from "ag-grid-community";
import set from "lodash/set";
import * as cnvColDef from "./conversionColDef";
import * as cnvOneDef from "./conversionOneField";
import * as cnvViewDef from "./conversionViewOptions";

export const { conversionColDef, filterArray } = cnvColDef;
export const { NEED_TO_SET_ALL_FIELDS, conversionOneField } = cnvOneDef;
export const { conversionViewOptions } = cnvViewDef;

interface ConfigurableFieldsDef extends ColDef {
  headerCheckboxSelection?: boolean;
}

export const getConfigurableFields = (columnDef: ColDef[]) => {
  const field: ConfigurableFieldsDef[] = columnDef.map((item: ColDef) => {
    return {
      headerName: item.headerName,
      field: item.field,
      hide: !!item.hide,
    };
  });
  columnDef.unshift({
    headerName: "",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    sortable: false,
    menuTabs: [],
    resizable: false,
    maxWidth: 42,
    minWidth: 42,
    hide: false,
    pinned: "left",
    lockPosition: true,
  });
  return field;
};

const conversionObj = (item) => {
  let itemResult: any = {};
  for (const key in item) {
    const value = item[key];
    if (value && typeof value === "object") {
      itemResult = { ...itemResult, ...conversionJson(value) };
    } else {
      itemResult[key] = value;
    }
  }
  return itemResult;
};

export const conversionJson = (Json: any) => {
  if (Array.isArray(Json)) {
    let result: any = null;
    Json.forEach((item: any) => {
      if (Object.prototype.toString.call(item) === "[object Object]") {
        result = { ...(result || {}), ...conversionObj(item) };
      } else if (Array.isArray(item)) {
        result = [...(result || []), ...[conversionJson(item)]];
      }
    });
    return result;
  } else if (Object.prototype.toString.call(Json) === "[object Object]") {
    let result: any = conversionObj(Json);
    return result;
  }
  return Json;
};

export const DEPENDENT_FIELDS: MapType = {
  Direction: [
    "Forward_Future_Instrument.Exchanged_Currency1_Payment_Amount_Currency",
    "Forward_Future_Instrument.Exchanged_Currency2_Payment_Amount_Currency",
    "Forward_Future_Instrument.Exchanged_Currency1_Receiver_Party_Reference",
    "Forward_Future_Instrument.Exchanged_Currency2_Receiver_Party_Reference",
    "Forward_Future_Instrument.Exchanged_Currency1_Payer_Party_Reference",
    "Forward_Future_Instrument.Exchanged_Currency2_Payer_Party_Reference",
    "Cash_Financial_Instrument.Exchanged_Currency1_Payment_Amount_Currency",
    "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount_Currency",
    "Cash_Financial_Instrument.Exchanged_Currency1_Receiver_Party_Reference",
    "Cash_Financial_Instrument.Exchanged_Currency2_Receiver_Party_Reference",
    "Cash_Financial_Instrument.Exchanged_Currency1_Payer_Party_Reference",
    "Cash_Financial_Instrument.Exchanged_Currency2_Payer_Party_Reference",
  ],
  "Entity.Person.Trader_PSID": ["Entity.Person.Trader_Source_System_Person_Id"],
  "Entity.Person.Execution_Marketer_PSID": [
    "Entity.Person.Execution_Marketer_Source_System_Person_Id",
  ],
  "Entity.Person.Coverage_Marketer_PSID": [
    "Entity.Person.Coverage_Marketer_Source_System_Person_Id",
  ],
  "Entity.Person.Booking_Marketer_PSID": [
    "Entity.Person.Booking_Marketer_Source_System_Person_Id",
  ],
  Pending_Trade_Review: ["TP_System_Capture_Timestamp"],
};

interface ConversionDQSLRequestProps {
  businessFields: any;
  isAllFields: boolean;
  instrumentConfig?: any;
  MANDATORY_FIELDS?: any;
}
export const conversionDQSLRequest = ({
  businessFields,
  isAllFields,
  instrumentConfig,
  MANDATORY_FIELDS,
}: ConversionDQSLRequestProps) => {
  const results: MapType = {};
  businessFields.forEach((item: any) => {
    if (!isAllFields) {
      if (DEPENDENT_FIELDS[item.indexedTerm]) {
        DEPENDENT_FIELDS[item.indexedTerm].forEach((subItem: string) => {
          conversionOneField(results, subItem, isAllFields);
        });
      }

      MANDATORY_FIELDS?.forEach((subItem: string) => {
        conversionOneField(results, subItem, isAllFields);
      });
    }
    /**
     * @auth Tech and Liang
     * @description Trade Review Ignore Quere TDS3: Pending_Trade_Review / Exclude_Validated_Expired_Trade
     */
    if (
      item.indexedTerm !== "Select" &&
      item.indexedTerm !== "Direction" &&
      item.indexedTerm !== "MTM" &&
      item.indexedTerm !== "Pending_Trade_Review" &&
      item.indexedTerm !== "Exclude_Validated_Expired_Trade"
    ) {
      conversionOneField(
        results,
        item.indexedTerm,
        isAllFields,
        instrumentConfig
      );
    }
  });

  let res = JSON.stringify(results).replace(/"|:/g, "");
  res = res.substring(1, res.length - 1);
  return res;
};

export const conversionGroup = (data: any[]) => {
  const addTradeList: any[] = [];
  const addTradeListIds: string[] = [];

  data.forEach((item: any, index: number) => {
    item.group = [item["Trade_Id"]];
    item.id = item["Trade_Id"];
    addTradeList.push(item);
    addTradeListIds.push(item["Trade_Id"]);
    item.Physical_Status =
      item.Physical_Status === null ? "" : item.Physical_Status;

    if (item["Versions"] && item["Versions"].length > 0) {
      const subItemVersions = item["Versions"];
      subItemVersions.forEach((subItem: any, index: number) => {
        const id = `${subItem["Trade_Id"]}-${getRealVersionOfTrade(
          subItem
        )}-index${index}`;
        subItem.group = [item["Trade_Id"], id];
        subItem.id = id;
        addTradeList.push(subItem);
      });
    }
  });

  return {
    addTradeList,
    addTradeListIds,
  };
};
/**
 * @auth Tech
 * @description new handler to replace conversionGroup() will export none-repeate Id
 */
export const conversionGroupNoneRepeatId = (data: any[]) => {
  const addTradeList: any[] = [];
  const addTradeListIds: string[] = [];

  data.forEach((item: any, index: number) => {
    const tradeIdNoneRepeat = `${item.Trade_Id}-${index}`;
    item.group = [item["Trade_Id"]];
    item.id = tradeIdNoneRepeat;
    addTradeList.push(item);
    addTradeListIds.push(tradeIdNoneRepeat);
    item.Physical_Status =
      item.Physical_Status === null ? "" : item.Physical_Status;

    if (item["Versions"] && item["Versions"].length > 0) {
      const subItemVersions = item["Versions"];
      subItemVersions.forEach((subItem: any, index: number) => {
        const id = `${subItem["Trade_Id"]}-${getRealVersionOfTrade(
          subItem
        )}-index${index}`;
        subItem.group = [item["Trade_Id"], id];
        subItem.id = id;
        addTradeList.push(subItem);
      });
    }
  });

  return {
    addTradeList,
    addTradeListIds,
  };
};

const pushItem = (keys: any, field: any) => {
  const length = keys.length;
  const options: any = [];
  keys.forEach((item: any, index: any) => {
    if (index < length - 1) {
      keys.shift();
      options.push({
        label: item.replace(/_/g, " "),
        value: item,
        children: pushItem(keys, field),
      });
    } else {
      options.push({
        label: field.businessTerm
          ? field.businessTerm
          : item.replace(/_/g, " "),
        value: item,
        context: field.context,
        blotterContext: field.blotterContext,
        type: field.displayStyle,
        operatorsSupp: field.operatorsSupp,
        valueList: field.valueList,
        indexedTerm: field.indexedTerm,
      });
    }
  });
  return options;
};

export const convertArray = (config: any, workspace: string) => {
  const result: any[] = [];
  config.forEach((item: any) => {
    if (
      item.disabledPages
        ? !item.disabledPages.includes(workspace)
        : (Array.isArray(item.disabledFilter) &&
            !item.disabledFilter.includes(workspace)) ||
          !item.disabledFilter
    ) {
      const indexedTermArray = item.indexedTerm.split(".");
      const l = indexedTermArray.length;
      const m = l - 4;
      if (l > 5) {
        indexedTermArray.push(indexedTermArray.splice(4, m).join("."));
      }

      result.push(pushItem(indexedTermArray, item));
    }
  });

  return result;
};

const convertResult = (result: any, config: any) => {
  result?.forEach((item: any) => {
    let hasKey = false;
    for (let i = 0, l = config.length; i < l; i++) {
      if (config[i].value === item.value) {
        hasKey = true;
        convertResult(item.children, config[i].children);
        break;
      }
    }

    if (!hasKey) {
      config.push(item);
    }
  });
};

export const conversionCascaderOptions = (config: any, workspace = "All") => {
  const result = convertArray(config, workspace);
  const newConfig: any = [
    {
      label: "-- Add Filter --",
      value: "",
    },
    {
      label: "Trade Detail",
      value: "TRADEDETAIL",
      children: [],
    },
    {
      label: "Cashflow Detail",
      value: "CASHFLOWDETAIL",
      children: [],
    },
  ];
  if (workspace === "trade") {
    newConfig.pop();
  }

  result.forEach((item: any) => {
    if (!item[0].children) {
      if (item[0].context?.includes("TRANSACTION_DATA")) {
        newConfig[1].children.push(item[0]);
      } else if (item[0].context?.includes("CASHFLOW_DATA") && newConfig[2]) {
        newConfig[2].children.push(item[0]);
      }
    } else {
      convertResult(item, newConfig);
    }
  });

  newConfig.sort((a: any, b: any) => {
    return a.label < b.label ? -1 : 1;
  });

  return newConfig;
};

const valueIsArray = ["FMO_Comments"];
export const conversionGraphqlErrorField = (res: any) => {
  res.errors.forEach((item: any) => {
    const pathArray = item.path;
    const dataResultsArray = res.data.trades
      ? res.data.trades.results
      : res.data.cashflows?.results;

    pathArray.forEach((item1: any) => {
      valueIsArray.forEach((item2: any) => {
        if (item1.includes(item2)) {
          item1 = item2;
        }
      });
      dataResultsArray?.forEach((item3: any) => {
        set(item3, item1, "<ERROR>");
      });
    });
  });
  return res;
};

export const sortBusinessFields = (data: any) => {
  const newArr1: any = [];
  const newArr2: any = [];

  data.forEach((item: any) => {
    const { index } = item;
    if (index) {
      newArr1.push(item);
    } else {
      newArr2.push(item);
    }
  });
  const newArr3 = newArr1.sort((a: any, b: any) => {
    return a.index < b.index ? -1 : 1;
  });
  return [...newArr3, ...newArr2];
};

export const getDisplayFields = (
  columns: any[],
  MANDATORY_FIELDS?: string[]
) => {
  const fields: any[] = [];
  columns.forEach((item: any) => {
    if (item.field) {
      fields.push({ indexedTerm: item.field });
    } else if (item.colDef.field) {
      fields.push({ indexedTerm: item.colDef.field });
    } else if (item.colDef.showRowGroup) {
      fields.push({ indexedTerm: item.colDef.showRowGroup });
    }
  });

  return conversionDQSLRequest({
    businessFields: fields,
    isAllFields: false,
    MANDATORY_FIELDS,
  });
};

export const conversionResult = (fieldArray: string[]) => {
  const results: MapType = {};
  const isAllFields = false;
  fieldArray?.forEach((subItem: string) => {
    conversionOneField(results, subItem, isAllFields);
  });

  let res = JSON.stringify(results).replace(/"|:/g, "");
  res = res.substring(1, res.length - 1);
  return res;
};

export const getRealVersionOfTrade = (data: any) => {
  const version =
    typeof data.Tracking_Version == "string" ||
    typeof data.Tracking_Version == "number"
      ? data.Tracking_Version
      : data.Trade_Version;
  if (typeof version === "number") {
    return version.toString();
  }
  return version;
};

export const getRealIdOfTrade = (data: any) => {
  return data.Trade_Id?.includes("BCS_") ? data.BCS_Trade_Id : data.Trade_Id;
};

export const getRealIdOfParentTrade = (data: any) => {
  return data.Parent_Trade_Id?.includes("BCS_")
    ? data.BCS_Parent_Trade_Id
    : data.Parent_Trade_Id;
};

export function setCustomFields(config: any, colDefsMapping: MapType) {
  const newConfig: MapType = {};
  if (config) {
    Object.keys(config).forEach((field: any) => {
      const item = config[field];
      if (item.colDefs) {
        for (const key in item.colDefs) {
          const colValue = item.colDefs[key];
          if (typeof colValue === "string") {
            if (colDefsMapping[key] && colDefsMapping[key][colValue]) {
              item.colDefs[key] = colDefsMapping[key][colValue];
            }
          } else if (colValue?.handleFunction) {
            item.colDefs[key] = colDefsMapping[key][
              colValue.handleFunction
            ].bind(null, colValue.params);
          }
        }
      }
      newConfig[field] = item;
    });
  }

  return newConfig;
}

export const getTrader = ({ data }: any) => {
  return (
    data?.Entity?.Person?.Trader_PSID ||
    data?.Entity?.Person?.Trader_Source_System_Person_Id
  );
};

export const getCoverageMarketer = ({ data }: any) => {
  return (
    data?.Entity?.Person?.Coverage_Marketer_PSID ||
    data?.Entity?.Person?.Coverage_Marketer_Source_System_Person_Id
  );
};

export const getBookingMarketer = ({ data }: any) => {
  return (
    data?.Entity?.Person?.Booking_Marketer_PSID ||
    data?.Entity?.Person?.Booking_Marketer_Source_System_Person_Id
  );
};

export const getExecutionMarketer = ({ data }: any) => {
  return (
    data?.Entity?.Person?.Execution_Marketer_PSID ||
    data?.Entity?.Person?.Execution_Marketer_Source_System_Person_Id
  );
};

const handleData = (data: any) => {
  const dataJson: MapType = {};
  const handleCombine = (field: string, data: any) => {
    Object.keys(data).forEach((item) => {
      const newField = field ? `${field}.${item}` : item;
      let value = data[item];
      if (Object.prototype.toString.call(value) === "[object Object]") {
        handleCombine(newField, value);
      } else {
        dataJson[newField] = value;
      }
    });
  };
  handleCombine("", data);

  return dataJson;
};

export const handleCombineData = (data: any, details: any) => {
  const newData = handleData(details);
  const combineFields: string[] = [];
  ratanConfig.trades.customSearchFilter.forEach((item: any) => {
    const dataIndex = data.findIndex(
      (subItem: any) => subItem.id === item.field
    );
    combineFields.push(item.combineField);
    if (newData[item.combineField]) {
      if (dataIndex < 0) {
        const fieldArray = item.field.split(".");
        data.push({
          id: item.field,
          key: fieldArray[fieldArray.length - 1],
          version: newData[item.combineField],
          group: fieldArray[fieldArray.length - 2].toUpperCase(),
        });
      } else {
        data[dataIndex].version =
          data[dataIndex].version || newData[item.combineField];
      }
    }
  });

  return data.filter((subItem: any) => !combineFields.includes(subItem.id));
};
