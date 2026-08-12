import { dehydrate, hydrate, isNumberString, jsonParse, modeClassName, ratanRawField2RQBField, datetimeFormatChecker, handelValue } from "./utils";
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from "../RatanOne/config/const";
import dayjs from "dayjs";

afterAll(() => {
  vi.clearAllMocks();
});

describe("utils component", () => {
  it("should be in the document", async () => {
    const props = {
      combinator: "and",
      rules: [],
    };
    expect(dehydrate(props)).toContain("and");
    expect(hydrate("or")).toHaveProperty("rules");
  });
  it("should be in the document", async () => {
    const props = {
      f: {
        indexedTerm: "Trade_Second_Source_System_Id",
        businessTerm: "",
        dataType: "String",
        subSelection: "Trade",
        context: "TRANSACTION_DATA",
        displayStyle: "freeText",
        valueList: "",
        operators: "EQ",
        operatorsSupp: "==,!=",
        detailsFixed: false,
        dynamicList: false,
        disabledView: false,
        disabledFilter: false,
        disabledPages: null,
        detailsGroup: "false",
        seq: 618,
        blotterContext: ["TRANSACTION_DATA"],
      },
      opt: {
        getOperators: vi.fn(),
      },
    };
    expect(ratanRawField2RQBField(props.f, props.opt)).toHaveProperty("config");
  });
  it("isNumberString should work", () => {
    expect(isNumberString("123")).toBe(true);
    expect(isNumberString("123.123")).toBe(true);
    expect(isNumberString("2024-01-01")).toBe(false);
    expect(isNumberString("")).toBe(false);
    expect(isNumberString([])).toBe(false);
  });
  it("jsonParse", () => {
    expect(jsonParse("['123']")).toStrictEqual(["123"]);
  });
  it("modeClassName", () => {
    expect(modeClassName("group")).toBe("mode-group");
  });
  it("datetimeFormatChecker", () => {
    const f = datetimeFormatChecker("date", { dateFormat: DATE_FORMAT });
    expect(f).toBe(DATE_FORMAT);
    const f2 = datetimeFormatChecker("time", { timeFormat: TIME_FORMAT });
    expect(f2).toBe(TIME_FORMAT);
    const f3 = datetimeFormatChecker("datetime", { datetimeFormat: DATE_TIME_FORMAT });
    expect(f3).toBe(DATE_TIME_FORMAT);
  });
    it("handelValue", () => {
      const dateValue = dayjs('2023-01-01');
      expect(handelValue(dateValue)).toBe(dateValue);
  });
});
