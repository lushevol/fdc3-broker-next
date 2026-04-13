# elasticsearch-mcp-service

Spring Boot Elasticsearch MCP service (port 8090). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Provides Elasticsearch integration via the Model Context Protocol (MCP) for AI-assisted search capabilities.

## Key Details

- **Framework:** Spring Boot (Java)
- **Port:** 8090
- **Build tool:** Maven (`pom.xml`)

## Commands

```bash
npm run dev    # Start on port 8090
npm run build  # Maven build (skip tests)
npm run test   # Maven test
```

## Important

- Requires an Elasticsearch instance to connect to (configurable via Spring properties)
- Source code in `src/main/java/`
