import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import _trim from "lodash/trim";
import ExcelJS from "exceljs/dist/exceljs";
import { saveAs } from "file-saver";
import { CommonUtil } from "../Root/import/index";
import { FilterOptionItem, GroupFilterOption } from "./config/common/interface";
dayjs.extend(utc);
dayjs.extend(duration);

export const formatMultiInputValue = (value: string = ""): string[] => {
  let result;
  result = value.split(",").map(_trim);

  const set = new Set(result);
  result = Array.from(set).filter((item) => {
    return item !== "" && item !== "null" && item !== "undefined";
  });

  return result;
};

export const setLocal = (key: string, value: any) => {
  const ls = localStorage;
  if (typeof ls == "undefined") {
    return;
  }
  const valueString = typeof value !== "string" ? JSON.stringify(value) : value;
  ls.setItem(key, valueString);
};

export const getLocal = (key: string) => {
  const ls = localStorage;
  if (typeof ls == "undefined") {
    return null;
  }
  const value = ls.getItem(key);

  if (value && value !== "null") {
    if (value.includes("{") || value.includes("[")) {
      return JSON.parse(value);
    }
    return value;
  }
  return null;
};

export const deepClone = (data: {}) => JSON.parse(JSON.stringify(data));
export const deepCloneConfig = (data: any) => {
  if (!data || !(data instanceof Object) || typeof data == "function") {
    return data || undefined;
  }
  const constructor = data.constructor;
  const result = new constructor();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      result[key] = deepCloneConfig(data[key]);
    }
  }
  return result;
};

export const isNumber = (val: any) => {
  return CommonUtil.isNumber(val);
};

//Formate price with comma seperated and deciaml
export const formatePrice = (price: any, n?: any) => {
  if (!price) price = 0; // ""/null/undefined/0 => 0;
  const showPrice = n
    ? parseFloat((price + "").replace(/[^\d.-]/g, "")).toFixed(n) + ""
    : parseFloat((price + "").replace(/[^\d.-]/g, "")) + "";
  const integerPart = showPrice.split(".")[0].split("").reverse();
  const decimalPart = showPrice.split(".")[1];

  let invertedIntegerPart = "";
  for (let i = 0; i < integerPart.length; i++) {
    invertedIntegerPart +=
      integerPart[i] +
      ((i + 1) % 3 === 0 && i + 1 !== integerPart.length ? "," : "");
  }

  if (showPrice.indexOf(".") === -1) {
    return invertedIntegerPart.split("").reverse().join("");
  } else
    return invertedIntegerPart.split("").reverse().join("") + "." + decimalPart;
};

export function priceCellFormatterWithComma(...args) {
  const props = typeof arguments[0] === "number" ? arguments[1] : arguments[0];
  const n = typeof arguments[0] === "number" ? arguments[0] : 2;

  if (
    props &&
    props.value !== "" &&
    props.value !== null &&
    props.value !== undefined
  ) {
    return formatePrice(props.value, n);
  }
  return props.value;
}

export const formateRateToPercent = (rate: any, n?: any) => {
  if (CommonUtil.isNumber(rate)) {
    const formateRate = formatePrice(rate);
    const match = formateRate.match(/\.(\d*)/);
    const decimalPlaces = match ? match[1].length : 0;
    return (parseFloat(formateRate) * 100).toFixed(n || decimalPlaces) + "%";
  }
  return "";
};

//when Cut-Off is a UTC time use this
export const timeCompare: any = (props: any) => {
  const time = getTimeDiff(props);
  if (time) {
    return time.timeDifference.as("hours");
  }
  return 0;
};

export const getTimeDiff = (value: string) => {
  if (value !== "null") {
    const time = dayjs(value);

    if (time.isValid()) {
      const nowTime = dayjs(new Date());
      const timeDifference = dayjs.duration(time.diff(nowTime));

      const days = time.diff(nowTime, "days");
      const hours = timeDifference.get("hours");
      const minutes = timeDifference.get("minutes");
      return {
        days,
        hours,
        minutes,
        timeDifference,
      };
    }
  }

  return null;
};

export const getSearch = (field: string) => {
  const search = window.location.href.split("?")[1];
  const params = new URLSearchParams(`?${search}`);
  if (params.has(field)) {
    return params.get(field);
  }
  return "";
};

export const isEmpty = (value: any) => {
  return value === "" || value === null || value === undefined;
};

export const randomString = (len: number) => {
  return window.crypto.getRandomValues(new Uint8Array(len)).join("");
};

