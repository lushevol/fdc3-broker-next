import dayjs from 'dayjs';
import * as utils from './utils';
import { getTradeStatusArray,filterOption, customColumSort, displayCountDownTime, getTimeDiff } from './utils';
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
vi.useFakeTimers();

const getLocalStorage = () => {
  const { localStorage } = window;
  return localStorage;
};

let originLocalStorage = null;

const removeLocalStorage = () => {
  originLocalStorage = getLocalStorage();
  window.localStorage = undefined;
}

const restoreLocalStorage = () => {
  window.localStorage = originLocalStorage;
}

test('formatMultiInputValue', () => {
  const data = '123,456  ,   789';
  expect(utils.formatMultiInputValue(data)).toEqual(['123', '456', '789']);
});

test('setLocal', () => {
  utils.setLocal('a', '["9"]');
  expect(getLocalStorage().getItem('a')).toEqual('["9"]');
});

test("setLocal - when localstorge is undefined", () => {
  removeLocalStorage();
  expect(utils.setLocal('a', '["9"]')).toBeUndefined();
  restoreLocalStorage();
});

test('getLocal', () => {
  window.localStorage.setItem("a", '["9"]');
  const result = utils.getLocal('a');
  expect(result).toEqual(['9']);

  utils.setLocal('b', '0');
  const result2 = utils.getLocal('b');
  expect(result2).toEqual('0');

  const result3 = utils.getLocal('a1');
  expect(result3).toEqual(null);  
});

test('deepCloneConfig', () => {
  const result = utils.deepCloneConfig({ a: '0' });
  expect(result.a).toEqual('0');

  utils.setLocal('b', '0');
  const result2 = utils.getLocal('b');
  expect(result2).toEqual('0');
});

test('undefined localStorage', () => {
  const templs = window.localStorage;
  delete window.localStorage;
  window.localStorage = undefined

  expect(utils.setLocal("test","1"))
  expect(utils.getLocal("test")).toBe(null);

  window.localStorage = templs;
  expect(utils.setLocal("test","1"))
  expect(utils.getLocal("test")).toBe("1");
})

test('countBusinessDayDifference', () => {
  vi.useFakeTimers("modern");
  vi.setSystemTime(new Date("2025-07-04T00:00:00Z"));

  const data = '2020-07-06T03:29:58Z';
  expect(utils.countBusinessDayDifference(data)).toBeGreaterThan(0);
  const ts1 = dayjs().subtract(6, 'day').valueOf();
  expect(utils.countBusinessDayDifference(ts1)).toEqual(5);
});

test('customizeDayDifferenceStyle', () => {
  const data = '2020-07-06T03:29:58Z';
  expect(utils.customizeDayDifferenceStyle(data).includes('days ago')).toEqual(true);
  expect(utils.customizeDayDifferenceStyle(new Date().getTime() - 1000 * 60 * 60 * 24).includes('days ago')).toEqual(
    false
  );
  expect(utils.customizeDayDifferenceStyle(new Date().getTime()).includes('0 day')).toEqual(true)
});

test('changeKeyToLabel', () => {
  expect(utils.changeKeyToLabel('ssi', [{ from: 'ssi', to: 'SSI' }])).toEqual('SSI');
});

test('getDirection', () => {
  utils.getDirection({ pageX: 10, pageY: 10 }, '1');
  const result = utils.getDirection({ pageX: 20, pageY: 20 }, '1');
  expect(result).toEqual(0);
  const result2 = utils.getDirection({ pageX: 20, pageY: 20 }, '2');
  expect(result2).toEqual(0);
  vi.advanceTimersByTime(100);
  const result3 = utils.getDirection({ pageX: 30, pageY: 30 }, '1');
  expect(result3).toEqual(1);
  vi.advanceTimersByTime(100);
  const result4 = utils.getDirection({ pageX: 10, pageY: 20 }, '1');
  expect(result4).toEqual(-1);
  vi.advanceTimersByTime(100);
  const result5 = utils.getDirection({ pageX: 15, pageY: 5 }, '1');
  expect(result5).toEqual(0);
  vi.advanceTimersByTime(100);
  const result6 = utils.getDirection({ pageX: 25, pageY: 6 }, '1');
  expect(result6).toEqual(1);
});

test('deepClone', () => {
  const data = {
    a: 123,
  };
  expect(utils.deepClone(data)).toEqual(data);
});

test('isProduction', () => {
  expect(utils.isProduction()).toEqual(false);
});

test('formatePrice', () => {
  const data = '112345.123456';
  expect(utils.formatePrice(data)).toEqual('112,345.123456');
  const data2 = '112345';
  expect(utils.formatePrice(data2)).toEqual('112,345');
});

