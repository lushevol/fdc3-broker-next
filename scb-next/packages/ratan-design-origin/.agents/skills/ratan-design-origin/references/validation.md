# Validation by Scope

Use the package and host manifests as the command source of truth. The commands
below are current source-checkout gates; npm tarballs do not ship the test source
or verifier scripts. Run checks appropriate to the change, and separate package
results from host behavior and previously observed failures.

## Consumer adoption

Typecheck/build the affected host and run focused tests through its public
imports or compatibility adapter. Verify the selected appearance, native/root
refs, callback arguments, disabled/loading behavior, and controlled values where
they form part of the changed contract.

For provider, stylesheet, font, or overlay changes, check light/dark and the
requested legacy/WebKit generations in the browser, including a compact viewport.
Inspect fonts and computed styles, overlay ancestry, focus, and dismissal behavior.
For an MFE adoption, verify appearance after mounting a remote and changing mode.

In the SCB Next checkout, dependency changes use both
`npm run test:dependency-isolation` and `npm run verify:dependency-isolation`
from `scb-next`. Run affected Base/remote contract tests and builds. The
`tests/e2e/design-origin-host.spec.ts` journey needs a matching current-checkout
dev stack. Check login, New Tile, tile rendering, and workspace removal when the
shell is affected; choose `PLAYWRIGHT_BASE_URL` if an existing port serves another
checkout. Keep other running servers intact and stop only temporary servers
started for the task.

## Package implementation and distribution

From the package directory, the current gates are:

```sh
npm run test -- --maxWorkers=2
npm run typecheck
npm run lint -- --max-warnings=0
npm run build
npm run verify:tree-shaking
npm run build:storybook
npm run verify:package
```

The build must precede verification because direct entries resolve to `dist`.
The test command includes coverage/token checks. The tarball verifier installs
an independent consumer, checks modern/legacy declaration resolution and DOM-free
SSR, then verifies optional integrations and direct import graphs. It currently
uses the public npm registry and `/tmp/npm-cache`; internal PCs need an approved
reachable registry/cache configured in their local verification workflow.

From `scb-next`, `npm run test:e2e:design-origin` owns the package/catalog build,
tarball verification, temporary consumer and preview servers, and package browser
checks. Keep ports 8019/8020 free and install Playwright Chromium when needed.
Use the snapshot-update command only for an intentional visual change with
reviewed images; ordinary runs remain the acceptance gate. For a complete release
candidate, consult `scb-next/docs/UI_PACKAGE_RELEASE.md` and the current aggregate
`verify:design-origin` script when those resources are present.

## Tree-shaking evidence

Measure loaded/transformed modules separately from retained final code. Direct
imports should load only the selected implementation and required package
dependencies; root imports promise removal of unused final code. Verify
no-import, unused-import, and type-only cases, plus explicit CSS/font retention.

The existing Button check permits only rendered `Button.js` within a 2,048-byte
package-code budget with pinned consumer Vite and external UI peers. It is not a
total application/transfer-size budget. Preserve that boundary and justify any
budget change with a public contract change and measured evidence.

When adding imports, compare root/direct runtime identity and confirm declarations
do not advertise an export missing from emitted JS. Keep tests using emitted
artifacts or installed tarballs; source-only checks can hide export-map, optional
peer, and SSR interop defects.

## Evidence and completion

Capture commands and outcomes, package version, actual host/remote checkout paths,
and relevant artifact locations. If a broad gate fails, determine whether the
requested changes caused it and report its effect on acceptance. Read the source
checkout's implementation record for previously observed limitations, then
recheck whether they still apply. Package-only success does not establish a
passing integrated host journey.

Follow the enclosing repository's change-detection and isolated commit policy.
Publication, deployment, and peer/federation architecture changes require their
own requested scope and concrete verified artifacts.
