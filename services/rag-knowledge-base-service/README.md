# RAG Knowledge Base Service

Standalone MCP server that exposes read-only knowledge retrieval to chatbot-backend.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Document management manual](docs/DOCUMENT_MANAGEMENT.md)

## Local Run

```bash
cd services/rag-knowledge-base-service
npm run dev:stub
```

For OpenRouter embeddings:

```bash
export OPENROUTER_API_KEY=...
npm run dev
```

MCP endpoint:

```text
http://localhost:8091/api/mcp
```

## Chatbot Integration

Set:

```bash
CHATBOT_MCP_RAG_ENABLED=true
CHATBOT_MCP_RAG_URL=http://localhost:8091/api/mcp
CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor
```

## Manual Verification

Start RAG with deterministic embeddings:

```bash
cd services/rag-knowledge-base-service
npm run dev:stub
```

Start chatbot with the RAG MCP provider:

```bash
cd services/chatbot-backend
npm run dev:with-rag-mcp
```

Verify provider registration:

```bash
curl http://localhost:8080/api/chat/mcp/providers
```

Expected provider:

```json
{
  "providerId": "rag-knowledge-base",
  "toolNames": ["search_knowledge_base"]
}
```

## Quick Document Operations

The POC knowledge base is file-backed. Add, delete, or modify Markdown files under `src/main/resources/knowledge/`, then restart the service or call the future reindex endpoint when it exists. Each file should include front matter:

```markdown
---
title: Human Readable Title
namespace: advisor
---
```

See [Document management manual](docs/DOCUMENT_MANAGEMENT.md) for exact steps and validation commands.
