import { PreviewCustomType,WrapHoliday, WrapTime } from "./components";

describe("components", () => {
  it("WrapHoliday", async () => {
    const props = { value: "2024-05-16" };
    const holiday = WrapHoliday(props);
    expect(holiday).toBeDefined();
  });
  it("WrapTime", async () => {
    const props = { value: "2024-05-16" };
    const time = WrapTime(props);
    expect(time).toBeDefined();
  });
  it("PreviewCustomType", async () => {
    const props = { data: { Result: "error", tipError: "error" } };
    PreviewCustomType(props);
    const props1 = { data: { Result: "success", tipError: "" } };
    PreviewCustomType(props1);
    PreviewCustomType({});
    expect(PreviewCustomType({})).toBeDefined();
  });
});