export const countBusinessDayDifference = (timestamp: number | string) => {
  const nowTime = new Date().getTime();
  const dataTime = new Date(timestamp).getTime();

  const startDay = new Date(timestamp).getDay();

  const timeDiff = nowTime - dataTime;
  let exceedDay = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let weekEndDay = Math.floor(exceedDay / 7) * 2;
  const surplusDay = exceedDay % 7;

  for (let i = 1; i <= surplusDay; i++) {
    if (i + startDay === 6 || i + startDay === 7) {
      weekEndDay++;
    }
  }

  exceedDay -= weekEndDay;
  return exceedDay;
};

export const customizeDay = (timestamp: number | string) => {
  const exceedDay = countBusinessDayDifference(timestamp);
  if (exceedDay > 1) {
    return `${exceedDay} days ago`;
  } else if (exceedDay === 1) {
    return `${exceedDay} day ago`;
  }
  return `${exceedDay} day`;
};

export const customizeDayDifferenceStyle = (timestamp: number | string) => {
  const exceedDay = countBusinessDayDifference(timestamp);
  const text = customizeDay(timestamp);

  if (exceedDay > 1) {
    return `<span class="exceptions-age-red">${text}</span>`;
  } else if (exceedDay === 1) {
    return `<span class="exceptions-age-amber">${text}</span>`;
  }
  return `<span class="exceptions-age-green">${text}</span>`;
};

interface UpperCaseList {
  from: string;
  to: string;
}
export const changeKeyToLabel = (
  key: string,
  upperCaseList: UpperCaseList[]
) => {
  let str = key.replace(/([A-Z])/g, " $1");
  upperCaseList.forEach((item: UpperCaseList) => {
    str = str.replace(item.from, item.to);
  });
  return str.substring(0, 1).toUpperCase() + str.substring(1);
};

export const isProduction = () => CommonUtil.getEnv() === "production";

let prevPageX = 0;
let prevPageY = 0;
let prevDirection = 0;
let isWaiting = true;
let isFirst = true;
let prevId: any = null;
const getCurrentDirection = (e) => {
  let direction = 0;
  const a = e.pageX - prevPageX;
  const b = e.pageY - prevPageY;
  prevPageX = e.pageX;
  prevPageY = e.pageY;
  if (Math.abs(a) > Math.abs(b)) {
    if (a > 0) {
      direction = 1;
    } else {
      direction = -1;
    }
  } else {
    if (b > 0) {
      direction = 1;
    } else {
      direction = -1;
    }
  }
  return direction;
};

export const getDirection = (e: any, id: string) => {
  if (isFirst) {
    prevId = id;
    isFirst = false;
    prevPageX = e.pageX;
    prevPageY = e.pageY;
    setTimeout(() => {
      isWaiting = false;
    }, 100);
  } else if (id !== prevId) {
    prevDirection = 0;
    prevId = id;
  }
  if (!isWaiting) {
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
    }, 100);
    const direction = getCurrentDirection(e);
    if (prevDirection !== direction) {
      prevDirection = direction;
      return direction;
    }
  }
  return 0;
};

export const getRangepickerValue = (value: any) => {
  if (!value || !Array.isArray(value)) {
    return [];
  }
  return value.map((item: any) => dayjs(item, "YYYY-MM-DD"));
};

export const getOperator = (value: any | undefined) => {
  if (Array.isArray(value)) {
    const isDateRange = value.every((item) =>
      dayjs(item, ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss[Z]"], true).isValid()
    );
    return isDateRange ? "BET" : "IN";
  }
  return "EQ";
};

export const removeTimestamp = (field: string) => {
  return field.split("-")[0];
};

export const removeSpacesFromStrings = (value: any) => {
  if (typeof value === "string") {
    return value.replace(/\s+/g, "");
  }
  return value;
};

const compareArrayLength = (arrayA: any, arrayB: any) => {
  for (let i = 0, l = arrayA.length; i < l; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return arrayA[i] < arrayB[i];
    }
  }
};

//Sort Array with specific field once it is multilevel with spot to distinguish
export const sortArrByField = (arr: any, filed: string) => {
  arr = arr.sort((a: any, b: any) => {
    const arrayA = a[filed].split(".");
    const arrayB = b[filed].split(".");
    return compareArrayLength(arrayA, arrayB) ? -1 : 1;
  });

  return arr;
};

// Remove duplication of adjacent elements in an array
export const distinctArrayCloseTo = (arr: any) => {
  const newArray: any = [];
  arr.forEach((item: string, index: number) => {
    if (item !== arr[index + 1]) {
      newArray.push(item);
    }
  });
  return newArray;
};

//Display cutoff count down time
export const displayCountDownTime = (data: any) => {
  const time = getTimeDiff(data);

  if (time) {
    if (time.days < 0 || time.hours < 0 || time.minutes < 0) {
      return "00 D, 00 H, 00 M";
    } else {
      return `${time.days > 9 ? time.days : "0" + time.days} D, ${
        time.hours > 9 ? time.hours : "0" + time.hours
      } H, ${time.minutes > 9 ? time.minutes : "0" + time.minutes} M`;
    }
  }
};

