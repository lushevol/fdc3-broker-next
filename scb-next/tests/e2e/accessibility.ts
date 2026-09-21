import { createRequire } from "node:module";
import { expect, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

type ActionableViolation = {
  help: string;
  helpUrl: string;
  id: string;
  impact: string | null;
  targets: string[];
};

export async function expectNoActionableAxeViolations(
  page: Page,
  surface: string,
) {
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const results = await window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
    return results.violations
      .filter(({ impact }) => impact === "serious" || impact === "critical")
      .map(({ help, helpUrl, id, impact, nodes }) => ({
        help,
        helpUrl,
        id,
        impact,
        targets: nodes.flatMap(({ target }) => target.map(String)),
      }));
  });

  expect(
    violations,
    `${surface} has actionable axe violations:\n${formatViolations(violations)}`,
  ).toEqual([]);
}

function formatViolations(violations: ActionableViolation[]) {
  return violations
    .map(
      ({ help, helpUrl, id, impact, targets }) =>
        `${impact}: ${id} (${help})\n${helpUrl}\n${targets.join("\n")}`,
    )
    .join("\n\n");
}

declare global {
  interface Window {
    axe: {
      run(
        context: Document,
        options: {
          resultTypes: string[];
          runOnly: { type: string; values: string[] };
        },
      ): Promise<{
        violations: Array<{
          help: string;
          helpUrl: string;
          id: string;
          impact: string | null;
          nodes: Array<{ target: unknown[] }>;
        }>;
      }>;
    };
  }
}