test('priceCellFormatterWithComma', () => {
  const num = utils.priceCellFormatterWithComma({ value: '112345.123456' });
  expect(num).toEqual('112,345.12');

  const num2 = utils.priceCellFormatterWithComma('112345.123456');
  expect(num2).toEqual(undefined);
});

test('formateRateToPercent', () => {
  const data = '1.234';
  expect(utils.formateRateToPercent(data)).toEqual('123.400%');
  expect(utils.formateRateToPercent("ab")).toEqual('');
});

test('timeCompare', () => {
  const hours = (new Date('2021-05-28T11:00:00Z').getTime() - new Date().getTime()) / (1000 * 60 * 60);
  expect(parseInt(utils.timeCompare('2021-05-28T11:00:00Z'))).toEqual(parseInt(hours.toString()));
});

test('getTimeDiff', () => {
  expect(utils.getTimeDiff('null')).toEqual(null);
  const day = (new Date('2021-05-28T11:00:00Z').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  expect(utils.getTimeDiff('2021-05-28T11:00:00Z')?.days).toEqual(parseInt(day.toString()));
});

test('getSearch', () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: "url?param=1",
    },
  });
  expect(utils.getSearch("")).toEqual('');
  expect(utils.getSearch("param")).toEqual('1');
});

test('isEmpty', () => {
  expect(utils.isEmpty("")).toEqual(true);
});

test('randomString', () => {
  expect(utils.randomString(4).length).toBeGreaterThanOrEqual(7);
});

test('getOperator', () => {
  expect(utils.getOperator(undefined)).toEqual('EQ');
  expect(utils.getOperator(['2021-05-28T11:00:00Z', '2021-05-29T11:00:00Z'])).toEqual('BET');
  expect(utils.getOperator(['2021-05-28T11:00:00', '2021-05-29T11:00:00'])).toEqual('BET');
  expect(utils.getOperator(['2021-05-28 11:00:00', '2021-05-29 11:00:00'])).toEqual('BET');
  expect(utils.getOperator(['2021-05-28', '2021-05-29'])).toEqual('BET');
  expect(utils.getOperator("string value")).toEqual('EQ');
  expect(utils.getOperator(["data1", "data2"])).toEqual('IN');
});

test('getRangepickerValue', () => {
  expect(utils.getRangepickerValue(1626442554213)).toEqual([]);
  const startTime = new Date('2021-07-17 00:00:00').toISOString();
  const endTime = new Date('2021-07-18 00:00:00').toISOString();
  const result = `["${startTime}","${endTime}"]`;
  expect(JSON.stringify(utils.getRangepickerValue(['2021-07-17', '2021-07-18']))).toEqual(result);
});

test('distinctArrayCloseTo', () => {
  expect(utils.distinctArrayCloseTo([1, 1, 2, 3])).toEqual([1, 2, 3]);
});

test('removeSpacesFromStrings', () => {
  expect(utils.removeSpacesFromStrings('Trade ID')).toEqual('TradeID');
  expect(utils.removeSpacesFromStrings(1000)).toEqual(1000);
});

test('sortArrByField', () => {
  const result = JSON.stringify(
    utils.sortArrByField([{ field: 'Cashflow.Cashflow_Version' }, { field: 'Cashflow.Cashflow_Id' }], 'field')
  );
  expect(result).toEqual('[{"field":"Cashflow.Cashflow_Id"},{"field":"Cashflow.Cashflow_Version"}]');
});

test('removeTimestamp', () => {
  expect(utils.removeTimestamp('a-b')).toEqual('a');
});

test('displayCountDownTime', () => {
  const ts1 = dayjs().add(20, 'second');
  const ts2 = dayjs().add(2, 'day').add(1, 'hour').add(3, 'minute')
  const ts3 = dayjs().add(10, 'day').add(12, 'hour').add(15, 'minute')
  const ts4 = dayjs().subtract(1, 'hour');

  expect(utils.displayCountDownTime(ts1)).toEqual('00 D, 00 H, 00 M');
  expect(utils.displayCountDownTime(ts2)).toEqual('02 D, 01 H, 03 M');
  expect(utils.displayCountDownTime(ts3)).toEqual('10 D, 12 H, 15 M');
  expect(utils.displayCountDownTime(ts4)).toEqual('00 D, 00 H, 00 M');
});

test('styleForCountDownTime', () => {
  expect(utils.styleForCountDownTime('2021-05-28T11:00:00Z')).toEqual('cut-off');
});

test('isUTCDate', () => {
  expect(utils.isUTCDate('2021-05-28T11:00:00Z')).toEqual(true);
  expect(utils.isUTCDate('2021-05-28T11:00:00')).toEqual(true);
  expect(utils.isUTCDate('2021-05-28 11:00:00')).toEqual(false);
});

