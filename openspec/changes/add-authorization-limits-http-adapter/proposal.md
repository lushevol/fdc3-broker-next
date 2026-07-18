# Change: Add Authorization Limits HTTP adapter

## Why

All mutation composition is verified against a typed service port, but production activation still lacks a concrete adapter and runtime response validation. A transport-injected adapter can lock endpoint/method/error/decoding behavior without choosing host identity, credentials, cookies, or a fetch implementation prematurely.

## What changes

- Add an application-owned HTTP transport interface and Authorization Limits service adapter.
- Map list/create/edit/confirm/reject/remove domain commands to characterized legacy endpoint shapes.
- Runtime-validate records, arrays, fixed USD, statuses, version, numeric limits, and audit fields.
- Categorize HTTP, transport, and malformed-response failures for existing local feedback.
- Keep the adapter uninstantiated in current production bootstrap.

## Impact

- Affected code: `apps/mfe-cashflow` service adapter, tests, and migration documentation.
- No host authentication contract, credential behavior, production endpoint configuration, or runtime activation.
- No UI/design/federation changes.
