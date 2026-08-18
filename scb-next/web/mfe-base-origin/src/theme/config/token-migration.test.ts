import { describe, expect, it } from "vitest";
import baseTokens from "./color";
import darkTokens from "./color.dark";
import lightTokens from "./color.light";
import { getThemeClassName } from "../index";

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

  it("preserves portal selectors while enabling WebKit modes", () => {
    expect(getThemeClassName("light")).toBe("light sc-mode-light");
    expect(getThemeClassName("dark")).toBe("dark sc-mode-dark");
  });
});
