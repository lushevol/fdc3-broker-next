import { formatterBooleanValue } from "./fieldsConfig";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../componentEnabling", () => {
  return { getEnable: () => true }
});

test("formatBuySell", () => {
  expect(formatterBooleanValue("x")).toEqual("x");
  expect(formatterBooleanValue("true")).toEqual("Yes");
  expect(formatterBooleanValue("false")).toEqual("No");
});
