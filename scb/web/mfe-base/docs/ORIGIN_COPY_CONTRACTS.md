# Original-copy contracts and provenance

`scb/web/mfe-base` was copied from the tracked files in
`scb/web/mfe-base-origin` at revision
`289efa83980e38d3414c4e98819c4c5c293dbb33`.
The source hashes and original public exports are stored in
`ORIGIN_COPY_MANIFEST.json`.
The appearance implementation comes from the accepted SCB Next style branch,
while the copy retains the original project's business workflows and SystemJS
host integration.

## Reproduce the integrity check

From the copied application's directory, run:

```sh
node scripts/verify-copy.mjs
node scripts/verify-copy.mjs --write-report
```

The verifier checks all 427 tracked original files against their SHA-256
snapshot. It also checks the copied root's 47 original namespace exports and
six lifecycle/helper exports, and 43 protected copied workflow implementation
files, allowing only the documented presentation substitutions. A failed check
exits nonzero. The optional report records every modified,
added, or missing copied file in `docs/ORIGIN_COPY_DIFF.json`.

The protected workflow files include original API services, service hooks,
authentication validation, analytics, utilities, all original UI workflow
controllers, and Openfin integration. Their copied contents remain
byte-identical except for explicitly listed presentation substitutions in two
controller files:
the routing Snackbar type, the TableDetail grid type, and two TableDetail
presentation helpers for value-getter parameters and option rendering. The
parameter helper supplies the MUI X6 `row`, `field`, and
`value` shape instead of the old row-only shape; it changes no state, queries,
reset behavior, or debounce policy. The option helper uses the package Box,
retains the original image/text/hidden state and dimensions, and supplies React
list keys explicitly to avoid spread-key warnings. The verifier reverses only
those exact
substitutions before comparing hashes, so the remaining workflow bodies stay
protected. The original ScWebkit registration API is additionally protected:
its dynamic import delegates to `src/new-styles/sc-webkit-registration.ts`, which
limits the import context to supported `sc-*.ts` element registrations and excludes
test modules. Two original utility files also merge duplicate import declarations
for lint compliance; their function bodies remain byte-identical. The manifest lists the exact paths, hashes, and permitted
presentation substitutions. This guard is separate from tests: a preserved namespace name cannot prove that its workflow
implementation is unchanged.

## Intended integration differences

- `App.tsx` obtains initial appearance from `src/new-styles/appearance.ts` and
  uses the public design-package date provider. The copy defaults to WebKit;
  an explicit `newStyles=false` selects Legacy. Host version and selected login
  mode remain explicit inputs.
- Existing public appearance/component entry points delegate to presentation
  adapters in `src/new-styles`; the original root namespace import paths remain
  available to import-map consumers. The package owns supported reusable
  controls, icons, themes, tokens, and explicit CSS/fonts.
- The root model adds `newStyles` and `loginAppearance`. Its existing
  `useIsNewLayout` export delegates to the centralized appearance policy.
- The original reducer sequence remains intact. It additionally delegates to
  `reduceLocalPortalGeneration` in `src/new-styles`; the action type accepts that
  local appearance action. This action changes only appearance and forwards it
  through existing state bridges.
- The original Home `Container` continues to load arbitrary import-map names
  with `System.import`. It passes an explicit package `appearance` prop to
  independent remote roots. The lazy component memo now depends on the remote
  name, allowing the host to change a container's import-map name correctly.
  Built-in Base admin routes retain their local lazy module.
- A loopback development build includes the existing local Legacy/WebKit
  control and styling console. Production excludes their implementation.
- Build/test/tooling differences support consumption of the built maintained
  `ratan-design-origin` artifact through the original Webpack/SystemJS project.
  A reproducible local host is provided for browser verification; it does not
  replace the production import-map contract.

## Contract test scope

`src/backport-contract.test.tsx` checks WebKit defaults, an explicit Legacy
selection, separate mode/generation values, loopback development gating, every
original exported namespace, the standard Single-SPA lifecycle references, and
the custom root mount promise/host props. Namespace dependencies and the
Single-SPA adapter are mocked to isolate the entry-point contract.

`src/pages/Home/common/systemjs-appearance.test.tsx` renders a real lazy host
container against a mocked SystemJS loader. It checks an arbitrary import-map
name, all original tile props, explicit appearance forwarding, live Legacy/dark
updates, changed remote names, and the built-in local admin route. Browser
acceptance validates the real built SystemJS artifact and full login/workspace
journey separately.

## Built-artifact browser verification

Build both development and production artifacts, start the local proof host,
and run:

```sh
npm run build:development
npm run build:webpack
npm run build:host-production
npm run serve:portal
# In another terminal (default host port 8181):
npm run verify:browser
# For a different running local proof host:
PORTAL_URL=http://localhost:8001 npm run verify:browser
```

`scripts/verify-portal-browser.mjs` uses Playwright Chromium and the proof host's
local login/remote fixtures. Install Chromium with `npx playwright install
chromium` if the runtime does not already have it. It checks actual HTTP loading
of `/base/base.js` or `/base-production/base.js`, the resolved SystemJS registry
module and its original public lifecycle/namespaces, then exercises the login,
New Tile, fixture remote, light/dark and live Legacy/WebKit appearance, local
console, and workspace removal. It checks profile menu typography, dialog/artwork
containment, visible upper avatar, and stable off-toggle hover geometry over 12
animation frames at 320, 390, 768, and 1440 pixels in both themes. Both production
generations must omit development controls. Production scenarios navigate to
`/production-proof/?artifact=production`, whose host and shared React runtime are
built in production mode, while development scenarios use `/`. Runtime exceptions and console
errors fail the scenario.

Screenshots, geometry metrics, loaded artifact URLs, and error records are saved
under `/tmp/mfe-base-styled-browser` by default. `PORTAL_BROWSER_OUTPUT` changes
the output location; `PORTAL_BROWSER_HEADLESS=false` shows the acceptance browser.
The fixture remote proves host appearance forwarding without connecting to
internal business services. It does not claim acceptance of those independently
deployed business applications.
