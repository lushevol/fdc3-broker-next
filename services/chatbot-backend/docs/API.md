# Chatbot Backend API Documentation

## Overview

The Chatbot Backend provides a RESTful API for AI-powered chat interactions with streaming support via Server-Sent Events (SSE).

## Base URL

```
http://localhost:8080/api/chat
```

## Authentication

All endpoints (except `/health`) require Bearer token authentication:

```http
Authorization: Bearer <your-token>
```

The backend resolves dynamic tool and MCP access from token claims:

- `chatbot_profiles`: array or comma-separated string of user profiles
- `chatbot_profile_version`: optional profile fingerprint/version string for cache invalidation

If these claims are absent, the backend falls back to the `default` profile.

## Endpoints

### POST /api/chat

Send a chat message and receive a complete response.

**Request Body:**

```json
{
  "conversationId": "optional-existing-conversation-id",
  "message": "Hello, how can you help?",
  "stream": false
}
```

**Response:**

```json
{
  "conversationId": "uuid-string",
  "message": "AI assistant response..."
}
```

### GET /api/chat/stream

Send a chat message and receive a streaming response via SSE.

**Query Parameters:**

| Parameter      | Type   | Required | Description              |
| -------------- | ------ | -------- | ------------------------ |
| message        | string | Yes      | The message to send      |
| conversationId | string | No       | Existing conversation ID |
| toolContext    | string | No       | Serialized frontend tool continuation payload |
| frontendTools  | string | No       | Serialized frontend tool manifest |

**Response Format (canonical SSE events):**

```
event: conversation_id
data: <uuid-string>

event: message
data: Hello

event: message
data: there

event: tool_call
data: {"id":"tool-uuid","name":"calculator","arguments":{"expression":"2 + 2"},"status":"running","requiresConfirmation":false}

event: tool_result
data: {"toolCallId":"tool-uuid","result":{"expression":"2 + 2","result":4}}

event: generative_ui
data: {"name":"ChartCard","props":{"title":"Revenue"}}

event: done
data:
```

**Event Types:**

| Event           | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| conversation_id | Sent first with the conversation UUID                                            |
| message         | Streamed text chunks                                                             |
| tool_call       | Stable tool lifecycle update with tool call ID, tool name, arguments, and status |
| tool_result     | Tool result or cancellation payload referencing the same tool call ID            |
| generative_ui   | Structured UI directive for assistant-ui data rendering                          |
| error           | Error message                                                                    |
| done            | Stream complete                                                                  |

### GET /api/chat/{conversationId}/history

Get the conversation history.

**Response:**

```json
{
  "conversationId": "uuid-string",
  "messages": [
    {
      "id": "msg-uuid",
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": "msg-uuid",
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-15T10:30:05Z",
      "toolCalls": [
        {
          "id": "tool-uuid",
          "name": "calculator",
          "arguments": {
            "expression": "2 + 2"
          },
          "status": "running",
          "requiresConfirmation": false
        }
      ],
      "toolResults": [
        {
          "toolCallId": "tool-uuid",
          "result": {
            "expression": "2 + 2",
            "result": 4
          }
        }
      ]
    }
  ]
}
```

### DELETE /api/chat/{conversationId}

Clear a conversation history.

**Response:**

```json
{
  "success": true,
  "message": "Conversation cleared"
}
```

### GET /api/chat/health

Health check endpoint (no authentication required).

**Response:**

```json
{
  "status": "UP",
  "ready": true
}
```

### POST /api/chat/mcp/providers

Register a remote MCP provider so its tools can be dynamically exposed through the chatbot service.

**Request Body:**

```json
{
  "providerId": "portfolio-service",
  "serviceName": "Portfolio Service",
  "transportType": "STREAMABLE_HTTP",
  "url": "http://portfolio-service.internal/mcp",
  "enabledProfiles": ["advisor"],
  "description": "Portfolio lookup tools"
}
```

**Response:**

```json
{
  "providerId": "portfolio-service",
  "serviceName": "Portfolio Service",
  "transportType": "STREAMABLE_HTTP",
  "url": "http://portfolio-service.internal/mcp",
  "enabledProfiles": ["advisor"],
  "toolNames": ["portfolio_lookup"]
}
```

### GET /api/chat/mcp/providers

List runtime-registered MCP providers.

### DELETE /api/chat/mcp/providers/{providerId}

Unregister a runtime MCP provider.

## Rate Limiting

- **Limit:** 60 requests per minute per client
- **Headers:** `Retry-After` returned on 429 responses

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid or missing authentication token"
}
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to process message"
}
```

## Tool System

The backend supports both built-in tools and remote MCP tools. Tool lifecycle events use stable tool call IDs so the client can correlate pending, running, completed, failed, and cancelled states:

```
event: tool_call
data: {"id":"tool-uuid","name":"get_current_time","arguments":{},"status":"pending","requiresConfirmation":true}

event: tool_call
data: {"id":"tool-uuid","name":"get_current_time","arguments":{},"status":"running","requiresConfirmation":true}

event: tool_result
data: {"toolCallId":"tool-uuid","result":{"time":"2024-01-15T10:30:00Z"}}

event: tool_result
data: {"toolCallId":"tool-uuid","error":"Tool execution cancelled by user."}
```

### MCP Providers

- `STREAMABLE_HTTP` is the preferred transport for current MCP servers.
- `HTTP_SSE` remains available for legacy MCP endpoints when explicitly requested.
- Registered MCP tools are filtered per request using `chatbot_profiles` from the authenticated token.
- Resolved capability sets are cached by user plus profile fingerprint and automatically invalidated when the runtime registry changes.

## Example Usage

### JavaScript/TypeScript (EventSource)

```typescript
const eventSource = new EventSource('/api/chat/stream?message=Hello');

eventSource.addEventListener('message', (event) => {
  console.log('Token:', event.data);
});

eventSource.addEventListener('done', () => {
  console.log('Stream complete');
  eventSource.close();
});

eventSource.onerror = (error) => {
  console.error('Error:', error);
  eventSource.close();
};
```

### cURL

```bash
# Send message
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"message": "Hello"}'

# Stream message
curl -N http://localhost:8080/api/chat/stream?message=Hello \
  -H "Authorization: Bearer your-token"
```
