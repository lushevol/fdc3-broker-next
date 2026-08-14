import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const expectations = [
  ["Base", "web/mfe-base-origin", 9],
  ["Ratan", "web/mfe-ratan-container-origin", 5],
  ["Cashflow", "web/mfe-cashflow-blotter-origin", 5],
];
const packages = ["@mui/material", "@mui/icons-material"];
const failures = [];

for (const [name, workspace, expectedMajor] of expectations) {
  const workspaceRequire = createRequire(join(root, workspace, "package.json"));

  for (const packageName of packages) {
    try {
      const manifest = workspaceRequire(`${packageName}/package.json`);
      const actualMajor = Number.parseInt(manifest.version.split(".")[0], 10);

      if (actualMajor !== expectedMajor) {
        failures.push(
          `${name} resolves ${packageName}@${manifest.version}; expected major ${expectedMajor}`,
        );
      }
    } catch (error) {
      failures.push(`${name} cannot resolve ${packageName}: ${error.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error(
    "Dependency isolation check failed:\n" +
      failures.map((line) => `- ${line}`).join("\n"),
  );
  process.exitCode = 1;
} else {
  console.log("Dependency isolation check passed: Base uses MUI 9; Ratan and Cashflow use MUI 5.");
}