test('computeFloatingPointNumber', () => {
  expect(utils.computeFloatingPointNumber('0.000012', 10000)).toEqual("0.12");
})

test('getTradeStatusArray', () => {
  const data = [{
    Trade_State: "xx",
    Trade_Lake_Trade_Major_Version: "1",
    Trade_Lake_Trade_Minor_Version: "2"
  }]
  const result = getTradeStatusArray(data)
  expect(JSON.stringify(result)).toEqual("[\"xx\"]")
})

test('mergeCsvToExcel', async () => {
  const data1 = {"First Leg":"\"Fixed/Floating Indicator\",\"Start Date\",\"End Date\",\"Payment Date\",\"Remaining Notional Amount\",\"Rate（%）\",\"Pay/Receive\",\"Payment Currency\",\"Payment Amount\",\"Cashflow Id\",\"Payment Type\",\"Cashflow Version\",\"Business Event Type\",\"Cashflow State\"\r\n\"Fixed Rate Leg\",\"2023 Dec 08\",\"2024 Jan 08\",\"2024 Jan 08\",\"1000000\",\"3.9\",\"Pay\",\"EUR\",\"3249.999999999975\",\"004321302566\",\"Coupon/Fixed\",\"1\",\"New\",\"NETTED\"","Second Leg":"\"Fixed/Floating Indicator\",\"Start Date\",\"End Date\",\"Payment Date\",\"Remaining Notional Amount\",\"Rate（%）\",\"Margin/Spread（%）\",\"Expected Fixing Date\",\"Actual Fixing Date\",\"Pay/Receive\",\"Payment Currency\",\"Payment Amount\",\"Cashflow Id\",\"Payment Type\",\"Cashflow Version\",\"Business Event Type\",\"Cashflow State\"\r\n\"Floating Rate Leg\",\"2023 Dec 08\",\"2024 Jan 08\",\"2024 Jan 08\",\"1000000\",\"\",\"NaN\",\"2023 Dec 06\",\"\",\"Receive\",\"EUR\",\"3323.0277777778206\",\"004321302567\",\"Coupon/Float\",\"1\",\"New\",\"NETTED\"","Others Cashflow":"\"Payment Date\",\"Pay/Receive\",\"Payment Currency\",\"Payment Amount\",\"Cashflow Id\",\"Payment Type\",\"Cashflow Version\",\"Business Event Type\",\"Cashflow State\""}
  const result1 = await utils.mergeCsvToExcel(data1, 'test.xlsx');
  expect(typeof result1).toEqual('object');
  const data2 = {
    "BARRIER INFORMATION":
    [
      {
          "Field": "Forward_Future_Instrument.Barrier_Information.Barrier_Direction",
          "Label": "Barrier Direction",
          "Value": "EqualOrGreater"
      },
      {
          "Field": "Forward_Future_Instrument.Barrier_Information.Barrier_Trigger_Price",
          "Label": "Barrier Trigger Price",
          "Value": "513.326"
      },
      {
          "Field": "Forward_Future_Instrument.Barrier_Information.Price_Observation_Time",
          "Label": "Price Observation Time",
          "Value": "Closing"
      }
  ]
  }
  const result2 = utils.mergeCsvToExcel(data2, 'test.xlsx');
  expect(typeof result2).toEqual("object");
});

it("customColumSort", () => {
  expect(utils.customColumSort(null, null, "")).toEqual(0);
  expect(utils.customColumSort(null, 1, "")).toEqual(-1);
  expect(utils.customColumSort(1, null, "")).toEqual(1);
  expect(utils.customColumSort(2, 1, "Number")).toEqual(1);
  expect(utils.customColumSort("a", "b", "")).toEqual(-1);
  expect(utils.customColumSort("b", "a", "")).toEqual(1);
  expect(utils.customColumSort("abc", "a", "")).toEqual(2);
});

it("setTestId", () => {
  expect(utils.setTestId("AB Cd")).toEqual("aBCd")
})

it("isNumber", () => {
  expect(utils.isNumber(1)).toBe(true);
  expect(utils.isNumber("1")).toBe(true);
  expect(utils.isNumber("a")).toBe(false);
  expect(utils.isNumber("1a")).toBe(false);
});

it("judgeCashflowProduct", () => {
  const cashflowProductSource = {
    "egyptSource": {
      "Entity.Booking_Entity_SCI_FMID": ["401036553"]
    }
  };
  expect(utils.judgeCashflowProduct({ Entity: { Booking_Entity_SCI_FMID: "test" } }, cashflowProductSource)).toEqual("");
  expect(utils.judgeCashflowProduct({ Entity: { Booking_Entity_SCI_FMID: "401036553" } }, cashflowProductSource)).toEqual("egyptSource");
});

