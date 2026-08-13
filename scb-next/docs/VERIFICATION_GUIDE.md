# SCB Next complete verification guide

Use this runbook to independently verify the requested SCB migration, functional parity, visual parity, automated tests, and production-style Nginx deployment.

The commands assume the repository is at `/Users/lushevol/code/github/fdc3-broker-next`. If yours is elsewhere, substitute that path.

## 1. Prerequisites

Required tooling:

- Node.js and npm compatible with Vite 8;
- Docker with the `docker-compose` command;
- Chromium installed by Playwright;
- ports `8001`, `8009`, and `8015` for development verification;
- port `9081` for production-edge verification.

Vite 8 requires Node.js `20.19+` or `22.12+`; Node 22 LTS is the preferred verification runtime.

If you have access to the corporate npm registry, install from the SCB Next root:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm install
npx playwright install chromium
```

The clean install can be blocked outside the corporate network by private `@scdevkit/webkit` packages. If dependencies are already installed from the repository's compatible toolchain, do not delete or regenerate them merely to run acceptance. If neither corporate registry access nor the existing installation is available, record frontend dependency installation as blocked rather than claiming a clean-build pass.

## 2. Verify the copied scope

Confirm that the isolated migration contains both source areas and that the original `scb` tree still exists as the rollback/reference source:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next
test -d scb/web
test -d scb/services
test -d scb-next/web
test -d scb-next/services
```

Review the migration scope and architectural decisions:

- [Migration specification](MIGRATION_SPEC.md)
- [Migration runbook](MIGRATION.md)
- [Dependency research](dependency-research.md)
- [Recorded production acceptance](PRODUCTION_ACCEPTANCE.md)

The dependency report records the latest versions checked at migration time, retained dependencies, proposed replacements, compatibility risks, and private-package blockers. Major React, UI framework, grid, GraphQL, and Spring upgrades are intentionally separate compatibility stages; they should not be treated as part of the federation cutover unless their complete regression suites are rerun.

## 3. Verify the architecture

Run the executable architecture assertions:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm test -- --run tests/architecture.test.ts
```

Expected result: `10 passed`.

These assertions verify:

- all three active origins use Vite and Vitest;
- no active Single-SPA or Webpack dependency remains in those origins;
- Base is the host on port `8001`;
- Ratan is a federated remote on port `8009`;
- Cashflow is the second-layer remote on port `8015`;
- React and router sharing is configured across federation boundaries;
- production remote URLs and public bases are environment-configurable;
- Nginx packages both remote paths, BFF forwarding, security headers, health checks, and read-only container controls.

## 4. Verify unit tests

Run the root architecture tests and every workspace unit suite:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm test
npm run test:unit
```

For a focused Cashflow gate:

```bash
npm run test --workspace @fm/ratan_cashflow_blotter-origin -- --reporter=dot
```

Recorded Cashflow baseline:

- 241 test files passed;
- 1,946 tests passed;
- 17 tests intentionally skipped.

The workspace's explicit `coverage` command is not the unit-test acceptance gate. Its legacy blanket dependency inlining also transforms Vitest's coverage runtime and exposes pre-existing Ant Design/hoisted-mock behavior. Treat coverage remediation as migration debt and use the deterministic `npm test` result for this cutover.

The repository-wide `npm run typecheck` likewise still exposes pre-existing Jest setup, legacy prop, and TypeScript compatibility debt. A successful Vite production build is required below, but do not record strict typecheck as passing until that separate debt is resolved.

## 5. Verify the copied service

The copied backend scope contains `services/single-ui-bff`. It intentionally retains its HTTP contracts while the browser acceptance composition substitutes deterministic Nginx fixtures.

With JDK 17+, Maven, corporate Artifactory configuration, and credentials available, run:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next/services/single-ui-bff
mvn test
mvn clean package
```

Expected result in a fully provisioned corporate environment: tests pass and Maven produces the deployable service package without route/schema changes.

Outside that environment, Maven cannot resolve private artifacts such as:

- `com.scb.ratan:ratanone-service-spring-boot-starter:6.3.1`;
- `com.scb.ratan:ratanone-hashicorp-integrator-spring-boot-starter:6.3.1`.

An unresolved private artifact is an external release blocker, not a test pass. Capture the Maven error, mark the real-BFF build and backend-connected journey as blocked, and continue only with the explicitly labeled mock-BFF acceptance below.

## 6. Verify development federation

Start all three origins:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run dev
```

