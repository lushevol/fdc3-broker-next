# Chatbot Integration Guide for MFEs

This guide explains how to integrate the `@fm/base` chatbot into a Micro-Frontend application after the full assistant-ui modal cutover.

The public integration model is now:

- mount `AssistantUIRuntimeProvider` once near the app root
- render `ChatbotSidebar` as the floating assistant modal trigger
- use the canonical backend SSE stream contract for message, tool, and generative UI updates

Legacy compatibility helpers such as `ChatbotProvider`, `useChatbot`, and `useChatbotController` are no longer part of the supported integration surface.

## Prerequisites

- Your MFE must be able to consume Module Federation remotes from the `@fm/base` MFE
- React 18+ is required
- Material-UI v5 is required

## Quick Start

### 1. Import the chatbot exports

```ts
// src/Root/import/index.ts
import * as Container from '@fm/base';

export const ChatbotSidebar = Container.ChatbotSidebar;
export const AssistantUIRuntimeProvider = Container.AssistantUIRuntimeProvider;
```

### 2. Mount the runtime once and render the modal trigger

```tsx
// src/App.tsx
import { AssistantUIRuntimeProvider, ChatbotSidebar } from './Root/import';

const App: React.FC = () => {
  return (
    <AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
      <YourRoutes />
      <ChatbotSidebar />
    </AssistantUIRuntimeProvider>
  );
};
```

### 3. Configure the backend URL

The runtime defaults to `/api/chat` in the base application. If your host MFE mounts the runtime itself, pass the backend URL directly:

```tsx
<AssistantUIRuntimeProvider apiUrl="https://your-backend.com/api/chat">
  <YourRoutes />
  <ChatbotSidebar />
</AssistantUIRuntimeProvider>
```

## Runtime Architecture

- `AssistantUIRuntimeProvider` is the only supported chat runtime.
- `ChatbotSidebar` renders an assistant-ui modal trigger and modal content.
- The modal thread and composer are rendered through assistant-ui primitives.
- Tool calls and generative UI blocks are rendered inline from the backend SSE event stream.

## Component Surface

### AssistantUIRuntimeProvider

| Prop       | Type        | Default       | Description                           |
| ---------- | ----------- | ------------- | ------------------------------------- |
| `apiUrl`   | `string`    | `'/api/chat'` | Backend API base URL                  |
| `children` | `ReactNode` | required      | Application subtree using the runtime |

### ChatbotSidebar

`ChatbotSidebar` no longer exposes sidebar-specific props such as `isOpen`, `onToggle`, `position`, or `width`. It is a floating assistant modal trigger that manages its open state internally through assistant-ui modal primitives.

## Canonical SSE Contract

The frontend expects the backend stream to emit these named events:

| Event             | Purpose                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `conversation_id` | Conversation identifier for new or resumed chats                       |
| `message`         | Incremental assistant text chunks                                      |
| `tool_call`       | Tool invocation update with stable tool call ID, arguments, and status |
| `tool_result`     | Tool result or cancellation payload for a prior `tool_call`            |
| `generative_ui`   | Data payload for inline generative UI rendering                        |
| `error`           | Terminal stream error                                                  |
| `done`            | End-of-turn marker after all text/tool/UI events are emitted           |

## Styling

The chatbot surface now uses the local assistant-ui modal/thread presentation that ships with `@fm/base`. It still respects the host application's MUI/Tailwind styling environment, but it is no longer a slide-in sidebar.

## Troubleshooting

### Chatbot not loading

1. Ensure `@fm/base` is running and accessible.
2. Check Module Federation configuration.
3. Verify the host app mounts `AssistantUIRuntimeProvider`.

### Messages not sending

1. Check the backend is running at the configured URL.
2. Verify `/api/chat/stream` requests in browser dev tools.
3. Check for authentication or proxy failures in the app shell.

### Modal opens but shows no responses

1. Confirm the backend emits the canonical SSE events listed above.
2. Check browser console output for stream or proxy errors.
3. Verify that `conversation_id`, `message`, and `done` events are emitted in the expected turn sequence.

## Example: Full Integration

```tsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { AssistantUIRuntimeProvider, ChatbotSidebar } from './Root/import';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AssistantUIRuntimeProvider apiUrl="/api/chat">
        <Routes />
        <ChatbotSidebar />
      </AssistantUIRuntimeProvider>
    </ThemeProvider>
  );
};

export default App;
```
