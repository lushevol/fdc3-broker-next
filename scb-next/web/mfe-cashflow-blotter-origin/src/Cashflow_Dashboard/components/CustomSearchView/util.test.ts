import { type RatanFieldConfig,RatanFieldType } from "./types";
import { getOperators } from "./util";

describe("CustomSearchView util", () => {
  it("text type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "text",
        valueList: [],
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(5);
  });
  it("date/time type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "datetime",
        valueList: [],
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(7);
  });
  it("boolean type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "boolean",
        valueList: [],
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(1);
  });

  it("invalid type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "invalid",
        dataType: "invalid" as RatanFieldType,
        valueList: [],
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(18);
  });
  
  it("Country should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "Country",
        dataType: "text",
        valueList: [],
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(2);
  });
});
