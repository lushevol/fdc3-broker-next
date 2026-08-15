# SCB Next verification guide

This guide is the executable release gate for the migration defined by
[MIGRATION.md](MIGRATION.md) and [MIGRATION_SPEC.md](MIGRATION_SPEC.md). Run it
from the checkout being accepted. A dated report, an earlier test count, or a
successful build from another checkout is context only and MUST NOT replace a
current command result.

The commands assume the repository is at
`/Users/lushevol/code/github/fdc3-broker-next`. Substitute the actual absolute
path when another checkout is used.

## Verification rules

1. Record the target commit, dirty-worktree state, runtime versions, registry,
   operating system, and execution date before running a gate.
2. Preserve the complete command, exit code, and unedited output for every
   applicable gate.
3. Mark a gate `pass`, `fail`, `blocked`, or `not applicable`. A blocked gate
   includes the failing command, exact error, owner, and prerequisite needed to
   unblock it.
4. Stop claiming release readiness after any required gate fails. Continue
   diagnosis only when doing so cannot overwrite acceptance evidence.
5. Run frontend verification from leaf to host: Cashflow, Ratan, then Base.
6. Treat fixture-backed browser results as frontend-composition evidence. Only
   a real-BFF run can certify production business behavior.
7. Treat [PRODUCTION_ACCEPTANCE.md](PRODUCTION_ACCEPTANCE.md) as a dated
   historical snapshot and report template, never as current evidence.

## 1. Record the candidate

```bash
cd /Users/lushevol/code/github/fdc3-broker-next
git rev-parse HEAD
git status --short
node --version
npm --version
npm config get registry
uname -a
date -u
```

Record the legacy `scb/` source revision separately when it differs from the
target repository revision. The worktree may contain unrelated user changes,
but the acceptance record must identify them and the migration commit must not
include them.

Completion criterion: the handoff identifies the legacy source SHA, target
starting SHA, candidate SHA, environment, and every pre-existing worktree
change.

## 2. Verify prerequisites and source isolation

Required tools and endpoints:

- Node.js `20.19+` or `22.12+`; Node 22 LTS is preferred for Vite 8;
- npm with access to the configured corporate registry;
- Chromium installed for Playwright;
- Docker and `docker-compose` for the production-edge branch;
- JDK 17+, Maven, corporate Artifactory, and service credentials for real-BFF
  certification;
- development ports `8001`, `8009`, and `8015`;
- production-edge port `9081`.

Confirm the source and target ownership roots:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next
test -d scb/web
test -d scb/services
test -d scb-next/web
test -d scb-next/services
```

`scb/` is read-only reference and rollback evidence. The active target must not
import, link, serve, or build from it.

Completion criterion: all required roots exist, prerequisites are recorded,
and no migration step has modified `scb/`.

## 3. Install and prove dependency isolation

Install from the SCB Next root. Do not create child lockfiles or flatten Base's
MUI 9 tree over the unchanged MUI 5 remote trees.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm install
npm run verify:dependency-isolation
npm ls --all
npx playwright install chromium
```

The isolation gate must prove all of the following:

- Base resolves its declared MUI 9 and MUI X 9 packages;
- Ratan resolves its declared MUI 5 packages and icons;
- Cashflow resolves its declared MUI 5 packages and icons;
- all active origins remain on compatible React 18 versions;
- the root lockfile describes the complete workspace installation;
- no invalid, extraneous, or unresolved dependency affects the active graph.

If `npm install` cannot access private packages, record the registry and exact
package error as a blocker. An existing `node_modules` tree may be used for
diagnosis, but it is not clean-install evidence.

Missing paths such as `@mui/icons-material/DeleteOutline` in Ratan or
`@mui/icons-material/CheckCircleOutline` in Cashflow indicate broken workspace
isolation. Restore the declared nested MUI 5 installation through the correct
registry. Do not upgrade Ratan, Cashflow, or React to work around it.

Completion criterion: install, isolation verification, and `npm ls --all` all
exit successfully from the candidate lockfile.

## 4. Run architecture and development-mock contract tests

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm test -- tests/architecture.test.ts --run
npm test -- tests/dev-mock-api.test.ts --run
npm test
```

At the time this guide was written, the root suite contains 21 tests, including
8 focused development/production-mock tests. Counts may increase. Acceptance depends on
the current discovered suite passing, not on reproducing those historical
numbers.

The mock test must cover:

- normal login, token header, entitlements, and drawer entries;
- metadata and generic fallbacks;
- all four predefined metric requests;
- initial Cashflow data;
- ID search for `M0P56753524`;
- matching detail, accounting-empty, and currency-holiday responses;
- saved filter `Pending operator cashflows`;
- saved view `Cashflow operations`;
- executable SockJS JSONP open, connected, heartbeat/send behavior.

Completion criterion: focused architecture, focused mock, and complete root
suites pass from the candidate checkout.

## 5. Verify Cashflow, Ratan, and Base separately

Run tests and builds in dependency order so a leaf failure cannot be hidden by
a host result.

### Cashflow

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm exec --workspace @fm/ratan_cashflow_blotter-origin -- vitest run --reporter=dot
npm run build --workspace @fm/ratan_cashflow_blotter-origin
```

