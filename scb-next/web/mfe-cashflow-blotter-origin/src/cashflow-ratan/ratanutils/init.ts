import { useEffect, useState } from "react";
import { message, notification } from "antd";
import { Time } from "../Root/import/index";
import { CommonUtil } from "../Root/import";

/**
 * @author Tech: move field config to application level
 */
// import { cashflowCustomFields } from "./config/ratancashflow/fieldsConfig";

import {
  getBusinessFieldsVersion,
  getBusinessFieldsVersionFromRuleService,
  getBusinessFieldsTrade,
  getBusinessFieldsCashflow,
  getBusinessFieldsCashflowFromRuleService,
} from "./http/api";

import { priceCellFormatterWithComma } from "./utils";
import { triggerError, FIELDS_CONFIG_NOT_AVAILABLE } from "./handleError";

export const getParent = () => {
  const { getSessionStorage } = CommonUtil;
  const initPayload = getSessionStorage().getItem("initPayload");
  return JSON.parse(initPayload || "{}").parent || {};
};

export const useParentData = () => {
  const [isInitComplete, setIsInitComplete] = useState(false);
  const { getSessionStorage } = CommonUtil;
  useEffect(() => {
    // when logout, refresh tile or refresh whole page, will remove getSessionStorage() rosseta fields.
    getSessionStorage().removeItem("businessFieldsTrade");
    getSessionStorage().removeItem("businessFieldsCashflow");
    getSessionStorage().removeItem("businessFieldsCashflowCN");

    setIsInitComplete(true);
  }, []);

  return {
    isInitComplete,
  };
};

export const replaceField = (array: any, businessTerm: any) => {
  if (businessTerm) {
    const length = array.length;
    if (length > 5) {
      array.splice(4, length - 4, businessTerm);
    } else {
      array[length - 1] = businessTerm;
    }
  }
};

export const compareArrayLength = (arrayA: any, arrayB: any) => {
  for (let i = 0, l = arrayA.length; i < l; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return arrayA[i] < arrayB[i];
    }
  }
};

export const sortAsAlphabeticalOrder = (params: any) => {
  const customSort = (params: any) => {
    return params.sort((a: any, b: any) => {
      const arrayA = a.indexedTerm.split(".");
      const arrayB = b.indexedTerm.split(".");
      replaceField(arrayA, a.businessTerm);
      replaceField(arrayB, b.businessTerm);
      return compareArrayLength(arrayA, arrayB) ? -1 : 1;
    });
  };

  return params ? customSort(params) : params;
};

export const handleTime = (props: any) => {
  const { value, isAccurateToDay = false } = props;
  const { isDate, getLocalStorage, formatDate, formatDateToISO } = CommonUtil;

  let newIsAccurateToDay = isAccurateToDay;
  const regez = /^\d{4}-\d{2}-\d{2}$/;

  if (value === "null") return null;

  if (isDate(value) && (`${value}`.includes("00:00:00") || regez.test(value))) {
    newIsAccurateToDay = true;
  }

  return getLocalStorage().getItem("SET_TIME_TYPE")?.toUpperCase() === "LOCAL"
    ? formatDate(value, newIsAccurateToDay)
    : formatDateToISO(value, newIsAccurateToDay);
};

const timeType = ["DateTime", "Date", "DATE-FORMA", "Time"];
export const mergeFields = (
  currentFields: any,
  customFields: any,
  isDateFormater: boolean
) => {
  if (currentFields?.fields) {
    return currentFields.fields.map((item: any) => {
      const customConfig = customFields[item.indexedTerm];
      if (customConfig) {
        return { ...item, ...customConfig };
      } else if (timeType.includes(item.dataType)) {
        return {
          ...item,
          colDefs: isDateFormater
            ? { valueFormatter: handleTime }
            : { cellRenderer: Time },
        };
      }
      return { ...item };
    });
  } else {
    return currentFields;
  }
};

