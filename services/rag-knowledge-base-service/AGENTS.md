# rag-knowledge-base-service

Spring Boot MCP service for read-only RAG retrieval (port 8091). See root `AGENTS.md` for monorepo-wide context.

## Commands

```bash
npm run dev       # Start with OpenRouter embeddings
npm run dev:stub  # Start with deterministic local embeddings
npm run test      # Maven tests
npm run build     # Maven package, skips tests
```

## Important

- Keep chatbot-backend decoupled; expose capabilities through MCP tools only.
- Keep vector storage behind `KnowledgeChunkRepository` so Elasticsearch can replace the in-memory implementation later.
- Never log embedding API keys or full document contents.
