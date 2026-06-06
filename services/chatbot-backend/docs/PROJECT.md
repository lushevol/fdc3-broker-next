# chatbot-backend - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 backend service (Java 21), port 8080.

## Purpose

AI chat backend for the MFE platform. It accepts chat protocol requests, streams protocol frames over SSE, orchestrates Spring AI model calls, exposes local/frontend/MCP tools, handles user-question and tool continuation flows, and injects memory context.

## Status

Active service.

## Key Features

- **Canonical protocol endpoint**: `POST /api/chat/runs`.
- **Compatibility endpoint**: `POST /api/chat/stream` converts legacy `ChatRequest` into `ProtocolRunRequest`.
- **Spring AI integration**: OpenAI-compatible and Anthropic model support.
- **Model selection**: `config.modelName` can override the default model for a run.
- **Agentic control loop**: decision, plan validation, execution orchestration, result synthesis.
- **Tools**: local Java tools, agent-utils callbacks, frontend tools, human approval, and MCP tools.
- **MCP bootstrap and runtime registry**: Elasticsearch analytics and RAG providers can be configured or registered at runtime.
- **Memory**: SQL-backed `memory-service` context plus per-user AutoMemoryTools compatibility.
- **Observability**: OpenTelemetry annotations/agent, Micrometer metrics, actuator, rolling logs.
- **Rate limiting**: Bucket4j request limiting.

## Quick Start

```bash
cd services/chatbot-backend
npm run dev
```

Root stacks:

```bash
npm run dev:services
npm run dev:services:stub
npm run dev:rag:stub
```

## Required Configuration

See `.env.example` and root `.env.profile.*`.

Core provider values:

- `CHATBOT_OPENAI_API_KEY`
- `CHATBOT_OPENAI_BASE_URL`
- `CHATBOT_OPENAI_MODEL`
- `CHATBOT_OPENAI_TEMPERATURE`
- `CHATBOT_ANTHROPIC_API_KEY`
- `CHATBOT_ANTHROPIC_MODEL`

Integration values:

- `CHATBOT_MCP_ELASTICSEARCH_ENABLED`
- `CHATBOT_MCP_ELASTICSEARCH_URL`
- `CHATBOT_MCP_RAG_ENABLED`
- `CHATBOT_MCP_RAG_URL`
- `CHATBOT_MEMORY_BASE_URL`
- `CHATBOT_MEMORY_TENANT_ID`
- `CHATBOT_MEMORY_REQUEST_TIMEOUT`
- `CHATBOT_MEMORY_CONTEXT_LIMIT`

## Verification

```bash
cd services/chatbot-backend
mvn test
npm run verify:protocol:real
```
