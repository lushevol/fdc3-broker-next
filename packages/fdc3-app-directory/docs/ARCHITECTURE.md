# ratan-fdc3-app-directory — Architecture

## Tech Stack

- TypeScript
- tsup (dual entry points)
- Vitest

## Directory Structure

```
src/
  index.ts      Exports client, mock, and types
  client.ts     HTTP client using Fetch API, Bearer token, timeout
  mock.ts       In-memory MockAppDirectoryService implementation
  types.ts      AppDefinition, AppDirectoryClient interface, AppDirectoryConfig with modes
```

## Three Operational Modes

| Mode                    | Behaviour                 |
| ----------------------- | ------------------------- |
| `remote-only` (default) | HTTP calls only           |
| `local-only`            | Mock service only         |
| `local-first`           | Mock first, HTTP fallback |

## Build

- **Bundler:** tsup with two entry points (`index`, `mock`)
- **Outputs:** ESM, CJS, DTS

## Testing

- **Runner:** Vitest
- **Test files:** client.test.ts, integration.test.ts, local-apps.test.ts, mock-service.test.ts
