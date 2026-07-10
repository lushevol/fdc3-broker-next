# chat-protocol-ui

Reusable React UI for the shared chat protocol. It combines Assistant UI with `chat-protocol-runtime` and exports the sidebar, modal, thread, Markdown/code renderers, MCP/model status controls, and lower-level UI components used by the portal and standalone demo.

Import the stylesheet once in the consuming application:

```ts
import 'chat-protocol-ui/styles.css';
```

## Commands

```bash
npm --workspace packages/chat-protocol-ui run build
npm --workspace packages/chat-protocol-ui run test
npm --workspace packages/chat-protocol-ui run lint
```

## Provider

Wrap chat UI with `ChatProtocolProvider`, supplying the backend run endpoint and an Assistant UI toolkit:

```tsx
import { AssistantSidebar, ChatProtocolProvider, type Toolkit } from 'chat-protocol-ui';

const toolkit: Toolkit = {};

export function Chat() {
  return (
    <ChatProtocolProvider apiUrl="/api/chat/runs" toolkit={toolkit}>
      <AssistantSidebar />
    </ChatProtocolProvider>
  );
}
```

Optional provider inputs include protocol tool descriptors, run context and metadata, a user ID, model suggestions, frame callbacks, and a toolkit bridge for frontend tool execution.

## Requirements

- React and React DOM 18 or later
- `chat-protocol-contract` and `chat-protocol-runtime` version 0.0.1
