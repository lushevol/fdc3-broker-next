# UI Package Release and Rollback

`ratan-design-origin@0.1.0` is an internal/local release candidate. No registry
publication, production deployment, redistribution approval or Pro license
initialization is performed by this migration.

## Current status (2026-10-02)

The package is usable for repository development and the Base migration has
passed its package-contract and import-boundary checks. The stricter browser gate
now captures console errors and failed requests; it detects `MUI: Missing license
key` in the Pro date-range examples. The complete Storybook gate remains blocked
until an approved key is supplied. This is not a production release yet. Before
publication, the team still needs to:

1. finish the missing Base parity fixtures and record the Cashflow development
   error separately from package behavior;
2. name a release owner and backup, choose the private registry and access list,
   approve packaged font redistribution, and assign MUI X Pro ownership; and
3. review a locally prepared tarball/checksum and complete browser/portal evidence,
   then publish it to the approved registry and retain the previous artifact for
   rollback.

The aggregate quality command is useful evidence for the package candidate, but
it does not by itself prove every Base page state or complete the later
Ratan/Cashflow direct-MUI backlog. That backlog is tracked in the
[Base migration plan](BASE_UI_COMPONENT_MIGRATION_PLAN.md#deferred-backlog-full-ratancashflow-package-adoption).

## Publication Decision Record

The repository currently provides no CODEOWNERS assignment or other authoritative
source for the required people and external approvals. Until the unresolved rows
below are completed by the organization, `packages/ratan-design-origin/package.json`
sets `private: true`. Public npm publication and production use of the Pro entry
are prohibited. Removing that guard is a reviewed release change, not a packaging
cleanup.

| Decision | Current recorded state | Required evidence before release |
| --- | --- | --- |
| Release owner | **BLOCKED — named owner not supplied.** Repository commit identity is not release authorization. | Named accountable person or durable team alias accepting version, evidence, rollout and rollback duties. |
| Backup owner | **BLOCKED — named backup not supplied.** | Named person or durable team alias able to execute release and rollback independently. |
| Registry/access/visibility | **BLOCKED — registry and entitlement not supplied.** Candidate remains local/private; public npm is not authorized. | Exact corporate registry, scoped package name, restricted visibility, publisher group and read/install audience. |
| Maintainer reviews | Responsibilities are defined below; assignees are not yet mapped to authoritative identities. | Design-system, Base, Ratan and Cashflow approvers recorded for the candidate. |
| Asset/font redistribution | **BLOCKED — no approval recorded.** NOTICE restrictions remain controlling. | Written approval covering SC WebKit 2.0.5 and every packaged WOFF2 asset for the selected registry/audience. |
| MUI X Pro | **BLOCKED — production license and initialization owner not supplied.** Core/community entries remain usable locally; production `date-range` adoption is prohibited. | Entitled production owner, license scope, secure initialization location and renewal/support responsibility. |
| Immutable artifacts | Required policy is defined below; destination and retention duration await the release owner. | Content-addressed tarball, SHA-256, source commit, validation log, catalog/screenshots and previous rollback artifact in the approved immutable store. |

Approval updates must include the approving identity, date and evidence reference in
this table and the matching changelog entry. Do not record credentials or license
keys in the repository.

## Versioning and Review

Use semantic versioning. Patch releases preserve behavior and visual contracts;
minor releases add compatible props/exports. Breaking props, types, defaults,
selectors, peer minima or visual behavior require a major version (or a minor
while pre-1.0), migration notes and explicit consumer review. Fixing an intentional
legacy behavior still needs a compatibility assessment.

Record each release in packages/ratan-design-origin/CHANGELOG.md. Include the
contract/visual change, supported matrix, validation and rollback target. Keep
the package version and adopted version consistent. Pin an exact package version
for a registry rollout; local file dependencies are repository development only.
Do not broaden peer ranges based solely on matching major versions.

The release owner, registry/access policy and named backup remain blocked as recorded
above. Assign them before publication. Required review responsibilities:

- Design-system maintainer: public API, semantic tokens, accessibility, legacy/
  WebKit light/dark/mobile comparison, and packaged asset provenance.
- Base maintainer: namespace/default/type compatibility, workspace/portal policy
  and host login/add/render/delete journey.
- Ratan and Cashflow maintainers: unchanged screen imports, local UI dependency
  resolution, loading/Dialog behavior and theme policy.
- Release owner: version/changelog, approved registry/visibility, immutable
  artifact/checksum, rollout evidence and a retained rollback artifact.
- Asset/license owner: SC WebKit/fonts redistribution decision and production
  MUI X Pro license/initialization responsibility where date ranges are used.

Names and external approvals are release gates, not assumed by local validation.

## Contribution Checks

Specify defaults, controlled state, callbacks/reasons, refs, slots, accessibility,
responsive behavior and host boundaries before coding. Add behavior tests through
public package imports or compatible consumer exports. Run upstream GitNexus
impact before symbol edits, staged detect_changes before a focused commit,
package coverage above 90% lines/branches, typecheck/lint/build and catalog build.
Record intentional compatibility styles; new visual values belong in tokens.

From scb-next, run the package checks:

```sh
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
npm run test:dependency-isolation
npm run verify:dependency-isolation
npm run test:e2e:design-origin
npm run verify:design-origin-host-performance
```

For a complete candidate, install Playwright Chromium and run the aggregate gate:

```sh
npx playwright install chromium
npm run verify:design-origin
```

The aggregate command runs the Base import guard, focused Base component and
Ratan/Cashflow bridge contracts, package browser checks, host builds, and Base
portal parity. It owns its temporary consumer/preview servers on ports 8019/8020
and the isolated Base parity server on port 8121; those ports must be free. It
needs installed workspace dependencies and npm registry/cache access for the fresh
consumer. It stops at the first failed labeled command and preserves child output.
`azure-pipelines-design-origin-quality.yml` installs dependencies and Chromium
before running the same command. External CI templates should invoke this command
directly and must never use the snapshot-update command as a quality gate.

Base still intentionally uses canonical WebKit CSS and two custom elements.
A clean checkout must explicitly install their locked root-workspace dependencies
and build those assets before host checks:

```sh
# From the repository root:
npm ci --workspace @scdevkit/webkit --workspace @scdevkit/webkit-rte --ignore-scripts
# From scb-next after its own npm ci:
npm run prepare:webkit-host
```

The preparation command runs the existing canonical `build:mvp` scripts in a
temporary source copy, then copies only ignored `dist` output back. Tracked theme
source remains untouched. It copies fonts from the tracked `public/assets/fonts`
directory, verifies the CSS/custom-element declarations/font files required by
Base, and fails before publishing incomplete output. The quality pipeline fetches
full Git history for the pinned old-Base comparison and performs both installs.

The aggregate prints these separate manual release gates. A green automated
command does not mark them complete:

| Gate | Command | Remaining requirement |
| --- | --- | --- |
| Broad application unit suites | `npm run test:unit` | Record the complete baseline and assign inherited failures; focused contract passes do not close this gate. |
| Ratan full typecheck | `npm run typecheck --workspace @fm/ratan_container-origin` | Fix the inherited `emitDeclarationOnly`/`noEmit` conflict and review the resulting diagnostics. |
| Controlled host performance | `npm run verify:design-origin-host-performance` | Retain a complete controlled report against the reviewed budget. |

The Storybook preview and independent date consumer read
`VITE_MUI_X_LICENSE_KEY` and initialize MUI X Pro before rendering. Supply an
approved key through the local environment or the CI variable store before
running `npm run test:e2e:design-origin`. Do not put keys in the repository, command
arguments, release records or logs. Missing or invalid keys keep the strict browser
gate failing; the check has no license-warning exclusion. License configuration
does not itself establish production entitlement or assign a license owner.

The host-performance command separately rebuilds Base, Ratan and Cashflow with
hidden source maps, owns a controlled localhost edge on port 9081 and runs three
cold Chromium samples for legacy and WebKit. It writes the complete report to
`/tmp/design-origin-performance.json` and enforces the reviewed static, transfer,
duplication, timing and same-run generation-ratio policy in
`performance/design-origin-budget.json`. The recorded reference conditions and
results live in `performance/design-origin-baseline.json`. A budget increase must
include reviewed evidence and a refreshed three-run baseline; package-only byte
results do not authorize MUI/Emotion federation changes.

Then run affected Base/consumer compatibility tests and application production
builds. With Base/Ratan/Cashflow dev servers running, run
`npm exec -- playwright test tests/e2e/design-origin-host.spec.ts`.
Inspect the affected catalog controls on desktop/mobile in both appearance
generations/modes. Document pre-existing consumer suite failures separately;
do not label a failing broad suite as passing.

The design-origin browser command builds and verifies the package, Storybook and
independent tarball consumer before running axe, keyboard/focus, overlay, date and
visual comparisons. It scans every catalog story in legacy/WebKit light/dark and
compares the consumer at 390px/1280px in the same appearance matrix. The gate has
no accessibility exclusions. For an intentional visual change, run
`npm run test:e2e:design-origin:update`, inspect all changed PNGs under
`tests/e2e/__screenshots__`, explain the change in the fix tracker or release
record, then rerun `npm run test:e2e:design-origin`. Never update baselines solely
to clear an unexplained comparison failure.

verify:package packs into a fresh temporary consumer, installs ordinary peers,
checks modern/legacy TypeScript declarations, CSS scoping/fonts, SSR and
tree shaking, then explicitly installs optional integrations and checks them.
Keep the printed fixture/log path with release evidence. Ordinary package builds
use committed WebKit 2.0.5 assets; tokens:generate additionally needs the canonical
source build and updates source hashes. Review NOTICE.md before distributing fonts.

The Button-only tree-shaking gate pins Vite 8.2.1 and externalizes React,
ReactDOM, MUI Material/icons and Emotion. It permits only rendered `Button.js`,
rejects unrelated package markers/modules, and enforces 2,048 uncompressed bytes.
The RD-021 reference improved from 21,935 to 427 bytes. Treat this as package-code
evidence for that import boundary, not an application bundle or transfer-size
claim; a budget increase requires a reviewed public Button contract change.

The dependency fixture command must fail for unsupported core versions, missing
required declarations, split host/package core resolution and incompatible
declared optional peers; undeclared optional peers remain valid. The runtime
command loads Base, Ratan and Cashflow Vite policies, validates resolved versions
against the host declaration and package peer range, and compares physical core
resolution from host and package importers. It does not change federation sharing.

## Dependencies and Adoption

Supported core ranges: React/ReactDOM `^18.2.0`, Material/icons `^5.18.0`,
Emotion React `^11.14.0` and styled `^11.14.1`. Base, Ratan and Cashflow currently
resolve 18.3.1, 5.18.0, 11.14.0 and 11.14.1 respectively. Optional ranges are MUI
X pickers/Pro `~6.20.2`, grid `~6.20.4`, Base `5.0.0-beta.70` and Dayjs `^1.11.21`.
Core does not install or load these optional integrations. Base currently declares
pickers, Pro, grid and Dayjs; Ratan and Cashflow declare none of the optional set.

The explicit stylesheet packages SC Prosper Sans, Open Dyslexic, Inter and Roboto
Mono WOFF2 files recorded in `assets/webkit-sources.json`; Poppins is host-provided
for legacy rendering and is not packaged. The asset/license owner must approve
redistribution of the packaged files. Date hosts own localization, timezone,
formats and validation. Range hosts also own MUI X Pro licensing and initialization.

Install the package into an independent React host, load styles.css explicitly,
and use RatanDesignProvider with explicit mode/designGeneration. Host providers
own URL/storage/document policy. Ordinary date controls require dates plus a
LocalizationProvider. Range consumers install/license Pro explicitly. Existing
portal hosts may opt into portal-theme/CssBaseline; standalone hosts should use
the scoped core provider instead.

Within this repository, package builds precede application builds. UI peers stay
application-local; Vite/Vitest deduplication resolves package peers to each host's
runtime. Federation sharing remains limited to the existing React/router policy.
Changing MUI/Emotion federation sharing is a separate rollout decision.
Base/Ratan/Cashflow adapters preserve existing imports, so new callers can adopt
named package exports incrementally. Do not remove compatible Base paths or
typos without deprecation notes, consumer evidence and a breaking release.

## Reproducible Candidate and Rollout

Prepare a local, reviewable candidate from committed package inputs:

```sh
npm run prepare:design-origin-release
```

This command runs package tests, typecheck, lint, build and the independent
tarball-consumer verifier. It retains the exact tarball installed by that
verifier under `/tmp/ratan-design-origin-releases/`, with the version/source
commit in the directory name, a SHA-256 checksum, `manifest.json`, and validation
logs. Uncommitted package inputs are rejected, and the package tree and dependency
lockfile must remain unchanged throughout validation. The manifest records packaging
validation separately from browser/portal checks and external approvals; a
prepared candidate is not approval to publish or deploy. No registry publication
is performed. Logs redact license and credential environment values.

An approved previous tarball can be retained beside the candidate by supplying
its path and independently recorded checksum:

```sh
npm run prepare:design-origin-release -- \
  --rollback /approved/path/ratan-design-origin-previous.tgz \
  --rollback-sha256 RECORDED_SHA256
```

The command rejects a checksum mismatch and records the copied rollback artifact
in the manifest. Its presence is not proof of owner approval, matching application
bundles, or a successful rollback drill. Archive matching catalog/screenshots and
the previously verified application bundles before rollout. A clean tarball
installation needs no sibling Base or WebKit source checkout. A full monorepo
installation still uses its existing local WebKit overrides and lockfile.

After owners/registry/licensing are assigned, the release owner reviews the
concrete tarball and publication settings before any publication. Roll out one
host at a time, starting with the catalog/independent host, then Base and
Ratan/Cashflow. Check console/style duplication, overlays/focus, both modes and
workspace operations at each step. Retain the previous app bundle and package
artifact for the entire rollout.

## Rollback

For a package release regression, restore the previous exact package version and
matching lock resolution, rebuild packages/apps, and deploy the previously verified
application bundle. Recheck login, New Tile, tile rendering and workspace removal,
plus loading/Dialog/date/theme behavior. Restore token/font assets together with
the package; do not combine artifacts from different candidate versions.

For repository development, revert the focused migration commit in a clean,
separate checkout, keep the established MUI 5 matrix, build the prior package
before its prior adapters, and run the same journey. Do not reset a dirty worktree.
Base downgrade and individual extraction commits provide narrower rollback points;
consumer-adoption rollback requires the corresponding portal-theme adapters.

If only one app fails, roll back that app's bundle/version first; record the
incompatible API/visual state before issuing a patch. A federation shared-policy
change cannot be repaired by package rollback alone and needs its own rollback.
