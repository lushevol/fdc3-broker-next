# MFE Base with SCB Next styles

This is a direct copy of `scb/web/mfe-base-origin` at revision `289efa83`, adapted
with the accepted SCB Next presentation and the maintained
`scb-next/packages/ratan-design-origin`. The original project is unchanged.
The package name is `@fm/base-styled` to coexist with the existing workspace;
its emitted SystemJS module remains `@fm/base` and its bundle remains `base.js`.

## Set up and run

Use Node 22.12+ and npm 10.9+. From this directory:

```sh
npm ci --workspaces=false
npm run verify:artifact
npm run verify:copy
npm run dev:portal
```

Open `http://localhost:8181/?survey=no`. The local proof host imports the emitted
`dist-development/base.js` through SystemJS. Log in with `mock.cashflow` and
`acceptance`. Its API data and business tile are local fixtures. Use **New Tile**
to open a tile, its button/input to exercise package controls, and the workspace
delete button to remove it. This proves Base's original dynamic SystemJS loading
and explicit appearance propagation; it does not claim that all business remotes
have been migrated.

To run this proof on the portal's usual port:

```sh
PORTAL_PORT=8001 npm run dev:portal
```

`npm run dev` retains the original standalone Base dev server at port 8002,
for an existing root-config/import-map host. It is separate from the fixture
host. Mock APIs live only in `dev/`, installed only by the local host config.
The copied `server/` remains production server packaging.

## Appearance behavior

The adapted Base defaults to WebKit. Embedded hosts may pass `newStyles: false`
for the original Legacy layout; the local proof host accepts
`?new-styles=false&survey=no`. `loginAppearance` selects light/dark login; a
standalone proof can use `login-theme=dark`.

The local **Portal style** switch updates generation without a page reload.
The styling console can preview typography, primary color, mode and control
appearance. Both are restricted to development builds on loopback hosts.
Preview settings use session storage. A generation change clears an applied
preview and preserves authentication/workspaces; a changed shell boundary can
remount an active tile's transient state.

Base forwards `{ mode, designGeneration }` as `appearance` to dynamically loaded
remote components. Each remote should pass it to the public
`RatanDesignProvider` or its own explicit appearance adapter. Remotes that ignore
this input keep their own visuals. The original namespace APIs remain available
for consumers that use Base compatibility components.

## Package and ownership

The copy uses `vendor/ratan-design-origin-0.1.0.tgz`, built from the package under
SCB Next. `vendor/artifact.json` records its source and SHA-256. It is an immutable
consumer artifact, not a second design-package implementation. Changes to shared
controls belong in the SCB Next source, then rebuild/repack the selected archive.
The lockfile pins the selected consumer dependency graph.

React/ReactDOM remain runtime externals at React 18. The original Module
Federation sharing, Single-SPA lifecycle/custom mount, arbitrary SystemJS imports
and namespace exports remain. MUI 5.18 / Emotion 11.14 / MUI X 6.20 dependencies
match the package. Core/optional dates, Pro range, grid, compatibility and explicit
CSS/font entries retain their public boundaries. Pro licensing remains a host
responsibility as before.

New appearance components, tokens, adapters and switching policy live in
`src/new-styles`; public Base paths are thin delegates. Authentication/session,
services, analytics, FDC3, entitlements, persistence and workspace orchestration
remain in Base. Existing SC WebKit custom-element registration remains host-owned.

The original private `@scdevkit` dependencies are mapped to the existing
`sc-dev-web` sibling projects for local reproducibility. Transfer those sibling
projects with this repository, or replace those file mappings with your internal
registry's corresponding package versions before generating an internal lockfile.
The archive itself requires no SCB Next source checkout at install time.

## Validate and deploy

```sh
npm run test:legacy
npm run test:styles:coverage
npm run typecheck
npm run lint
npm run build
npm run build:server
npm run verify:artifact
npm run verify:copy
npm run build:development
npm run build:host-production
# With the local proof host already running:
PORTAL_URL=http://localhost:8181 npm run verify:browser
```

The preserved original Jest tests leave legacy timers open; `test:legacy` uses
Jest's `--forceExit` after all assertions finish.

Production output is `dist/base.js`, companion chunks/assets and declarations.
Development proof output is separately stored in `dist-development`. Build the
production artifact and its proof host with `npm run build:host-production`,
then open `/production-proof/?artifact=production&survey=no` on the local host.
This supplies production React to the production Base artifact. Local console implementation must be absent from that Base bundle.
The fixture host itself is development tooling and is never a production entry.

Build with the modern toolchain above. The copied Docker/server deployment
configuration preserves the original runtime policy and is not an upgrade of the
server image or its security baseline. Deploy the whole emitted asset directory,
including CSS-referenced fonts/images and async chunks; do not copy only base.js.
Point your existing import-map Base address at that directory after internal
acceptance. Roll back by restoring the previous asset directory/import-map
address, or use explicit `newStyles: false` for a presentation rollback.

See [the implementation specification](docs/NEW_STYLES_BACKPORT_SPEC.md),
[the original-copy contracts](docs/ORIGIN_COPY_CONTRACTS.md),
[the source manifest](docs/ORIGIN_COPY_MANIFEST.json) and
[the acceptance evidence](docs/ACCEPTANCE.md). The standalone migration guides
remain at repository `docs/SCB_MFBASE_RATAN_DESIGN_MIGRATION_GUIDE.md` and
`docs/SCB_MFBASE_COMPONENT_EXTRACTION_TO_RATAN_DESIGN_GUIDE.md`.
