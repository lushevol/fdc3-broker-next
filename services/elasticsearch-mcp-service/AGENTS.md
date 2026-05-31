# elasticsearch-mcp-service

Spring Boot MCP service for Elasticsearch-backed application analytics (port 8090). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **MCP:** Spring AI MCP server, streamable HTTP endpoint `/api/mcp`
- **Build tool:** Maven (`pom.xml`)
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Commands

```bash
npm run dev        # Start on port 8090
npm run build      # Maven package, skips tests
npm run test       # Maven tests
npm run test:e2e   # Stubbed analytics SQL E2E test
```

## Important

- `ANALYTICS_STUB_ENABLED=true` swaps Elasticsearch repositories for deterministic stub repositories.
- Text-to-SQL tools/resources are opt-in with `ANALYTICS_TEXT2SQL_TOOLS_ENABLED=true`.
- Do not log Kibana credentials, API keys, or raw large query responses.