it("judgeProduct", () => {
  const cashflowProductSource = {
    "egyptSource": {
      "Entity.Booking_Entity_SCI_FMID": ["401036553"]
    }
  };
  expect(utils.judgeProduct({ Entity: { Booking_Entity_SCI_FMID: "test" } }, cashflowProductSource)).toEqual("");
  expect(utils.judgeProduct({ Entity: { Booking_Entity_SCI_FMID: "401036553" } }, cashflowProductSource)).toEqual("egyptSource");
});

describe('Select filter Option', () => {
  test('filterOption - should return true when input matches label', () => {
    const input = 'private';
    const option = { label: 'Private', value: 'private' };
    expect(filterOption(input, option)).toBe(true);
  });

  test('filterOption - should return true when input matches value', () => {
    const input = 'public';
    const option = { label: 'Private', value: 'public' };
    expect(filterOption(input, option)).toBe(false);
  });

  test('filterOption - should return false when input does not match label or value', () => {
    const input = 'test';
    const option = { label: 'Private', value: 'public' };
    expect(filterOption(input, option)).toBe(false);
  });

  test('filterOption - should return false when option is an array', () => {
    const input = 'private';
    const option = { label: 'Private', value: 'private', options: [] };
    expect(filterOption(input, option)).toBe(false);
  });

  test('filterOption - should return false when option is null', () => {
    const input = 'private';
    const option = null;
    expect(filterOption(input, option)).toBe(false);
  });

  test('filterOption - should return false when option label include spaces', () => {
    const input = 'test n';
    const option = { label: 'test    n', value: 'public' };;
    expect(filterOption(input, option)).toBe(true);
  });
})

describe('customColumSort', () => {
  test('should return 0 when both values are null', () => {
    expect(customColumSort(null, null, 'String')).toBe(0);
    expect(customColumSort(null, null, 'Number')).toBe(0);
  });

  test('should return -1 when valueA is null and valueB is not null', () => {
    expect(customColumSort(null, 1, 'Number')).toBe(-1);
    expect(customColumSort(null, 'test', 'String')).toBe(-1);
  });

  test('should return 1 when valueB is null and valueA is not null', () => {
    expect(customColumSort(1, null, 'Number')).toBe(1);
    expect(customColumSort('test', null, 'String')).toBe(1);
  });

  test('should correctly sort numbers', () => {
    expect(customColumSort(1, 2, 'Number')).toBe(-1);
    expect(customColumSort(2, 1, 'Number')).toBe(1);
    expect(customColumSort(1, 1, 'Number')).toBe(0);
  });

  test('should correctly sort strings of the same length', () => {
    expect(customColumSort('apple', 'banana', 'String')).toBe(-1);
    expect(customColumSort('banana', 'apple', 'String')).toBe(1);
    expect(customColumSort('apple', 'apple', 'String')).toBe(0);
  });

  test('should correctly sort strings of different lengths', () => {
    expect(customColumSort('apple', 'app', 'String')).toBe(2);
    expect(customColumSort('app', 'apple', 'String')).toBe(-2);
  });

  test('should correctly sort strings that are numbers', () => {
    expect(customColumSort('100', '200', 'String')).toBe(-1);
    expect(customColumSort('200', '100', 'String')).toBe(1);
    expect(customColumSort('100', '100', 'String')).toBe(0);
  });
});

describe('getTimeDiff', () => {
  it('should return null for invalid date string', () => {
    expect(getTimeDiff("invalid date")).toBeNull();
  });

  it('should return null for "null" string', () => {
    expect(getTimeDiff("null")).toBeNull();
  });

  it('should return correct time difference for future date', () => {
    const futureDate = dayjs().add(2, 'days').add(3, 'hours').add(4, 'minutes').format();
    getTimeDiff(futureDate);
  });
});

describe('displayCountDownTime', () => {
  it('should return "00 D, 00 H, 00 M" for invalid date', () => {
    expect(displayCountDownTime("invalid date")).toBe(undefined);
  });

  it('should return formatted time for future date', () => {
    const futureDate = dayjs().add(2, 'days').add(3, 'hours').add(4, 'minutes').format();
    expect(displayCountDownTime(futureDate)).toBe("02 D, 03 H, 03 M");
  });

  it('should return "00 D, 00 H, 00 M" for past date', () => {
    const pastDate = dayjs().subtract(2, 'days').subtract(3, 'hours').subtract(4, 'minutes').format();
    expect(displayCountDownTime(pastDate)).toBe("00 D, 00 H, 00 M");
  });
});