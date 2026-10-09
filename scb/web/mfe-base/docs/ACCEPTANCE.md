# SCB MFE Base style migration acceptance

Verified on 9 October 2026 for the copied application `scb/web/mfe-base` on the
new-style branch. The source application `scb/web/mfe-base-origin` remains
unchanged. This copy retains the original Webpack/SystemJS integration and
adopts the maintained SCB Next Ratan Design package plus the accepted Base
presentation and local style controls.

## Verification results

| Check | Result |
| --- | --- |
| Original copied Jest regression suite | 123 suites; 353 assertions passed |
| New appearance/adapters Vitest suite | 178 tests passed |
| Appearance coverage | 94.45% lines; 91.28% branches |
| Type checking and declaration generation | Passed |
| Copied project lint | Passed with zero warnings |
| Development Webpack build | Passed |
| Production Webpack build | Zero errors; three size/performance warnings |
| Production Base entry | `dist/base.js`, 1,271,872 bytes |
| Production proof host | Passed with a production React runtime |
| Strict built-artifact browser acceptance | Seven scenarios passed; zero runtime or console errors |
| Source provenance | All 427 tracked original files unchanged |
| Original root contract | 47 namespaces and six lifecycle/helper exports preserved |
| Protected copied workflows/registration | 43 files verified against original hashes with exact documented substitutions |
| Selected design-package archive | SHA-256 and source-file record verified |

The production size warnings remain visible. The original broad Base namespace
API includes compatibility and optional integrations in the host entry, so the
Base bundle is larger than a direct-import package consumer. Build success and
clean browser acceptance do not remove this delivery-size limitation.

The selected `ratan-design-origin` archive comes from
`scb-next/packages/ratan-design-origin`. Its package source snapshot hash is
`7b792881061df743805d1deff93181a95bb7781dd5ce3665e8dfd422b7062113`.
`vendor/artifact.json` records the archive checksum, original source revision,
and source/output file hashes; the archive is the consumer artifact, not a new
package implementation.

## Browser evidence

The acceptance script runs against the emitted SystemJS application, not a
source-only App mount. It verifies successful HTTP loading and SystemJS
resolution of `/base/base.js` for development or `/base-production/base.js` for
production, including the exported mount/bootstrap and Provider/Service
namespaces. Production scenarios run from `/production-proof/` with production
React, avoiding a development/production shared-runtime mismatch.

The full development journey signs in, opens New Tile, launches an arbitrary
import-map fixture tile, verifies light/dark appearance forwarded to its
independent design provider, switches live between Legacy and WebKit, verifies
saved authentication/preferences/workspaces remain unchanged, applies/resets
the local styling console, adds a workspace, and removes the tile tab.

Responsive scenarios at 320, 390, 768, and 1440 pixels check the dropdown's
compact typography and viewport containment, profile panel/banner artwork and
upper portrait visibility in both themes, no horizontal overflow, and aligned
off-toggle thumbs. Track/thumb geometry and backgrounds remain unchanged over
12 hover animation frames. Both production generations omit the local style
switch and styling console; production WebKit also passes login and tile launch.

All seven final scenarios passed with no runtime exceptions or browser console
errors. The reproducible report, geometry samples, loaded artifact URLs, and
screenshots are under `/tmp/mfe-base-styled-browser`. See
[the detailed browser record](ORIGIN_BROWSER_ACCEPTANCE.md).

## Preserved behavior and exact adaptations

`ORIGIN_COPY_MANIFEST.json` captures original hashes at revision
`289efa83980e38d3414c4e98819c4c5c293dbb33`. The verifier checks the untouched
original tree and retained public export paths, then checks copied workflow
bodies. `ORIGIN_COPY_DIFF.json` records every changed and added copied file.

The protected implementations retain authentication/session timing, service
calls, analytics, entitlement/workspace policy, controllers, utilities and
Openfin integration. The verifier allows only these exact documented changes:

- Routing's Snackbar type uses the public package primitives entry.
- TableDetail's grid type uses the public package grid entry. Its presentation
  helpers provide the MUI X6 value-getter `row`, `field`, and `value` shape and
  render keyed options through the package while retaining image/text/hidden
  behavior. State, debounce and reset policy stay unchanged.
- ScWebkit delegates registration to `src/new-styles/sc-webkit-registration.ts`,
  retaining supported element registration while excluding tests from the
  dynamic Webpack import context.
- Two utility files merge duplicate import declarations for lint compliance;
  their function bodies remain unchanged.

All other appearance implementation and selection stays under
`src/new-styles`. Existing public appearance paths delegate to it. The original
reducer sequence additionally delegates the local appearance action, and Home's
SystemJS container forwards explicit appearance without replacing the import
map or limiting supported business remote names. The default copy uses WebKit;
explicit `newStyles=false` retains Legacy. Shell generation changes can remount
a tile's transient UI state while persisted authentication/workspaces remain.

## Reproduce

From `scb/web/mfe-base`, use Node 22.12 or newer and npm 10.9 or newer, install
the lockfile dependencies, then run:

```sh
npm ci --workspaces=false
npm run verify:artifact
npm run verify:copy
npm run test:legacy
npm run test:styles:coverage
npm run typecheck
npm run lint
npm run build
npm run build:server
npm run build:development
npm run build:host-production
npm run serve:portal
# In another terminal (the proof host defaults to port 8181):
PORTAL_URL=http://localhost:8181 npm run verify:browser
```

Install the Playwright Chromium runtime with `npx playwright install chromium`
if it is absent. The preserved Jest tests leave legacy timers open, so their
script uses `--forceExit` after the assertions finish. Browser artifact output
can be changed with `PORTAL_BROWSER_OUTPUT`.

## Scope and remaining internal checks

The browser host uses local login and remote fixtures. Its remote proves
appearance forwarding and supported controls; this work does not migrate all
independently deployed business MFEs. Those applications must consume the
forwarded `appearance` or their existing Base adapters and pass their own
internal acceptance journey. Live SSO, internal APIs, internal package registry,
and deployment infrastructure were not exercised by this local proof.

Build/install tooling now requires the modern Node/npm runtime listed above.
The copied Dockerfile still retains the original Node 14 server image and
production server packaging policy; this change does not update that image or
claim validation of its security/deployment baseline. Internal teams should
validate the selected server runtime separately. Existing SC WebKit file
mappings require the sibling projects for local installation or corresponding
internal registry mappings before generating an internal lockfile. Pro licensing
remains the host's responsibility.

Deploy the complete emitted asset directory with chunks, CSS-referenced images,
and fonts through the existing import map after internal acceptance. Restore
the previous assets/import-map address for a runtime rollback, or pass
`newStyles=false` for a presentation rollback.
