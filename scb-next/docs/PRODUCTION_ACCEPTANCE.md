# SCB Next production and visual acceptance

> **Historical snapshot:** This report records results observed on 2026-08-13.
> It is a template and diagnostic reference, not evidence for the current
> checkout. Re-run every applicable gate in
> [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md). The current dependency-install
> state and production Nginx mock capabilities differ from this snapshot.

Date: 2026-08-13
Edge URL: `http://127.0.0.1:9081`

## Production topology

The deployment follows the MVP Real World DevOps rules:

- one dedicated Nginx composition root;
- immutable static base, Ratan, and Cashflow artifacts;
- `remoteEntry.js` served with `no-store`, hashed chunks served immutable;
- `/api/` forwarded to a configurable BFF upstream;
- health check, security headers, read-only filesystem, tmpfs runtime paths, and `no-new-privileges`;
- same-origin remote paths (`/remotes/ratan/` and `/remotes/cashflow/`) avoid CORS and asset-name collisions.

For acceptance, the BFF upstream is a second Nginx container serving deterministic login, field-schema, and GraphQL fixtures. Replace `BFF_ORIGIN` with the real service origin in deployment; no frontend rebuild is needed.

## Commands

```bash
npm run build:production
npm run serve:production
PLAYWRIGHT_BASE_URL=http://127.0.0.1:9081 PLAYWRIGHT_PRODUCTION_EDGE=1 npm run test:e2e
npm run stop:production
```

Mock credentials: `mock.cashflow` / `acceptance`.

## Screen-by-screen result

| Screen                        | Verified feature/style surface                                                          | Result |
| ----------------------------- | --------------------------------------------------------------------------------------- | ------ |
| Login                         | Username/password, SSO, MO1 hero, green secondary CTA                                   | Pass   |
| Portal workspace              | App bar, dark theme, UTC switch, avatar, tabs, New Tile drawer                          | Pass   |
| Cashflow Blotter              | Quick Search, preset counts, custom search/view, grid controls, two formatted mock rows | Pass   |
| Cashflow Open Search          | Permission gate is preserved for the non-whitelisted acceptance user                    | Pass   |
| Cashflow Group Management     | Search form, results grid, responsive columns                                           | Pass   |
| Cashflow Dashboard            | region/entity filters, status cards, refresh message                                    | Pass   |
| BIC Netting Static Table      | filters, Create/Audit/Export actions, pagination/grid                                   | Pass   |
| Utilization Static Table      | filters, Create/Audit/Export actions, results grid                                      | Pass   |
| Cashflow Authorization Limits | inherited portal permissions, Create action, profile/currency/limit grid                | Pass   |
| Cashflow Splitting Static     | filters, Create/Audit/Export actions, results grid                                      | Pass   |

Live Browser also verified a 1024×768 responsive breakpoint with no document-level horizontal overflow.

## Verification evidence

- Production build: all three Vite/Module Federation applications compiled successfully with `npm run build:production`.
- Architecture tests: 10/10 passed.
- Cashflow unit tests: 241/241 files passed; 1,946 tests passed and 17 intentionally skipped.
- Production Playwright: 1/1 production-edge scenario passed; the two development-server scenarios were intentionally skipped under `PLAYWRIGHT_PRODUCTION_EDGE=1`.
- Nginx acceptance: health, both federated `remoteEntry.js` resources, mock login, and the Cashflow GraphQL fixture returned HTTP 200 through the edge.
- Live Browser: mock login, drawer navigation, every Cashflow route, fixture rows, permission propagation, styling, and the responsive breakpoint were inspected in the running production composition.

## Observed non-blocking legacy debt

- Notification-backed screens show the expected reconnect state because the mock BFF does not emulate WebSocket/STOMP subscriptions.
- Apollo reports the deprecated `InMemoryCache.addTypename` option.
- AG Grid reports deprecated v32 selection/grid-option properties.
- Production builds warn about several large legacy chunks; this is a performance optimization gate, not a functional or styling loss.
- The explicit `coverage` command remains a migration-debt gate: blanket dependency inlining required by the legacy Ant Design tests also transforms Vitest's coverage runtime, and disabling it exposes six pre-existing hoisted-mock/React failures. The deterministic `npm test` unit gate is kept separate and passes completely.
- Repository-wide TypeScript checking still reports pre-existing Jest-global/setup and legacy prop/type debt. Vite production compilation succeeds, but strict typecheck remediation should remain a separate compatibility stage rather than being conflated with this federation/deployment cutover.

These warnings are documented rather than hidden by the fixture layer. The HTTP screen flows, styling, permissions, and two-layer federation are operational.