In a second terminal, verify the host and remote manifests:

```bash
curl -f http://127.0.0.1:8001/
curl -f http://127.0.0.1:8009/remoteEntry.js
curl -f http://127.0.0.1:8015/remoteEntry.js
```

Run development-origin E2E coverage while those servers remain running:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run test:e2e
```

Expected development result: the two development scenarios pass and the production-only scenario is skipped.

Stop the development process with `Ctrl+C` before production verification so it does not obscure port or console evidence.

## 7. Build and start the production Nginx composition

The production layout follows the MVP Real World DevOps rules: one Nginx composition root, immutable hashed assets, non-cached federation manifests, same-origin remote paths, configurable BFF forwarding, health checks, security headers, read-only filesystems, tmpfs runtime paths, and `no-new-privileges`.

Build the three frontend artifacts with production remote URLs:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
SCB_NEXT_EDGE_ORIGIN=http://127.0.0.1:9081 npm run build:production
```

Expected result: Base, Ratan, and Cashflow complete `vite build` successfully. Large-chunk and legacy deprecation warnings are documented performance debt, not build failure.

Start the Nginx edge and deterministic mock BFF:

```bash
npm run serve:production
docker-compose -f devops/docker-compose.production.yml ps
```

Expected edge URL: `http://127.0.0.1:9081`.

## 8. Verify Nginx routing and deployment controls

Run these checks while the production composition is running:

```bash
curl -f -i http://127.0.0.1:9081/healthz
curl -f -I http://127.0.0.1:9081/remotes/ratan/remoteEntry.js
curl -f -I http://127.0.0.1:9081/remotes/cashflow/remoteEntry.js
curl -f http://127.0.0.1:9081/
```

Confirm:

- `/healthz` returns HTTP 200 and `{"status":"ok","composition":"scb-next"}`;
- both `remoteEntry.js` requests return HTTP 200;
- federation manifests have `Cache-Control: no-store`;
- the host page includes security headers such as `Content-Security-Policy`, `X-Content-Type-Options`, and `X-Frame-Options`;
- hashed JavaScript/CSS assets are served with immutable caching;
- `docker-compose ... ps` shows the edge healthy;
- the edge and mock BFF use read-only filesystems and `no-new-privileges` in `devops/docker-compose.production.yml`.

The acceptance composition routes `/api/` to the mock BFF. For a real environment, set `BFF_ORIGIN` to the real service origin in the edge deployment; frontend artifacts do not need rebuilding.

## 9. Run production E2E acceptance

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
PLAYWRIGHT_BASE_URL=http://127.0.0.1:9081 \
PLAYWRIGHT_PRODUCTION_EDGE=1 \
npm run test:e2e
```

Expected production result:

- production fixture login passes;
- the Base host opens the Ratan container;
- Ratan loads Cashflow through the second federation boundary;
- both fixture rows appear;
- one production test passes and the two development-only tests are skipped.

## 10. Live Browser manual acceptance

Open `http://127.0.0.1:9081/?show_normal_login=Y&survey=no` in Live Browser.

Use these mock credentials:

- username: `mock.cashflow`
- password: `acceptance`

### Login and workspace

1. Confirm the login screen shows username, password, SSO, the Markets Operations One hero, and the green Sign In action.
2. Sign in with the mock credentials.
3. Confirm the dark portal header, UTC control, avatar, workspace tab area, and `New Tile` action are visible.
4. Select `New Tile` and confirm the drawer contains all eight Cashflow applications.
5. Open an application, confirm it creates a workspace tab, then use the tab delete/close action and confirm the application is removed.

### Screen-by-screen checklist

Open each drawer entry separately and compare the observed features and styling with this checklist:

