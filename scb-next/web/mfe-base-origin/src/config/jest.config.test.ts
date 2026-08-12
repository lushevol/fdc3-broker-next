import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const configSource = readFileSync(
  resolve(process.cwd(), "vitest.config.ts"),
  "utf8",
);

describe("Vitest quality gates", () => {
  it("enforces at least 90% global line and branch coverage", () => {
    expect(configSource).toMatch(/thresholds:\s*\{\s*lines:\s*90,\s*branches:\s*90\s*\}/);
  });
});
