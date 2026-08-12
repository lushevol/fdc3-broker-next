import * as vars from "./interface";

describe("Defined Vars", () => {
  it("should be defined", () => {
    Object.keys(vars).forEach((k) => {
      expect(vars[k]).toBeDefined();
    });
  });
});
