# Chat Protocol Demo Web

Standalone Rsbuild application for exercising `chat-protocol-contract`, `chat-protocol-runtime`, and `chat-protocol-ui` independently of the Single-SPA portal.

## Run

Start `chatbot-backend`, then run:

```bash
npm run dev:chat-protocol-demo-web
```

Open `http://127.0.0.1:4173`.

The default API endpoint is configured in `.env.example` as:

```dotenv
RSBOARD_PROTOCOL_DEMO_API_URL=http://127.0.0.1:8080/api/chat/runs
```

Copy the example to an ignored local environment file when an override is required.

## Commands

```bash
npm --workspace apps/chat-protocol-demo-web run build
npm --workspace apps/chat-protocol-demo-web run lint
npm run test:e2e:chat-protocol
```

The demo includes the shared chat shell and a tool-registry panel for testing frontend tool execution.
