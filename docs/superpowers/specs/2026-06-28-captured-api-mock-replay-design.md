# Captured API Mock Replay Design

## Goal

Set up local mock data for `mfe-cashflow-blotter` and `mfe-flowzero` from sanitized Playwright API captures in the root-config devserver so the local MFEs can follow the same user journeys as the original web projects.

## Scope

The mock data covers app-specific API calls only:

- `mfe-cashflow-blotter`: `/api/ratan/...` calls needed for monitor status, field metadata, saved filters/views, notification handshake, and cashflow grid data.
- `mfe-flowzero`: `/api/flowzero/...` calls needed for workflow navigation, workflow management, workflow detail, statistics, country/dictionary metadata, user column settings, and todo inbox data.

Shared shell traffic such as login, import map, analytics, and user photos is intentionally excluded.

## Architecture

Root-config owns the captured replay layer:

- `apps/root-config/mock/captured-api-fixtures.mock.json` contains sanitized captured responses.
- `apps/root-config/captured-api-mocks.ts` matches incoming requests by method, pathname, required query values, and optional body markers.
- `apps/root-config/dev-server.ts` registers captured replay middleware with the other local devserver mocks.

Individual MFE `server/` folders are not used for this behavior; they are containerization/server-packaging artifacts for their own MFE.

## Matching Rules

GET requests match by method, pathname, and required query parameters. Extra query parameters are allowed so timestamps and paging params do not break matching.

POST requests match by method, pathname, and configured body markers. This avoids sequence-only replay and keeps duplicate GraphQL endpoints stable after refreshes.

## Verification

Unit tests cover fixture matching behavior in both MFEs. Server builds should compile only Node server code and exclude Jest test files. Smoke checks should confirm representative captured responses:

- Flowzero workflow page returns `Nov Go live Markets Client Enablement Workflow`.
- Flowzero inbox returns `Risk Review` for `Client Data Review Workflow`.
- Cashflow monitor returns `TDS3_Cashflow_Query: AVAILABLE`.
- Cashflow grid query returns `totalResult: 20` and first `Cashflow_Id: N00000122129`.
