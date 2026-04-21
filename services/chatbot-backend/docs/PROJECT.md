# chatbot-backend — Project Overview

← [Monorepo AGENTS.md](../../AGENTS.md)

## Type

Spring Boot 3.2.0 Backend Service (Java 17), Port 8080

## Purpose

AI-powered conversational chat service providing OpenAI/Anthropic LLM integration via LangChain4j, with SSE streaming, agentic decision-making (respond/clarify/plan), tool execution, MCP provider registration, generative UI directives, and rate limiting.

## Status

Active Development

## Key Features

- **LangChain4j integration**: OpenAI/Anthropic models via `OpenAiChatModel` and `OpenAiStreamingChatModel`
- **SSE streaming responses**: Real-time token delivery via `SseEmitter`
- **Agentic control loop**: `AgentService` → `AgentDecisionService` (RESPOND/CLARIFY/PLAN) → `PlanValidationService` → `ExecutionOrchestrator` → `ResultSynthesisService`
- **MCP provider registration**: Dynamic MCP provider registration via REST API or bootstrap config (STREAMABLE_HTTP and HTTP_SSE transports)
- **Generative UI directives**: Frontend receives `generative_ui` SSE events with UI rendering instructions
- **Frontend tool continuation**: Client-side tool execution with results fed back via `toolContext` parameter
- **Rate limiting**: 60 req/min per client via Bucket4j (health endpoint excluded)
- **In-memory conversation management**: `ConcurrentHashMap`-based conversation store

## Quick Start

```bash
# From monorepo root (requires env vars — see .env.example)
npm run dev:services

# Or standalone
cd services/chatbot-backend && npm run dev

# With Elasticsearch MCP service (starts the stub MCP service automatically)
npm run dev:with-elasticsearch-mcp

# Build / test
npm run build
npm run test
```

Default LLM: Alibaba DashScope (`qwen3.5-plus`) via OpenAI-compatible API.

## Required Environment Variables

See `.env.example`:

- `CHATBOT_OPENAI_API_KEY`
- `CHATBOT_OPENAI_BASE_URL`
- `CHATBOT_OPENAI_MODEL`
- `CHATBOT_OPENAI_TEMPERATURE`
- `CHATBOT_ANTHROPIC_API_KEY`
- `CHATBOT_ANTHROPIC_MODEL`

These are also declared in root `turbo.json` under `globalEnv`.