export const autoRefreshFields = async (
  storageKey: string,
  customFields: any,
  params: string,
  isDateFormater,
  getBusinessFields: Function,
  getBusinessFieldsLatestVersion: Function
) => {
  // if exist in session, use session's directly
  const { getLocalStorage, getSessionStorage, storeData } = CommonUtil;
  if (getSessionStorage().getItem(storageKey)) {
    const sessionFields: any = JSON.parse(
      getSessionStorage().getItem(storageKey) as string
    );
    const fields = mergeFields(sessionFields, customFields, isDateFormater);

    if (fields.length === 0) {
      triggerError(FIELDS_CONFIG_NOT_AVAILABLE);
    }

    return fields;
  } else if (getLocalStorage().getItem(storageKey)) {
    // if exist in localstorage, check active version, if valid, use local's directly, and put in session, otherwise get the latest version and restore it.
    const localFields: any = JSON.parse(
      getLocalStorage().getItem(storageKey) as string
    );
    try {
      // if fields version respond successfully
      const versionRes: any = await getBusinessFieldsLatestVersion();
      if (
        localFields.version.fieldsConfig ===
          versionRes.ratan_suppression_fields_config.activedVersion &&
        localFields.version.fields ===
          versionRes.ratan_suppression_fields.activedVersion
      ) {
        getSessionStorage().setItem(
          storageKey,
          getLocalStorage().getItem(storageKey) as string
        );
        return mergeFields(localFields, customFields, isDateFormater);
      }
    } catch (error) {
      // if response failed, still use data in localstorage
      message.error(
        "Unable to fetch latest field list from server, use local cache instead."
      );
      getSessionStorage().setItem(
        storageKey,
        getLocalStorage().getItem(storageKey) as string
      );
      return mergeFields(localFields, customFields, isDateFormater);
    }
  }

  // else get from back-end
  const res: any = await getBusinessFields(params);
  sortAsAlphabeticalOrder(res.fields);
  storeData(storageKey, JSON.stringify(res));
  getSessionStorage().setItem(storageKey, JSON.stringify(res));

  return mergeFields(res, customFields, isDateFormater);
};

function filterDisabledFields(fields: any, flag) {
  return fields.filter((item) => {
    const scope = JSON.parse(item.scope);
    return !scope.disabledBlotter.includes(flag);
  });
}

export const getBusinessFieldsFromCacheNext = async (
  workspace: { source: string; flag: string },
  defaultFields: any = {},
  tradesCustomFields: any = {}
) => {
  if (workspace.source === "trade") {
    const tradeFields = await autoRefreshFields(
      "businessFieldsTrade",
      tradesCustomFields,
      "TRANSACTION_DATA,CONFIRMATION_DATA",
      true,
      getBusinessFieldsTrade,
      getBusinessFieldsVersion
    );

    return {
      tradeFields: filterDisabledFields(tradeFields, workspace.flag),
    };
  } else if (workspace.source === "cashflow") {
    const cashflowAndTradeFields = await autoRefreshFields(
      "businessFieldsCashflow",
      defaultFields,
      "TRANSACTION_DATA,CASHFLOW_DATA",
      false,
      getBusinessFieldsCashflow,
      getBusinessFieldsVersion
    );
    const cashflowFields = filterDisabledFields(
      cashflowAndTradeFields,
      workspace.flag
    ).filter((item: any) => {
      if (item.blotterContext) {
        return item.blotterContext?.includes("CASHFLOW_DATA");
      }
      return item.context?.includes("CASHFLOW_DATA");
    });
    return {
      cashflowFields,
      cashflowAndTradeFields,
    };
  } else if (workspace.source === "cashflowCN") {
    const cashflowAndTradeFields = await autoRefreshFields(
      "businessFieldsCashflowCN",
      defaultFields,
      "TRANSACTION_DATA,CASHFLOW_DATA",
      false,
      getBusinessFieldsCashflowFromRuleService,
      getBusinessFieldsVersionFromRuleService
    );
    const cashflowFields = filterDisabledFields(
      cashflowAndTradeFields,
      workspace.flag
    ).filter((item: any) => {
      if (item.blotterContext) {
        return item.blotterContext?.includes("CASHFLOW_DATA");
      }
      return item.context?.includes("CASHFLOW_DATA");
    });
    return {
      cashflowFields,
      cashflowAndTradeFields,
    };
  }
};

