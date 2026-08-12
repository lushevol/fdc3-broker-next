import RegExpTracer from "./RegExpTracer";

describe("RegExpTracer", () => {
  const ruleId = 1;
  const pattern = "^\\d{3}$";
  const errorMsg = "validation error";
  const subItem = { value: pattern, errorMsg };

  it("Required field, validation faield", async () => {
    const rules = [];
    const tracer = RegExpTracer(subItem, rules, ruleId);
    expect(tracer.pattern).toBe(pattern);
    expect(tracer.message).toBe(errorMsg);
    expect(tracer.ruleId).toBe(ruleId);
  });

  it("When AllowEmpty, empty value can be passed", async () => {
    const rules = [{ name: "AllowEmpty" }];
    const validator = RegExpTracer(subItem, rules, ruleId).validator;
    await expect(validator && validator({}, "")).resolves.toBeUndefined();
    await expect(validator && validator({}, null)).resolves.toBeUndefined();
    await expect(validator && validator({}, undefined)).resolves.toBeUndefined();
  });

  it("When AllowEmpty and follow regExp then passed", async () => {
    const rules = [{ name: "AllowEmpty" }];
    const validator = RegExpTracer(subItem, rules, ruleId).validator;
    await expect(validator && validator({}, "123")).resolves.toBeUndefined();
  });

  it("When AllowEmpty and input v alue but not follow regExp then validaiton faield", async () => {
    const rules = [{ name: "AllowEmpty" }];
    const validator = RegExpTracer(subItem, rules, ruleId).validator;
    await expect(validator && validator({}, "abc")).rejects.toThrow(errorMsg);
    await expect(validator && validator({}, "12")).rejects.toThrow(errorMsg);
  });
});