import { describe, expect, it } from "vitest";
import { newStyleTokens } from "./tokens";

const flattenTokenValues = (value: object): string[] =>
  Object.values(value).flatMap((entry: object | string) =>
    typeof entry === "string" ? [entry] : flattenTokenValues(entry),
  );

describe("newStyleTokens", () => {
  it("uses only SC WebKit token variables", () => {
    const values = flattenTokenValues(newStyleTokens);

    expect(values.length).toBeGreaterThan(0);
    expect(values.every((value) => /^var\(--sc-[a-z0-9-]+\)$/.test(value))).toBe(
      true,
    );
  });

  it("covers the design-token categories used by Base styles", () => {
    expect(Object.keys(newStyleTokens)).toEqual([
      "color",
      "typography",
      "spacing",
      "radius",
      "shadow",
    ]);
  });
});