| Screen | Required acceptance evidence |
| --- | --- |
| Cashflow Blotter | Quick Search, preset counts, custom search/view controls, grid controls, `CF-ACCEPT-001`, `CF-ACCEPT-002`, formatted status/date/currency/amount values, result count `2/2` |
| Cashflow Open Search | Access/whitelist permission gate renders rather than a blank or broken remote |
| Cashflow Group Management | Search form, results grid, responsive columns |
| Cashflow Dashboard | Region/entity filters, status cards, refresh or notification state |
| BIC Netting Static Table | Filters, Create, Audit, Export, pagination, and grid |
| Utilization Static Table | Filters, Create, Audit, Export, and results grid |
| Cashflow Authorization Limits | Create action and Profile, Currency, Limitation, and Actions columns; this also verifies authenticated permission propagation across federation |
| Cashflow Splitting Static | Filters, Create, Audit, Export, and results grid |

For every screen, also verify:

- fonts, colors, spacing, borders, icons, tables, tabs, and buttons match the migrated SCB presentation;
- there is no blank application body or uncaught page error;
- the browser network panel shows both federation manifests loaded through `/remotes/`;
- ordinary API traffic goes through `/api/`, not directly to a hard-coded backend host;
- opening and closing tabs does not corrupt the other workspace tabs.

### Responsive check

Resize Live Browser to `1024×768`, revisit the workspace and at least the Blotter and Authorization Limits screens, and confirm:

- no document-level horizontal scrollbar appears;
- navigation and primary actions remain reachable;
- grids remain contained within their workspace panel.

Expected mock-only console behavior:

- notification-backed screens may report reconnect state because the fixture BFF does not emulate WebSocket/STOMP subscriptions;
- Apollo may warn about deprecated `addTypename` configuration;
- AG Grid may warn about deprecated v32 grid/selection options.

Record these as known legacy warnings. Any blank remote, missing action, uncaught page error, failed federation manifest, unexpected HTTP 4xx/5xx, or lost styling is a failed acceptance condition.

## 11. Verify against the real BFF

This stage is mandatory for final production certification, even after all mock acceptance passes.

1. Deploy or start the successfully packaged `single-ui-bff` with its required database, LDAP/authentication, discovery, secrets, and downstream services.
2. Change the edge container's `BFF_ORIGIN` from `http://mock-bff:8081` to the real BFF origin.
3. Recreate the edge container; do not rebuild the three frontend artifacts.
4. Repeat the Nginx HTTP checks, production Playwright journey, and every Live Browser screen check.
5. Use a permitted test user whose entitlements cover the expected Cashflow actions.
6. Verify real search, filtering, pagination, create/audit/export actions, permission gates, error states, and WebSocket/STOMP notifications.
7. Confirm no fixture identifiers such as `CF-ACCEPT-001` remain in the real-environment evidence.

Do not label the complete system production-certified until this backend-connected stage passes. Mock acceptance certifies frontend composition, routing, deterministic rendering, permissions bridging, and styling; it does not certify private infrastructure or real business data.

## 12. Evidence to retain

For a formal sign-off, retain:

- terminal output for architecture and unit tests;
- terminal output for all three production builds;
- `docker-compose ... ps` and `/healthz` output;
- response headers for both federation manifests and one immutable hashed asset;
- Playwright production result;
- one screenshot of login, workspace drawer, and each of the eight screens at desktop width;
- responsive screenshots at `1024×768`;
- browser console and failed-network-request export;
- the commit SHA being accepted.

Use [PRODUCTION_ACCEPTANCE.md](PRODUCTION_ACCEPTANCE.md) as the baseline result sheet. Add the verifier, date, environment, commit SHA, and pass/fail evidence to a copy of that report for each release candidate.

## 13. Stop and clean up

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run stop:production
```

Confirm the SCB Next edge is no longer listening on port `9081`.

## Final acceptance criteria

Approve the migration candidate only when:

- architecture assertions pass;
- deterministic unit and E2E tests pass;
- the private BFF tests and package build pass in a corporate environment, or are explicitly recorded as a release blocker;
- all three Vite production builds succeed;
- Nginx health, caching, security headers, federation routes, and BFF forwarding are correct;
- mock login succeeds;
- all eight screens pass the feature/style checklist at desktop and responsive widths;
- no unexplained browser errors or failed requests remain;
- known warnings and unresolved private-backend, coverage, and strict-typecheck gates are explicitly recorded rather than reported as complete.
