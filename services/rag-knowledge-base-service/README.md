# RAG Knowledge Base Service

Standalone MCP server that exposes read-only knowledge retrieval to `chatbot-backend`.

- Current service docs: [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)
- Document operations: [docs/DOCUMENT_MANAGEMENT.md](docs/DOCUMENT_MANAGEMENT.md)
- MCP endpoint: `http://localhost:8091/api/mcp`

## Local Run

```bash
cd services/rag-knowledge-base-service
ACTIVE_ENV=stub npm run dev
```

For OpenRouter embeddings:

```bash
export OPENROUTER_API_KEY=...
ACTIVE_ENV=dev npm run dev
```

For the root stack:

```bash
npm run dev:rag:stub
npm run dev:rag:copilot
```

## Chatbot Integration

Set these variables for `chatbot-backend`:

```bash
CHATBOT_MCP_RAG_ENABLED=true
CHATBOT_MCP_RAG_URL=http://localhost:8091/api/mcp
CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor
```

The `dev` profile in `.env.profile.dev` enables RAG registration for the full stack.

## Manual Verification

Start RAG with deterministic embeddings:

```bash
cd services/rag-knowledge-base-service
ACTIVE_ENV=stub npm run dev
```

Start chatbot with the matching profile:

```bash
cd services/chatbot-backend
ACTIVE_ENV=stub npm run dev
```

Verify provider registration:

```bash
curl http://localhost:8080/api/chat/mcp/providers
curl http://localhost:8080/api/chat/mcp/providers/status
```

Expected provider id: `rag-knowledge-base`.

## Document Operations

The default knowledge source is Markdown files under `src/main/resources/knowledge/`. Restart the service after adding, editing, or deleting source documents so startup indexing rebuilds the repository.

Each file should include front matter:

```markdown
---
title: Human Readable Title
namespace: advisor
---
```

See [docs/DOCUMENT_MANAGEMENT.md](docs/DOCUMENT_MANAGEMENT.md) for validation steps.
