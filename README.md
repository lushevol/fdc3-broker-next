# MFE Next

## Getting Started

### Prerequisites

- Node.js 20+ (npm included)

### Installation

```bash
npm install
```

### Commands

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Lint**: `npm run lint`
- **Dev**: `npm run dev`
- **Flowzero chatbot dev**: `npm run dev:flowzero-chatbot`

### Windows Support

This project supports both macOS/Linux and Windows. The scripts use `cross-env` for cross-platform environment variable handling.

- All npm scripts work on Windows (e.g., `npm run dev`, `npm run stop`)
- The `stop` script uses a Node.js script instead of Unix commands

Note: Some deployment scripts (`bundle:centos`, `verify:protocol:real`) require bash and are for Linux server deployment only.

### Flowzero Chatbot Workflow Generation

Use this focused launcher when verifying natural-language workflow creation through the chatbot:

```bash
npm run dev:flowzero-chatbot
```

It starts the UI shell, Flowzero MFE, `chatbot-backend`, and `flowzero-mcp-service` with `.env.profile.flowzero-chatbot`. The profile enables only the Flowzero MCP provider for the chatbot, so workflow generation runs through the service-owned MCP boundary without requiring Elasticsearch or RAG services. The launcher requires `CHATBOT_OPENAI_API_KEY`, `CHATBOT_OPENAI_BASE_URL`, and `CHATBOT_OPENAI_MODEL` so the chatbot cannot fall back to mock responses. Put secrets in exported shell variables or an ignored `.env.profile.flowzero-chatbot.local` file. Open `http://localhost:8001`, log in, ask the chatbot to create a Flowzero workflow, then use the generated card's **Open in Flowzero** action or go to Flowzero → Design → Workflow Management.

To verify the model configuration before launch:

```bash
npm run env:check:flowzero-chatbot
```

### Monorepo Management

This project uses **npm workspaces** and **Turbo**.

- List packages: `npm query ".workspace"`
- Run command in all packages: `npm run <command>` (turbo orchestrates)
