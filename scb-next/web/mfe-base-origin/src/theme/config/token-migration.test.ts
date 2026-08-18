import { describe, expect, it } from "vitest";
import baseTokens from "./color";
import darkTokens from "./color.dark";
import lightTokens from "./color.light";
import { getThemeClassName } from "../index";
import { getTheme, THEME } from "./utils";

const declarations = (tokens: string): string[] =>
  tokens
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean);

describe("SC WebKit token migration", () => {
  it.each([
    ["base", baseTokens],
    ["light", lightTokens],
    ["dark", darkTokens],
  ])("backs every %s token with an SC WebKit variable", (_name, tokens) => {
    const tokenDeclarations = declarations(tokens);

    expect(tokenDeclarations.length).toBeGreaterThan(0);
    expect(
      tokenDeclarations.every((declaration) =>
        declaration.match(/^--[\w-]+:\s*var\(--sc-[\w-]+\)$/),
      ),
    ).toBe(true);
  });

  it("enables WebKit mode selectors only when new styles are enabled", () => {
    expect(getThemeClassName("light", false)).toBe("light");
    expect(getThemeClassName("dark", false)).toBe("dark");
    expect(getThemeClassName("light", true)).toBe("light sc-mode-light");
    expect(getThemeClassName("dark", true)).toBe("dark sc-mode-dark");
  });

  it.each([THEME.LIGHT, THEME.DARK])(
    "selects WebKit token declarations for the %s theme only when enabled",
    (theme) => {
      expect(JSON.stringify(getTheme(theme, false))).not.toContain("var(--sc-");
      expect(JSON.stringify(getTheme(theme, true))).toContain("var(--sc-");
    },
  );
});
