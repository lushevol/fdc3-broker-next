import { getTheme, THEME } from "./utils";
import getDarkTheme from "./dark";
import getLightTheme from "./light";
describe("Theme Config Util", () => {
  it("should be true", () => {
    expect(JSON.stringify(getTheme(THEME.DARK))).toBe(JSON.stringify(getDarkTheme()));
    expect(JSON.stringify(getTheme(THEME.GOLD))).toBe(JSON.stringify(getDarkTheme()));
    expect(JSON.stringify(getTheme(THEME.LIGHT))).toBe(JSON.stringify(getLightTheme()));
    expect(JSON.stringify(getTheme("x"))).toBe(JSON.stringify(getLightTheme()));
  });
});
