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

**Response Format (SSE Events):**

```
event: conversation_id
data: <uuid-string>

event: message
data: Hello

event: message
data: there

event: done
data:
```

**Event Types:**

| Event           | Description                           |
| --------------- | ------------------------------------- |
| conversation_id | Sent first with the conversation UUID |
| message         | Streamed text chunks                  |
| tool_call       | When the AI invokes a tool            |
| tool_result     | Tool execution result                 |
| error           | Error message                         |
| done            | Stream complete                       |

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
      "timestamp": "2024-01-15T10:30:05Z"
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

The backend supports tool execution. When the AI calls a tool, the following events are sent:

```
event: tool_call
data: {"id":"tool-uuid","name":"get_current_time","arguments":{},"status":"running"}

event: tool_result
data: {"toolCallId":"tool-uuid","result":{"time":"2024-01-15T10:30:00Z"}}
```

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
