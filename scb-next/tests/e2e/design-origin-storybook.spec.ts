import { expect, test } from "@playwright/test";
import { expectNoActionableAxeViolations } from "./accessibility";

const storybookUrl = process.env.RATAN_DESIGN_STORYBOOK_URL;
test.skip(!storybookUrl, "Requires the built ratan-design-origin Storybook");

test("catalog stories have no actionable accessibility violations", async ({
  page,
  request,
}) => {
  test.setTimeout(180_000);
  const response = await request.get(`${storybookUrl}/index.json`);
  expect(response.ok()).toBe(true);
  const index = (await response.json()) as {
    entries: Record<string, { id: string; type: string }>;
  };
  const storyIds = Object.values(index.entries)
    .filter(({ type }) => type === "story")
    .map(({ id }) => id)
    .sort();
  expect(storyIds.length).toBeGreaterThan(0);

  for (const generation of ["legacy", "webkit"]) {
    for (const mode of ["light", "dark"]) {
      for (const storyId of storyIds) {
        const query = new URLSearchParams({
          id: storyId,
          viewMode: "story",
          globals: `mode:${mode};designGeneration:${generation}`,
        });
        await page.goto(`${storybookUrl}/iframe.html?${query}`);
        await expect(page.locator("#storybook-root > *").first()).toBeAttached();
        await page.evaluate(async () => {
          const finiteAnimations = document
            .getAnimations()
            .filter((animation) => {
              const iterations = animation.effect?.getTiming().iterations;
              return iterations !== Infinity;
            });
          await Promise.all(finiteAnimations.map((animation) => animation.finished));
        });
        await expectNoActionableAxeViolations(
          page,
          `${storyId} (${generation}/${mode})`,
        );
      }
    }
  }
});
