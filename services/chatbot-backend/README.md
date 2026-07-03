# Chatbot Backend Service

Spring Boot AI chatbot backend for the MFE platform. The service exposes the canonical chat protocol over SSE, integrates with Spring AI model providers, executes local and MCP tools, supports frontend/human tool continuations, and reads operator memory from `memory-service`.

- Current service docs: [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)
- API contract: [docs/API.md](docs/API.md)
- Tool workflow: [docs/TOOL_WORKFLOW.md](docs/TOOL_WORKFLOW.md)
- MFE integration: [docs/MFE_INTEGRATION.md](docs/MFE_INTEGRATION.md)
- Observability: [docs/OBSERVABILITY.md](docs/OBSERVABILITY.md)

## Features

- **Canonical chat protocol** via `POST /api/chat/runs` and SSE frames.
- **Compatibility stream endpoint** via `POST /api/chat/stream`.
- **Spring AI model integration** for OpenAI-compatible and Anthropic providers.
- **Model list endpoint** for OpenAI-compatible `/models`.
- **Agentic control loop** for respond/clarify/plan decisions, policy validation, tool execution, and synthesis.
- **Tool registry** for local Java tools, agent-utils callbacks, frontend tools, human approval tools, and MCP tools.
- **MCP provider registry** for Elasticsearch analytics and RAG knowledge-base services.
- **Memory context** from `memory-service` plus per-user AutoMemoryTools file memory compatibility.
- **Rate limiting and security profile gating**.
- **OpenTelemetry/Micrometer observability** and rolling file logs.

## Prerequisites

- Java 21
- Maven 3.9+
- OpenAI-compatible or Anthropic API key for real model calls

## Configuration

See `.env.example` and root `.env.profile.*` files.

| Variable                               | Purpose                                        |
| -------------------------------------- | ---------------------------------------------- |
| `CHATBOT_OPENAI_API_KEY`               | OpenAI-compatible API key                      |
| `CHATBOT_OPENAI_BASE_URL`              | OpenAI-compatible base URL                     |
| `CHATBOT_OPENAI_MODEL`                 | Default model                                  |
| `CHATBOT_OPENAI_TEMPERATURE`           | Default model temperature                      |
| `CHATBOT_ANTHROPIC_API_KEY`            | Anthropic API key                              |
| `CHATBOT_ANTHROPIC_MODEL`              | Anthropic model                                |
| `CHATBOT_SECURITY_ENABLED`             | Enables bearer-token enforcement when true     |
| `CHATBOT_SECURITY_ADDITIONAL_PROFILES` | Extra profiles such as `advisor` for MCP tools |
| `CHATBOT_MCP_ELASTICSEARCH_ENABLED`    | Bootstrap Elasticsearch MCP provider           |
| `CHATBOT_MCP_ELASTICSEARCH_URL`        | Elasticsearch MCP URL                          |
| `CHATBOT_MCP_RAG_ENABLED`              | Bootstrap RAG MCP provider                     |
| `CHATBOT_MCP_RAG_URL`                  | RAG MCP URL                                    |
| `CHATBOT_MCP_FLOWZERO_ENABLED`         | Bootstrap Flowzero MCP workflow provider       |
| `CHATBOT_MCP_FLOWZERO_URL`             | Flowzero MCP URL                               |
| `CHATBOT_MEMORY_BASE_URL`              | Memory service URL                             |
| `CHATBOT_MEMORY_TENANT_ID`             | Memory tenant sent to memory-service           |
| `CHATBOT_MEMORY_REQUEST_TIMEOUT`       | Best-effort memory lookup timeout              |
| `CHATBOT_MEMORY_CONTEXT_LIMIT`         | Maximum memories injected into prompt          |
| `CHATBOT_BRAVE_SEARCH_API_KEY`         | Brave search key for agent-utils web search    |
| `LOG_FILE`                             | Rolling log file path                          |

## Running Locally

```bash
cd services/chatbot-backend
npm run dev
```

The dev script creates `logs/`, loads `.env.profile.${ACTIVE_ENV:-dev}`, and starts Maven on port 8080 with the `local` Spring profile and the OpenTelemetry Java agent.

For local flows that do not need the OpenTelemetry Java agent artifact, use:

```bash
cd services/chatbot-backend
npm run dev:local
```

Profile examples:

```bash
ACTIVE_ENV=stub npm run dev
ACTIVE_ENV=copilot npm run dev
```

Root service stacks:

```bash
npm run dev:services
npm run dev:services:stub
npm run dev:rag:stub
npm run dev:rag:copilot
npm run dev:flowzero-chatbot
```

`npm run dev:flowzero-chatbot` starts the UI, `chatbot-backend`, and `flowzero-mcp-service` with `.env.profile.flowzero-chatbot`, which enables `flowzero-mcp` and disables Elasticsearch/RAG MCP providers. It requires real OpenAI-compatible model settings (`CHATBOT_OPENAI_API_KEY`, `CHATBOT_OPENAI_BASE_URL`, `CHATBOT_OPENAI_MODEL`) and refuses to start without them so local verification cannot accidentally use mock chatbot responses. Put secrets in exported shell variables or an ignored root `.env.profile.flowzero-chatbot.local` file. It uses `chatbot-backend`'s `dev:local` mode so the focused workflow-generation environment does not require `target/opentelemetry-javaagent.jar`.

## API Endpoints

- `POST /api/chat/runs` - canonical SSE chat protocol.
- `POST /api/chat/stream` - compatibility JSON-body stream endpoint converted into protocol requests.
- `GET /api/chat/health` - service health.
- `GET /api/chat/models` - model list from the configured OpenAI-compatible provider.
- `POST /api/chat/mcp/providers` - register an MCP provider.
- `GET /api/chat/mcp/providers` - list MCP providers.
- `GET /api/chat/mcp/providers/status` - provider/tool status summary.
- `DELETE /api/chat/mcp/providers/{providerId}` - unregister an MCP provider.
- `POST /api/chat/question/answer` - answer a pending user-question batch.
- `POST /api/chat/question/{batchId}/answer` - answer a pending batch by path id.
- `POST /api/chat/{conversationId}/question/{questionId}/answer` - legacy question answer endpoint.

## Build and Test

```bash
cd services/chatbot-backend
npm run build
mvn test
npm run verify:protocol:real
```

## CentOS Bundle

```bash
cd services/chatbot-backend
npm run bundle:centos
```

The generated archive contains the service JAR, `.env.example`, and a run script. The run script fails fast if Java 21+, `.env`, or the JAR is missing.