export const getBusinessFieldsFromCache = async (
  workspace?: string,
  defaultFields: any = {},
  tradesCustomFields: any = {}
) => {
  if (workspace === "trade" || workspace === "ruleTrade") {
    const tradeFields = await autoRefreshFields(
      "businessFieldsTrade",
      tradesCustomFields,
      "TRANSACTION_DATA,CONFIRMATION_DATA,RATAN_TRADE_DATA",
      false,
      getBusinessFieldsTrade,
      getBusinessFieldsVersion
    );

    if (workspace === "ruleTrade") {
      return {
        tradeFields: tradeFields.filter(
          (item) => !item.context.includes("RATAN_TRADE_DATA")
        ),
      };
    }

    return {
      tradeFields,
    };
  } else if (workspace === "cashflow" || workspace === "rule") {
    const cashflowAndTradeFields = await autoRefreshFields(
      "businessFieldsCashflow",
      defaultFields,
      "TRANSACTION_DATA,CASHFLOW_DATA",
      false,
      getBusinessFieldsCashflow,
      getBusinessFieldsVersion
    );
    const cashflowFields = filterDisabledFields(
      cashflowAndTradeFields,
      workspace === "cashflow" ? "CASHFLOW_BLOTTER" : "RULE_BLOTTER"
    ).filter((item: any) => {
      if (item.blotterContext) {
        return item.blotterContext?.includes("CASHFLOW_DATA");
      }
      return item.context?.includes("CASHFLOW_DATA");
    });
    return {
      cashflowFields,
      cashflowAndTradeFields,
    };
  } else if (["cashflowCN", "ruleCN"].includes(workspace + "")) {
    const cashflowAndTradeFields = await autoRefreshFields(
      "businessFieldsCashflowCN",
      defaultFields,
      "TRANSACTION_DATA,CASHFLOW_DATA",
      false,
      getBusinessFieldsCashflowFromRuleService,
      getBusinessFieldsVersionFromRuleService
    );
    const cashflowFields = cashflowAndTradeFields.filter((item: any) => {
      if (item.blotterContext) {
        return item.blotterContext?.includes("CASHFLOW_DATA");
      }
      return item.context?.includes("CASHFLOW_DATA");
    });
    return {
      cashflowFields,
      cashflowAndTradeFields,
    };
  }
};

const COMMASEPARATE_FORMATTED_FIELD = [
  "Total At Risk (USD)",
  "Exchanged Currency1 Payment Amount",
  "Exchanged Currency2 Payment Amount",
  "Extra Marketer Commission Amount",
  "Notional Amount",
  "Settlement Period Notional Amount",
  "Maximum Rebate Amount",
  "Target Accumulated Amount",
  "Constant Payoff Amount",
  "Total NR + AR (USD)",
  "Cash Settlement Amount",
  "Exercised Amount",
  "Outstanding Amount",
  "Total No Risk (USD)",
  "Payment Amount",
  "Additional Party Payment Amount",
];
export const COMMASEPARATE_FORMATTED_PRICE_FIELD = [
  "Trigger Price",
  "Price",
  "Forward Price",
  "Accrual Region Lower Bound Price",
  "Accrual Region Upper Bound Price",
  "Payoff Region Lower Bound Price",
  "Payoff Region Strike Price",
  "Payoff Region Upper Bound Price",
  "Barrier Trigger Price",
  "Cpty Spot Rate",
  "Trader Rate",
  "Trader Spot Rate",
  "Spot Price",
  "Strike Price",
  "Initial Net Price",
  "Basket Underliers Net Price",
];
export const getCommaSeparatedFormat = (field?: any) => {
  if (field && field.data) {
    if (COMMASEPARATE_FORMATTED_FIELD.includes(field.data.key)) {
      return priceCellFormatterWithComma(field);
    } else if (COMMASEPARATE_FORMATTED_PRICE_FIELD.includes(field.data.key)) {
      return priceCellFormatterWithComma(field, 4);
    }
  }
  return undefined;
};

notification.config({
  maxCount: 5,
});
