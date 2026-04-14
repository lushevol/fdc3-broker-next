# ratan-fdc3-app-directory — Rules

> Parent: [Monorepo rules](../../../docs/rules.md) · [AGENTS.md](../../../AGENTS.md)

## Modes

- Use **remote-only** for production deployments.
- Use **local-only** or **local-first** for tests and offline development.

## Mock Service

- Use the `mockAppDirectory` singleton for consistent test fixtures.

## Type Safety

- Always depend on the `AppDirectoryClient` **interface**, not the concrete class, for dependency injection.

## Auth Tokens

- `AppDirectoryClientImpl` accepts a `getAuthToken` function in config — **never** hardcode tokens.
