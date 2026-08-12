import { getOperators } from "./operators";
import { type RatanFieldConfig } from "./types";

describe("StrategicCashflow operators", () => {
  it("text type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "text",
        valueList: [],
        disabledFilter: false,
        disabledPages: "",
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(6);
  });
  it("date/time type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "datetime",
        valueList: [],
        disabledFilter: false,
        disabledPages: "",
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(7);
  });
  it("boolean type should work as expected", async () => {
    const fieldMock: RatanFieldConfig = {
        indexedTerm: "test",
        dataType: "boolean",
        valueList: [],
        disabledFilter: false,
        disabledPages: "",
    };
    const operators = getOperators(fieldMock);
    expect(operators.length).toBe(1);
  });
});