### Ratan

```bash
npm exec --workspace @fm/ratan_container-origin -- vitest run
npm run build --workspace @fm/ratan_container-origin
```

### Base

```bash
npm exec --workspace @fm/base-origin -- vitest run
npm run build --workspace @fm/base-origin
```

Run Storybook tests/builds when the changed Base surface has Storybook coverage
or a workspace script defines that gate. Then run the aggregate build gate:

```bash
npm run build
```

The workspace `npm run test:unit` command invokes Base and Ratan package scripts
with coverage enabled. That instrumentation currently exposes recorded legacy
Ant Design and hoisted-mock debt, so it is not a substitute for the functional
Vitest commands above. Run `npm run test:unit` and `npm run typecheck` when the
release policy requires those debt gates, preserve their actual results, and
never report them as passing based on a production build.

Completion criterion: each leaf-to-host test and build is independently green,
and aggregate commands do not reveal an additional integration failure.

## 6. Verify the copied BFF

The copied service is `services/single-ui-bff`. Its public HTTP, GraphQL,
authorization, and notification contracts remain unchanged.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next/services/single-ui-bff
mvn test
mvn clean package
```

Private artifacts such as the following require the corporate Maven setup:

- `com.scb.ratan:ratanone-service-spring-boot-starter:6.3.1`;
- `com.scb.ratan:ratanone-hashicorp-integrator-spring-boot-starter:6.3.1`.

An unresolved private artifact is a release blocker. It is not a skipped pass,
and the frontend fixture layer does not substitute for this gate.

Completion criterion: the BFF tests and package build pass in a provisioned
environment without route or schema drift.

## 7. Start and probe the development composition

Start all three origins:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run dev
```

Keep that process running. In another terminal:

```bash
curl -f http://127.0.0.1:8001/
curl -f http://127.0.0.1:8009/remoteEntry.js
curl -f http://127.0.0.1:8015/remoteEntry.js
```

The Base development server owns the request-aware cross-MFE mock. No backend
process is required for this development-only fixture journey.

Run Playwright against the development origins:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run test:e2e
```

Current Playwright coverage is a smoke gate, not proof of the full captured
journey. Complete the following Live Browser gate as well.

Completion criterion: all origins and remote entries respond, development
Playwright passes, and no origin silently falls back to a stale process.

## 8. Complete the development Live Browser journey

Open
`http://127.0.0.1:8001/?show_normal_login=Y&survey=no` in Live Browser at a wide
desktop viewport, approximately `2048x1152`.

Use `mock.cashflow` / `acceptance` and execute this exact journey without
reloading between steps:

1. Sign in and verify the portal header, theme, UTC control, avatar, workspace
   tabs, and `New Tile` action.
2. Select `New Tile`; verify the drawer and open `Cashflow Blotter`.
3. Verify `Quick Search`, `Custom Search/View`, grid controls, and all four
   predefined metrics render with production-consistent styling.
4. Verify the initial grid renders production-shaped records, readable values,
   selection controls, result count, borders, row/header styles, and contained
   scrolling.
5. Search for Cashflow ID `M0P56753524`; verify exactly the captured row and
   successful result state.
6. Double-click that row. Verify Cashflow Detail opens and shows the same ID,
   trade `56753524`, state `WAITING`, currency `USD`, amount `11.10`, payment
   date `2026-08-14`, and Pending Operator state.
7. Open `Accounting Detail`; verify its empty response renders as an intentional
   empty state, not an error or indefinite spinner.
8. Close the detail dialog. Open Custom Search and verify the dialog is dark,
   closable, viewport-contained, and shows `Pending operator cashflows`.
9. Open Custom View and verify the selector shows `Cashflow operations`.
10. Open View Builder and verify its name, search, role/private controls,
    Available Fields, Display View, and close action are visible and aligned.
11. Close the application using its workspace-tab delete action; verify other
    workspace state remains usable.

Inspect computed presentation and behavior throughout:

- Poppins and compact Base component defaults are present;
- MUI controls match the accepted Material UI styling and have not been reset
  by a later Emotion/MUI injection;
- Ant Design controls and portals retain the dark theme;
- `.ag-theme-alpine-dark` has readable text, stable row height, and visible
  borders;
