import { defaultGetOperators } from "./utiles";

describe("Advanced Search Utiles", () => {
  it("defaultGetOperators", () => {
    const operators = defaultGetOperators();
    expect(operators.length).toBe(1);
  });
});