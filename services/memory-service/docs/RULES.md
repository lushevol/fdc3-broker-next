# memory-service - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## Scope and Privacy

- Every query must preserve tenant and user scope.
- Treat `desk` as an optional additional filter, not a replacement for tenant/user scoping.
- Avoid logging full memory bodies, attributes, or personal operator context.

## Schema

- Use Flyway for every schema change.
- Never edit an applied migration.
- Keep Hibernate `ddl-auto=validate`.
- Prefer additive migrations; backfill in a separate step when needed.

## API

- Archive should preserve the row and change status.
- Delete is soft delete and returns `204`.
- Validate DTOs at the controller boundary.

## Tests

```bash
cd services/memory-service
npm run test
```

Add tests for controller behavior, scope enforcement, JSON mapping, and schema-sensitive service behavior.
