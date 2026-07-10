# Flowzero MCP Service

Spring Boot 4 / Spring AI MCP service for creating and retrieving in-memory Flowzero workflow drafts. It exposes the `generate_flowzero_workflow` MCP tool and REST endpoints used by the Flowzero MFE.

## Run

```bash
npm run dev:flowzero-mcp
```

The service listens on port 8092.

## Endpoints

| Endpoint                                            | Purpose                                   |
| --------------------------------------------------- | ----------------------------------------- |
| `POST /api/mcp`                                     | Streamable HTTP MCP endpoint              |
| `GET /actuator/health`                              | Health check                              |
| `POST /api/flowzero/v1/workflow/create`             | Create a workflow draft through REST      |
| `GET /api/flowzero/v1/workflow/page`                | Page through generated workflow summaries |
| `GET /api/flowzero/v1/workflow/detail/{workflowId}` | Retrieve a generated workflow             |

Drafts are stored in memory and reset when the service restarts.

## Commands

```bash
npm --workspace services/flowzero-mcp-service run build
npm --workspace services/flowzero-mcp-service run test
npm --workspace services/flowzero-mcp-service run dev
```

To use it through the chatbot backend, set `CHATBOT_MCP_FLOWZERO_ENABLED=true` and point `CHATBOT_MCP_FLOWZERO_URL` to `http://localhost:8092/api/mcp`, or use `npm run dev:flowzero-chatbot`.
