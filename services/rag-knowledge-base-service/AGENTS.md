# rag-knowledge-base-service

Spring Boot MCP service for read-only RAG retrieval (port 8091). See root `AGENTS.md` for monorepo-wide context.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **MCP:** Spring AI MCP server, streamable HTTP endpoint `/api/mcp`
- **Storage:** in-memory by default, Elasticsearch when `RAG_ELASTICSEARCH_ENABLED=true`
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Commands

```bash
npm run dev                         # Uses .env.profile.${ACTIVE_ENV:-dev}
ACTIVE_ENV=stub npm run dev          # Deterministic embeddings
npm run test
npm run build
```

From the monorepo root:

```bash
npm run dev:rag:stub
npm run dev:rag:copilot
```

## Important

- Keep chatbot-backend decoupled; expose capabilities through MCP tools only.
- Keep vector storage behind `KnowledgeChunkRepository`.
- Never log embedding API keys, full document contents, or raw embeddings.
