# elasticsearch-mcp-service - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## MCP Tools

- Keep tools read-only.
- Validate application aliases, timestamps, and limits before generating SQL.
- Prefer dedicated typed tools over widening the archived Text2SQL surface.

## Configuration

- Use `ANALYTICS_STUB_ENABLED=true` for deterministic local verification.
- Keep Text2SQL disabled by default.
- Do not hard-code new Kibana hosts or credentials in source.

## SQL Safety

- Do not allow mutating SQL, wildcard metadata exploration, or uncapped result sets.
- Update `SqlSafetyValidatorTest` when the SQL policy changes.

## Tests

```bash
cd services/elasticsearch-mcp-service
npm run test
npm run test:e2e
```

Add tests for new tools, request validation, repository behavior, and stub parity.
