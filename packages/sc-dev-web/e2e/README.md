# E2E Testing with Playwright

End-to-end tests for `@scdevkit/webkit` using [Playwright](https://playwright.dev/).

---

## Project structure

```
e2e/
├── test/                # Playwright test specs
├── util/                # Shared Playwright helpers
playwright.config.ts     # Playwright configuration
stories/                 # Storybook stories used as test targets
```

Tests live in `e2e/test/` and run against Storybook stories. By default the local
base URL is `http://localhost:6006/`, so tests navigate to Storybook iframe URLs such as:

```ts
await page.goto(
  'iframe.html?globals=&args=&id=components-button-button--primary&viewMode=story'
);
```

The target environment can also be switched with `TEST_ENV` to one of the configured
remote Storybook deployments: `dev`, `sit`, `sit-stg`, `uat`, `uat-stg`, `qa`,
`qa-stg`, or `pt`.

---

## Running tests

All commands below must be run from the worktree root
(`55313-sc-dev-web/.history/13239181-playwright/`).

### Run the full local flow

Use the wrapper script when you want npm to start Storybook for you:

```bash
npm run e2e
```

This starts Storybook on `http://localhost:6006/`, waits for it to be ready, runs the
Playwright suite in Microsoft Edge, and then exits.

### Start Storybook yourself

If Storybook is already running, or you want to keep it open while iterating, start it
in a separate terminal:

```bash
npm run storybook
```

### Run all tests

With the target environment already available, run:

```bash
npm run e2e:run
```

This uses the configured Playwright `baseURL`. Locally that is `http://localhost:6006/`.

### Open Playwright UI

With Storybook already running locally, open the Playwright UI runner:

```bash
npm run e2e:ui
```

### Run a specific spec file

Pass the spec path through to Playwright:

```bash
npm run e2e:run -- e2e/test/sc-data-grid.spec.ts
```

Run from a specific line and stop on first failure:

```bash
npm run e2e:run -- e2e/test/sc-data-grid.spec.ts:57 -x
```

### Run headed

Set `HEADED=1` to open Microsoft Edge visibly:

```bash
HEADED=1 npm run e2e:run
```

### Run against a remote Storybook environment

Select one of the configured remote environments with `TEST_ENV`:

```bash
TEST_ENV=dev npm run e2e:run
```

Available values: `local`, `dev`, `sit`, `sit-stg`, `uat`, `uat-stg`, `qa`, `qa-stg`, `pt`.

---

## CI behaviour

| Setting | Local (`TEST_ENV=local`) | CI or remote `TEST_ENV` |
|---|---|---|
| Retries | 1 | 2 |
| Workers | 1 | 1 |
| `test.only` | Allowed | Fails the build |
| Reporter | HTML (`open: never`) | `genie-playwright` |
| Browser | Microsoft Edge | Microsoft Edge |
| Timeout per test | 10 s | 30 s |

---

## Configuration reference

See [`playwright.config.ts`](../playwright.config.ts) for the full configuration.

Key settings:

| Option | Value |
|---|---|
| `testDir` | `./e2e/test` |
| `baseURL` | `http://localhost:6006/` locally, or `TEST_ENV` remote Storybook URL |
| `timeout` | `10 000` ms locally, `30 000` ms remotely |
| `globalTimeout` | `30m` locally, `60m` remotely |
| `retries` | `1` locally, `2` in CI or remote runs |
| `workers` | `1` |
| `screenshot` | `only-on-failure` |
| `video` | `off` |
| `trace` | `retain-on-failure` |
| `ignoreHTTPSErrors` | `true` |

---

## Writing new tests

1. Find the component story in `stories/` and pick the default or most representative story.
2. Create or update the relevant `*.spec.ts` file in `e2e/test/`.
3. Navigate to the Storybook iframe URL for that story in `test.beforeEach(...)`.
4. Reuse the same story URL within a `describe` block and change component state in-page
   when possible instead of navigating between stories for every test.

```ts
import { test, expect } from '@playwright/test';

test.describe('sc-button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'iframe.html?globals=&args=&id=components-button-button--primary&viewMode=story'
    );
  });

  test('renders the primary button story', async ({ page }) => {
    await expect(page.locator('sc-button')).toBeVisible();
  });
});
```

### Performance Optimization

In order to ensure that all components are able to run on time, it is recommended to lessen the number of test blocks as much as possible. Each test block opens & loads a new page which is a time consuming overhead each time especially for remote env.

1. Combine assertions in a single block if possible where it does not conflict with other states.
2. Keep test block execution in under a second or 2 at most.
3. Do not repeat tests or assertions that are already executed in another test

### Use AI Agent

Attach the component and prompt "add e2e", agent will look for the appropriate story & create a spec file for it. Review the generated file for further optimizations.

---

## Viewing reports

After a local run, Playwright generates an HTML report. Open it with:

```bash
npx playwright show-report
```
