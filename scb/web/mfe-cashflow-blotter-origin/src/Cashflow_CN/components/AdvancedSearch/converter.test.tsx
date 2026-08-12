import {transformQueryOptions} from "./converter";

describe("StrategicCashflow converter Component", () => {
  it("should be in the document", async () => {
    const operatorMap = transformQueryOptions.operatorMap;
    expect(operatorMap).toHaveProperty("=");
    const combinatorMap = transformQueryOptions.combinatorMap;
    expect(combinatorMap).toHaveProperty("and");
  });
});
