# UI Package Release and Rollback

`ratan-design-origin@0.1.0` is an internal/local release candidate. No registry
publication, production deployment, redistribution approval or Pro license
initialization is performed by this migration.

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

The release owner, registry/access policy and named backup are **unassigned**.
Assign them before publication. Required review responsibilities:

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
npm run verify:dependency-isolation
```

Then run affected Base/consumer compatibility tests and application production
builds. With Base/Ratan/Cashflow dev servers running, run
`npm exec -- playwright test tests/e2e/design-origin-host.spec.ts`.
Inspect the affected catalog controls on desktop/mobile in both appearance
generations/modes. Document pre-existing consumer suite failures separately;
do not label a failing broad suite as passing.

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

## Dependencies and Adoption

Verified core: React/ReactDOM 18.3.1, Material/icons 5.18.0, Emotion React 11.14.0/
styled 11.14.1. Dates: MUI X pickers/Pro 6.20.2 and Dayjs 1.11.21. Portal-theme
declarations: grid 6.20.4 plus Base 5.0.0-beta.70 for its legacy upstream types.
Core does not install/load these optional integrations.

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

Build and verify the committed candidate, then run `npm --cache=/tmp/npm-cache pack`
in packages/ratan-design-origin. Record the tarball name and SHA-256 checksum,
commit, peer matrix and validation logs. Archive the matching previous tarball/
catalog/screenshots. A clean tarball installation needs no sibling Base or WebKit
source checkout. A full monorepo installation still uses its existing local
WebKit overrides and repository-specific lockfile.

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
