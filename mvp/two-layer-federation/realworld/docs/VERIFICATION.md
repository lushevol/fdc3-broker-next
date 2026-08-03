# Realworld verification

Status: current. Last reviewed 3 August 2026. The latest focused results are
recorded in [`CURRENT_STATE.md`](./CURRENT_STATE.md).

The realworld track is accepted only when all of the following pass from the repository root:

1. `npm run realworld:check`
2. `npm run realworld:test:e2e`

For focused diagnosis, the aggregate gates decompose into:

- `npm run realworld:build`
- `npm run realworld:test`
- `npm run realworld:lint`
- `npm run realworld:verify:packages`
- `npm run realworld:verify:boundaries`

The boundary verifier must report two runtime layers and React/ReactDOM as the
only singleton shares. Package verification must consume packed public
artifacts rather than source aliases. Browser verification must cover direct
remote loading, nested routes, appearance propagation, standalone execution,
failure recovery, Authorization Limits grid behavior, and the configured
identity/mutation rollback state.

The POC has a separate build/test/browser matrix under `../poc`; success in one track is never evidence for the other.

The Realworld boundary scan covers all six application workspaces and the
production package roots listed by
`scripts/verify-production-two-layer.mjs`. WebKit additionally enforces native
registration and React-wrapper boundaries in its own test suite. The checks
reject POC package names, POC paths, legacy runtime dependencies, forbidden
federation shares, global application CSS ownership, and active runtime imports
from the legacy design package.

## Required live Chrome audit

After UI or WebKit changes:

1. Open `http://127.0.0.1:9200` and sign in with the local verification account
   `test` / `test`.
2. Verify the notification icon and both host/profile avatars are visible.
3. Open **New tile** and verify its modal overlay, search field, close icon, and
   application actions.
4. Open Cashflow and inspect list, selected-record, detail, and Authorization
   Limits pages.
5. Open Identity & Profile and exercise both accordions.
6. Open FDC3 Admin; inspect declarations, intents, and contexts, including
   create, edit, delete, cancel, and close dialog paths.
7. Toggle appearance and verify the host remains usable.
8. Use a generated tab-close icon and confirm the application is removed.
9. Capture screenshots of every page and every dialog state changed by the
   work; inspect visible icons, focusable controls, clipping, and overlays.

The browser audit is interaction evidence, not a replacement for unit tests,
lint, TypeScript, production builds, or boundary verification.
