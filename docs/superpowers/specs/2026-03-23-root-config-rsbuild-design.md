# Root Config Rsbuild Migration Design

## Goal

Migrate `apps/root-config` from webpack to Rsbuild while preserving current runtime behavior for local development and production output.

## Scope

- Replace the webpack-based build and dev server entrypoints with Rsbuild.
- Preserve `config.js` as the root-config JavaScript artifact.
- Preserve HTML generation from `src/index.ejs` and its template parameters.
- Preserve local mock auth, FDC3, and category endpoints used during UI development.
- Preserve the current proxy routes to backend services.

## Non-Goals

- No cleanup or extraction of mock middleware beyond what is required to make the Rsbuild config maintainable and testable.
- No changes to root-config runtime behavior, routes, or Single-SPA registration logic.

## Design

Introduce `apps/root-config/rsbuild.config.ts` as the single source of truth for root-config build and dev-server behavior. The config will:

- emit one SystemJS-compatible `config.js` bundle for the root-config entry
- emit the main HTML page from `src/index.ejs`
- configure dev-server proxies equivalent to the current webpack config
- register dev middlewares equivalent to the current webpack auth/FDC3/category mocks

To keep the config testable, the middleware and proxy definitions may be extracted into a small local helper module under `apps/root-config`, but behavior must stay unchanged.

## Verification

- Jest tests validate auth mock enable/disable behavior and preserved proxy contexts.
- Root-config build succeeds with `rsbuild build`.
- Local UI verification runs through the existing app startup flow and confirms the main shell still loads on `http://localhost:8001`.
