# Change: Define Authorization Limit mutation ports

## Why

The production Cashflow application has a verified read-only Authorization Limits cohort and a shared interaction foundation, but mutation behavior still exists only in the legacy MFE. Wiring dialogs directly to legacy permissions or HTTP calls would couple application composition to global Ratan utilities, silently swallowed failures, and ambiguous maker/checker policy.

## What changes

- Add a pure, typed Authorization Limits entitlement policy derived from an application-supplied principal.
- Characterize legacy-compatible access, initiate, verify, status, and self-verification decisions with reason codes.
- Extend the application repository boundary into an explicit mutation service port for create, edit, confirm, reject, and delete.
- Add stable mutation error categories without choosing an authentication or HTTP transport implementation.
- Add contract tests and migration documentation while leaving the read-only production UI unchanged.

## Impact

- Affected code: `mvp/two-layer-federation/realworld/apps/mfe-cashflow/src` and its tests/docs only.
- No design-system API, host contract, federation sharing, or runtime layer changes.
- No production service calls or mutation controls are enabled by this change.
- The next cohort can compose `@fm/ratan-design@1.1.0` controls against these ports without importing legacy Ratan code.