- dialogs remain within the viewport and above the workspace;
- fonts, images, icons, CSS, remote chunks, and API calls return successfully;
- loading, empty, selected, disabled, hover, and close states are coherent;
- no content overlap or document-level horizontal overflow occurs.

Repeat the workspace, Blotter, details, and builder checks at `1024x768`.

### Console and network gate

Capture the browser console and failed-request list. In development, any
notification reconnect alert, SockJS/JSONP syntax error, uncaught exception,
failed remote/chunk request, unexpected HTTP 4xx/5xx, or blank application is a
failure. The development mock implements SockJS JSONP; these symptoms are not
accepted legacy warnings.

Apollo `addTypename`, AG Grid v32, React lifecycle, Ant Design, or Redux
serializability warnings may be inherited debt only when each exact warning is
recorded and demonstrated not to break the journey. A new warning is a failure
until classified.

Completion criterion: the uninterrupted journey passes at both viewports with
screenshots, console export, and network evidence, and with no notification or
JSONP mock error.

## 9. Inspect target independence and built artifacts

After successful builds, search source and generated artifacts for forbidden
active dependencies. Review every match rather than trusting a raw count.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
rg -n "single-spa|single-spa-react|single-spa-layout|System\.import|importmap" web package.json package-lock.json
rg -n "(/|\.\./)scb/|fdc3-broker-next/scb/" web devops package.json package-lock.json
rg -n "single-spa|System\.import|importmap|fdc3-broker-next/scb/" web/*/dist
```

Source retained only as unreachable migration history must be identified and
proved absent from the active bundle. Inspect `remoteEntry.js` and its chunks
to verify remote public bases, a compatible React share scope, and no
host-relative remote asset URL.

Completion criterion: active source and built artifacts have no runtime/build
dependency on legacy composition or `scb/`, and every historical-only match is
documented.

## 10. Build the production edge from leaf to host

Stop the development composition first. Then run the authoritative production
script, which builds Cashflow, Ratan, and Base in that order:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
SCB_NEXT_EDGE_ORIGIN=http://127.0.0.1:9081 npm run build:production
```

When port `9081` is reserved, use one explicit alternative for both the build
and composition:

```bash
SCB_NEXT_EDGE_PORT=9082 \
SCB_NEXT_EDGE_ORIGIN=http://127.0.0.1:9082 \
npm run serve:production
```

Start and inspect the edge only after all three builds pass:

```bash
npm run serve:production
docker-compose -f devops/docker-compose.production.yml ps
curl -f -i http://127.0.0.1:9081/healthz
curl -f -I http://127.0.0.1:9081/remotes/ratan/remoteEntry.js
curl -f -I http://127.0.0.1:9081/remotes/cashflow/remoteEntry.js
curl -f http://127.0.0.1:9081/
```

Verify HTTP 200, `no-store` on federation manifests, immutable caching on
hashed assets, security headers, same-origin remote paths, a healthy edge,
read-only filesystems, required `tmpfs`, and `no-new-privileges`.

Completion criterion: all three artifacts build in order and the deployed edge
serves the expected host, manifests, chunks, headers, and health response.

## 11. Verify production-mock parity

The Base development adapter and production Node mock use the same canonical
request-aware handler. Production adds a real SockJS WebSocket upgrade path and
retains JSONP coverage. Verify the complete captured journey through the edge,
including an empty console-error list.

Run the production acceptance test:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
PLAYWRIGHT_BASE_URL=http://127.0.0.1:9081 \
PLAYWRIGHT_PRODUCTION_EDGE=1 \
npm run test:e2e
```

The production scenario must verify login, both federation boundaries, four
metrics, initial grid, `M0P56753524` search/details, accounting empty state,
saved custom search, View Builder, styling, and notification startup. The three
development-only scenarios are expected to be skipped in this mode.

Completion criterion: production Playwright and the section 8 Live Browser
journey pass with no page error, console error, fallback alert, failed remote,
or failed notification transport.

## 12. Verify against the real BFF

This gate is mandatory for production certification.

1. Start or deploy the packaged `single-ui-bff` with its required database,
   identity, discovery, secrets, and downstream services.
2. Set the edge `BFF_ORIGIN` to the real service origin and recreate the edge;
   do not rebuild the frontend artifacts.
3. Repeat the routing/header probes, production Playwright, section 8 Live
   Browser journey, and all eight drawer routes.
4. Use an approved test identity with the expected Cashflow entitlements.
5. Verify real search, filtering, pagination, details, create/audit/export,
   permission gates, errors, and SockJS/STOMP notifications.
6. Confirm fixture-only IDs and credentials do not appear in real-environment
   evidence.

For each drawer route, accept the intended business screen or entitlement gate:

| Route                         | Required surface                                         |
| ----------------------------- | -------------------------------------------------------- |
| Cashflow Blotter              | quick/custom search, custom view, metrics, grid, details |
| Cashflow Open Search          | application or intentional access gate                   |
| Cashflow Group Management     | search form and responsive results grid                  |
| Cashflow Dashboard            | region/entity filters, status cards, notifications       |
| BIC Netting Static Table      | filters, Create, Audit, Export, pagination, grid         |
| Utilization Static Table      | filters, Create, Audit, Export, results grid             |
| Cashflow Authorization Limits | permission-aware Create and limits grid                  |
| Cashflow Splitting Static     | filters, Create, Audit, Export, results grid             |

Completion criterion: the real-BFF journey passes with real identity,
authorization, API, notification, CSP/CORS, license, and telemetry contracts.

## 13. Diagnose common failures

| Symptom                                       | Likely boundary                                         | First required check                                                |
| --------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| `@mui/icons-material/*` cannot resolve        | flattened Base MUI 9 over remote MUI 5                  | rerun install/isolation gate and inspect workspace-local resolution |
| invalid hook call or `ReactCurrentDispatcher` | duplicate React share                                   | compare all manifests and React 18 singleton declarations           |
| remote entry loads but a chunk is 404         | wrong `VITE_PUBLIC_BASE`                                | inspect remote entry and failing chunk URL                          |
| MUI controls lose accepted styling            | Emotion insertion order or incomplete Base theme facade | compare providers and computed styles at the failing control        |
| Ratan action selectors stop matching          | CSS namespace drift                                     | verify `MicroWebUI_ratan_container` in source and bundle            |
| grid is unstyled or transparent               | missing/local skin order                                | inspect bundled Ratan grid CSS and computed grid styles             |
| `process` or `global` is undefined            | untranslated compile-time global                        | inspect Cashflow Vite aliases and `define` values                   |
| browser requests Node `net` from STOMP        | wrong STOMP entry                                       | verify the browser-compatible alias                                 |
| JSONP `Unexpected token ':'`                  | generic JSON handled a SockJS script request            | inspect JSONP route order and executable callback body              |
| drawer is blank after stale login             | fixture identity absent from current state              | log out and complete the documented login flow                      |
| custom lists are empty                        | wrong endpoint shape or builder `type`                  | inspect request query and array fixture                             |
| details show fallback                         | list/detail IDs or operation matching diverge           | compare search request, detail request, and fixture IDs             |
| host builds but integrated screen fails       | provider/federation/CSS boundary                        | return to leaf builds and development browser evidence              |

Completion criterion: each failure is traced to an owning boundary and fixed at
the source or configuration layer; generated `dist/` files are never patched.

## 14. Retain a complete evidence manifest

Return this exact record with the migration handoff:

```text
Verifier and UTC date:
Environment (OS, Node, npm, registry, browser):
Legacy source SHA:
Target starting SHA:
Target ending SHA:
Pre-existing worktree changes:
Scope migrated:
Files intentionally copied:
Files intentionally translated:
Compatibility capabilities added:
External contracts preserved:
Dependencies changed (or "none"):
Mock contracts added/changed:
Install result:
npm ls result:
Focused tests and results:
Workspace tests and results:
Dependency isolation result:
Build results for Cashflow, Ratan, Base:
Development Playwright result:
Development Live Browser evidence:
Production-edge smoke result:
Production-mock full-parity result:
Real-BFF result:
Artifact and remote-entry inspection:
Console and failed-network evidence:
Screenshots/traces/log locations:
Known warnings/debt:
Blocked gates and exact cause:
Rollback revision, owner, and routing action:
Commits created:
```

A field must contain evidence, `not applicable` with a reason, or `blocked`
with the command and cause. Keep command logs, edge status and headers,
Playwright output/traces, desktop and `1024x768` screenshots, browser console,
failed network export, artifact digests, remote URLs, `BFF_ORIGIN`, and the
accepted lockfile.

Completion criterion: another verifier can reproduce every claim from the
candidate SHA and retained evidence without relying on oral context.

## 15. Stop and clean up

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run stop:production
```

Stop the development process separately with `Ctrl+C`. Confirm ports `8001`,
`8009`, `8015`, and `9081` are no longer served by the candidate processes.

## Final acceptance

Approve the frontend migration candidate only when install/isolation,
architecture, mock contracts, leaf-to-host tests/builds, development
Playwright, the complete Live Browser journey, and artifact inspection all pass
from the current checkout. Approve the production composition only when the
edge controls pass and the claimed mock scope is labeled accurately. Approve
the complete system for production only when the private BFF build and real-BFF
browser journey also pass.

Any failed or blocked required gate keeps the corresponding acceptance level
open. Historical reports and fixture-only results cannot close it.
