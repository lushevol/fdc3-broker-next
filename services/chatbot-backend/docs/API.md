# Chatbot Backend API

## Base URL

```text
http://localhost:8080/api/chat
```

## Authentication

`SecurityConfig` permits requests when `CHATBOT_SECURITY_ENABLED=false` (the local profile default). When security is enabled, pass:

```http
Authorization: Bearer <token>
```

The backend resolves tool and MCP access profiles from token claims:

- `chatbot_profiles`: array or comma-separated string.
- `chatbot_profile_version`: optional cache-busting profile version.

`CHATBOT_SECURITY_ADDITIONAL_PROFILES` can add profiles such as `advisor` during local runs.

## Canonical Chat Run

### `POST /api/chat/runs`

Consumes JSON and produces `text/event-stream`.

Request body:

```json
{
  "conversationId": "optional-conversation-id",
  "runId": "optional-run-id",
  "trigger": "submit-message",
  "config": {
    "modelName": "optional-model-name"
  },
  "userId": "operator-1",
  "messages": [
    {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "Show the most used functions in trades."
        }
      ]
    }
  ],
  "context": {
    "workspace": {
      "activeWorkspaceId": "workspace-1",
      "activeAppId": "base"
    },
    "tools": []
  },
  "metadata": {}
}
```

Important request conventions:

- Use `parts`, not `content`, for messages.
- Supported roles are `system`, `user`, `assistant`, and `tool`.
- `tool` messages are historical tool outputs in continuation requests.
- `trigger` values are `submit-message`, `submit-tool-result`, or `submit-action`.
- `userId`, when present, overrides the JWT-derived user id for memory isolation.

## Compatibility Chat Stream

### `POST /api/chat/stream`

Consumes a legacy `ChatRequest` JSON body and converts it into a protocol run. This endpoint exists for compatibility; new clients should use `/runs`.

## SSE Frames

The SSE event name is the frame `type`; the data payload is the whole frame object.

Common frame order:

```text
start
message-start
reasoning-summary?
plan-available?
start-step? / step-status? / finish-step?
text-start?
text-delta*
text-end?
tool-input-start? / tool-input-available?
user_question?
action-required?
tool-output-available? / tool-output-error?
finish
```

Key frame types:

| Type                    | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `start`                 | Run and conversation identifiers        |
| `message-start`         | Assistant message begins                |
| `reasoning-summary`     | Compact plan/reasoning summary          |
| `plan-available`        | Execution plan summary                  |
| `start-step`            | Step begins                             |
| `step-status`           | Step progress                           |
| `finish-step`           | Step completed or failed                |
| `text-start`            | Text part begins                        |
| `text-delta`            | Incremental assistant text              |
| `text-end`              | Text part ends                          |
| `tool-input-start`      | Tool call identity and execution target |
| `tool-input-available`  | Complete tool input                     |
| `tool-output-available` | Complete tool result                    |
| `tool-output-error`     | Tool execution error                    |
| `user_question`         | Pending AskUserQuestionTool batch       |
| `action-required`       | User approval required                  |
| `finish`                | Run completion with finish reason       |
| `error`                 | Terminal error frame                    |

Finish reasons are `stop`, `tool-calls`, `action-required`, and `error`.

## MCP Providers

### `POST /api/chat/mcp/providers`

Registers a remote MCP provider.

```json
{
  "providerId": "rag-knowledge-base",
  "serviceName": "RAG Knowledge Base",
  "transportType": "STREAMABLE_HTTP",
  "url": "http://localhost:8091/api/mcp",
  "enabledProfiles": ["advisor"],
  "description": "Read-only knowledge retrieval"
}
```

### `GET /api/chat/mcp/providers`

Lists registered providers.

### `GET /api/chat/mcp/providers/status`

Returns provider count, total tool count, and per-provider status.

### `DELETE /api/chat/mcp/providers/{providerId}`

Unregisters a provider.

## Models

### `GET /api/chat/models`

Fetches available models from the configured OpenAI-compatible provider's `/models` endpoint. Returns an empty list when the provider is unavailable or not configured.

## Health

### `GET /api/chat/health`

Returns:

```json
{
  "status": "UP"
}
```

## User Questions

### `POST /api/chat/question/answer`

Answers a pending question batch emitted in a `user_question` frame.

```json
{
  "batchId": "tool-call-id",
  "answers": {
    "question_id": "answer"
  }
}
```

### `POST /api/chat/question/{batchId}/answer`

Path-id variant. Body shape:

```json
{
  "answers": {
    "question_id": "answer"
  }
}
```

### `POST /api/chat/{conversationId}/question/{questionId}/answer`

Legacy endpoint for the old conversation/question composite key.

## E2E Support

These endpoints are only registered when `chatbot.e2e-support.enabled=true`:

- `GET /api/chat/e2e/question-batches/health`
- `POST /api/chat/e2e/question-batches/{batchId}`
- `GET /api/chat/e2e/question-batches/{batchId}`

## Rate Limiting

Default limit is 60 requests per minute per client. The health endpoint is excluded.
