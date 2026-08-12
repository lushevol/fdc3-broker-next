import { getDateHorizon } from "./UIconfig";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../componentEnabling", () => {
  return { getEnable: () => true }
});

test("formatBuySell", () => {
  getDateHorizon(-1);
  getDateHorizon(new Date().getTime());
  getDateHorizon(new Date().toDateString());
  getDateHorizon(true);
});
