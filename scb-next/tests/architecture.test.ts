import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = join(import.meta.dirname, "..");
const activeOrigins = [
  "mfe-base-origin",
  "mfe-ratan-container-origin",
  "mfe-cashflow-blotter-origin",
] as const;

function packageJson(origin: (typeof activeOrigins)[number]) {
  return JSON.parse(
    readFileSync(join(workspaceRoot, "web", origin, "package.json"), "utf8"),
  ) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

describe("SCB Next composition architecture", () => {
  it.each(activeOrigins)("uses Vite and Vitest in %s", (origin) => {
    const manifest = packageJson(origin);

    expect(existsSync(join(workspaceRoot, "web", origin, "vite.config.ts"))).toBe(true);
    expect(manifest.scripts?.build).toContain("vite build");
    expect(manifest.scripts?.test).toContain("vitest run");
    expect(manifest.devDependencies).toHaveProperty("vite");
    expect(manifest.devDependencies).toHaveProperty("vitest");
  });

  it.each(activeOrigins)("has no active single-spa toolchain in %s", (origin) => {
    const manifest = packageJson(origin);
    const packages = { ...manifest.dependencies, ...manifest.devDependencies };

    expect(Object.keys(packages).filter((name) => name.includes("single-spa"))).toEqual([]);
    expect(Object.keys(packages).filter((name) => name.startsWith("webpack"))).toEqual([]);
  });

  it("configures the base host and both federated remotes", () => {
    const baseConfig = readFileSync(
      join(workspaceRoot, "web/mfe-base-origin/vite.config.ts"),
      "utf8",
    );
    const ratanConfig = readFileSync(
      join(workspaceRoot, "web/mfe-ratan-container-origin/vite.config.ts"),
      "utf8",
    );
    const cashflowConfig = readFileSync(
      join(workspaceRoot, "web/mfe-cashflow-blotter-origin/vite.config.ts"),
      "utf8",
    );

    expect(baseConfig).toContain("port: 8001");
    expect(baseConfig).toContain("mfe_ratan_container");
    expect(ratanConfig).toContain("port: 8009");
    expect(ratanConfig).toContain("mfe_cashflow_blotter");
    expect(ratanConfig).toContain('"react-router-dom": { singleton: true');
    expect(cashflowConfig).toContain("port: 8015");
    expect(cashflowConfig).toContain("'react-router-dom': { singleton: true");
    expect(ratanConfig).toContain("exposes");
    expect(cashflowConfig).toContain("exposes");
  });

  it("contains no webpack HMR globals in active cashflow schemas", () => {
    const schemaRoot = join(
      workspaceRoot,
      "web/mfe-cashflow-blotter-origin/src",
    );
    const schemas = [
      "Cashflow_CN/schema/ultra-cashflow-query-count.generated.ts",
      "Cashflow_CN/schema/ultra-cashflow-query.generated.ts",
      "Cashflow_Group_Management/schema/group-message-query.generated.ts",
    ];

    for (const schema of schemas) {
      expect(readFileSync(join(schemaRoot, schema), "utf8")).not.toContain(
        "module.hot",
      );
    }
  });
});
