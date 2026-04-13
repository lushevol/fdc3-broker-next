# chatbot-backend

Spring Boot chatbot backend (port 8080). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Backend service providing AI chat capabilities via OpenAI and Anthropic APIs.

## Key Details

- **Framework:** Spring Boot (Java)
- **Port:** 8080
- **Build tool:** Maven (`pom.xml`)
- **Local profile:** `spring.profiles.active=local`

## Required Environment Variables

See `.env.example`:

- `CHATBOT_OPENAI_API_KEY` – OpenAI API key
- `CHATBOT_OPENAI_BASE_URL` – OpenAI base URL
- `CHATBOT_OPENAI_MODEL` – Model name (e.g., `gpt-4`)
- `CHATBOT_OPENAI_TEMPERATURE` – Temperature setting
- `CHATBOT_ANTHROPIC_API_KEY` – Anthropic API key
- `CHATBOT_ANTHROPIC_MODEL` – Anthropic model name

These are also declared in root `turbo.json` under `globalEnv`.

## Commands

```bash
npm run dev          # Start on port 8080 with local profile
npm run build        # Maven build (skip tests)
npm run test         # Maven test via package.json
npm run bundle:centos # Bundle for CentOS deployment
npm run run:bundle   # Run the bundled CentOS artifact
```

## Important

- API keys must be set before starting – the service will fail without them
- Source code in `src/main/java/`
