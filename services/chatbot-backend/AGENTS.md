# chatbot-backend

Spring Boot chatbot backend (port 8080). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Protocol-based AI chat backend for the MFE platform. It streams chat protocol frames, orchestrates Spring AI model calls, executes local and MCP tools, handles frontend/human tool continuations, and injects memory context.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **AI:** Spring AI 2.0.0-M6 with OpenAI-compatible and Anthropic starters
- **Protocol endpoint:** `POST /api/chat/runs`
- **Compatibility endpoint:** `POST /api/chat/stream`
- **Build tool:** Maven (`pom.xml`)
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Environment Variables

See `.env.example`. Common variables:

- `CHATBOT_OPENAI_API_KEY`, `CHATBOT_OPENAI_BASE_URL`, `CHATBOT_OPENAI_MODEL`, `CHATBOT_OPENAI_TEMPERATURE`
- `CHATBOT_ANTHROPIC_API_KEY`, `CHATBOT_ANTHROPIC_MODEL`
- `CHATBOT_MCP_ELASTICSEARCH_ENABLED`, `CHATBOT_MCP_ELASTICSEARCH_URL`
- `CHATBOT_MCP_RAG_ENABLED`, `CHATBOT_MCP_RAG_URL`
- `CHATBOT_MEMORY_BASE_URL`, `CHATBOT_MEMORY_TENANT_ID`, `CHATBOT_MEMORY_REQUEST_TIMEOUT`, `CHATBOT_MEMORY_CONTEXT_LIMIT`
- `CHATBOT_BRAVE_SEARCH_API_KEY`

## Commands

```bash
npm run dev             # Start on port 8080
npm run build           # Maven package, skips tests
npm run verify:protocol:real
npm run bundle:centos
npm run run:bundle
```

Run tests with Maven:

```bash
mvn test
```

## Important

- API keys and MCP provider URLs must come from environment/profile files.
- Request messages use `parts`, not `content`.
- Keep memory lookup best-effort; chat should continue when memory-service is unavailable.