//Display style of count down time
export const styleForCountDownTime = (data: any) => {
  const time = getTimeDiff(data);
  if (time && time.days <= 0 && time.hours < 3) {
    return "cut-off";
  }
};

//Fix Sort Bug in Ag-Grid as it use asc by default for String type
//dataType in ['Id','Number]
export const customColumSort = (valueA: any, valueB: any, dataType: string) => {
  if (valueA === null && valueB === null) {
    return 0;
  } else if (valueA === null) {
    return -1;
  } else if (valueB === null) {
    return 1;
  } else if (dataType === "Number") {
    return valueA - valueB;
  } else {
    //below conditton is suit for String type but value is number (eg:cashflow_id)
    const a = valueA.toString();
    const b = valueB.toString();
    if (a.length === b.length) {
      return a === b ? 0 : a > b ? 1 : -1;
    }
    return a.length - b.length;
  }
};

export function setTestId(label: string) {
  const testId = label.replace(/\s/g, "");
  return testId.substring(0, 1).toLowerCase() + testId.substring(1);
}

export const judgeCashflowProduct = (
  data: any,
  productSource: any = ratanConfig.cashflow.cashflowProductSource
) => {
  let productSourceName = "";
  if (data && productSource) {
    for (const product in productSource) {
      const fields = productSource[product];
      let isThisProduct = true;
      for (const field in fields) {
        const fieldLevel = field.split(".");
        let value = data;
        fieldLevel.forEach((item) => {
          if (value) {
            value = value[item];
          }
        });
        if (!fields[field].includes(value)) {
          isThisProduct = false;
        }
      }
      if (isThisProduct) {
        productSourceName = product;
      }
    }
  }
  return productSourceName;
};

export const isUTCDate = (value: string) => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z{0,1}$/.test(value);
};

export const judgeProduct = (data: any, productSource: any) => {
  let productSourceName = "";
  if (data && productSource) {
    for (const product in productSource) {
      const fields = productSource[product];
      let isThisProduct = true;
      for (const field in fields) {
        const fieldLevel = field.split(".");
        let value = data;
        fieldLevel.forEach((item) => {
          if (value) {
            value = value[item];
          }
        });
        if (!fields[field].includes(value)) {
          isThisProduct = false;
        }
      }
      if (isThisProduct) {
        productSourceName = product;
      }
    }
  }
  return productSourceName;
};

export const computeFloatingPointNumber = (num: string, mulriple: number) => {
  const floatingNum = num.split(".")[1]?.length || 0;
  return (
    (Number(num.replace(".", "")) * mulriple) /
    Math.pow(10, floatingNum)
  ).toString();
};

export const mergeCsvToExcel = async (data, fileName: string) => {
  const wb = new ExcelJS.Workbook();
  Object.keys(data).forEach((group) => {
    const ws = wb.addWorksheet(group);
    let formatData: any[] = data[group];

    if (typeof formatData === "string") {
      formatData = data[group]
        ?.split(/[\r\n]+/)
        .map((item) => item.replace(/(?:^")|(?:"$)/g, "").split('","'));
    } else if (Array.isArray(formatData)) {
      ws.columns = Object.keys(formatData[0]).map((item) => ({
        header: item,
        key: item,
      }));
    }

    ws.addRows(formatData);
  });

  const res = await wb.xlsx.writeBuffer();

  const blob = new Blob([res]);
  saveAs(blob, fileName);

  return blob;
};

export const getTradeStatusArray = (arrayTradeVersions: any[]) => {
  const tradeVersion: any[] = [];
  arrayTradeVersions.forEach((item) => {
    if (item.Trade_State) {
      tradeVersion.push({
        Version: `${item.Trade_Lake_Trade_Major_Version}.${item.Trade_Lake_Trade_Minor_Version}`,
        Trade_Status: item.Trade_State,
      });
    }
  });
  const sortArr = sortArrByField(tradeVersion, "Version");
  const displayTradeStatusList: any = [];
  sortArr.forEach((item: any) => {
    displayTradeStatusList.push(item.Trade_Status);
  });

  return distinctArrayCloseTo(displayTradeStatusList);
};

export const filterOption = (
  input: string,
  option?: GroupFilterOption | FilterOptionItem | null
) => {
  if (!option) return false;
  if ("options" in option) {
    return false;
  }
  const newInput = input.replace(/\s/g, "");
  const newOptionLabel = option?.label.replace(/\s/g, "") ?? "";
  return newOptionLabel.toLowerCase().includes(newInput.toLowerCase());
};
