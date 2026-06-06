# rag-knowledge-base-service - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## MCP Boundary

- Expose retrieval only through MCP tools.
- Keep `chatbot-backend` integration to provider registration; do not couple chatbot code to RAG internals.
- Tool responses must include citation-ready source metadata.

## Knowledge Documents

- Keep source documents in Markdown with front matter.
- Do not commit secrets, credentials, personal data, or raw customer data.
- Prefer stable filenames because filenames define document ids.

## Embeddings

- Do not mix embedding providers between indexed chunks and query embeddings.
- Use deterministic embeddings for tests and local smoke checks.
- Do not log API keys, raw embeddings, or full source documents.

## Storage

- Keep new storage implementations behind `KnowledgeChunkRepository`.
- Preserve namespace filtering and top-K capping.

## Tests

```bash
cd services/rag-knowledge-base-service
npm run test
```

Add tests for new embedding providers, ingestion behavior, repository implementations, and MCP response shape.
