import { parseValueList } from "./valueList";

afterAll(() => {
  jest.clearAllMocks();
});

describe("valueList component", () => {
  it("should be in the document", async () => {
    const props = "['AUD','EUR','GBP','HKD','JPY','SGD','USD']";
    const valueList = parseValueList(props);
    expect(valueList).toHaveLength(7);
    const props1 = "[1]";
    const valueList1 = parseValueList(props1)
    expect(valueList1).toEqual([1]);
    const props2 = "";
    const valueList2 = parseValueList(props2)
    expect(valueList2).toEqual([]);
    const props3 = [{ label: "TEST", title: "TEST", value: "TEST", name: "TEST" }];
    const valueList3 = parseValueList(props3);
    expect(valueList3).toBe(props3);
    const props4 = "";
    const valueList4 = parseValueList(props4, "boolean");
    expect(valueList4[0].value).toBe(true);
    const props5 = [{ label: "TEST", value: "TEST" }];
    const valueList5 = parseValueList(props5);
    expect(valueList5[0].name).toBe("TEST");
  });
});
