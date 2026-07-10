# chat-protocol-runtime

Frontend runtime adapters for `chat-protocol-contract` and Assistant UI.

The package converts Assistant UI thread messages into protocol messages, builds run and resume requests, consumes streaming frames, executes frontend tools through a toolkit bridge, and renders protocol message parts with a configurable card registry.

## Commands

```bash
npm --workspace packages/chat-protocol-runtime run build
npm --workspace packages/chat-protocol-runtime run test
npm --workspace packages/chat-protocol-runtime run lint
```

## Main exports

- `buildChatProtocolRequest()` and `toProtocolMessages()`
- `streamProtocolRun()` and `createProtocolResultStream()`
- `createProtocolLocalRuntime()` and `createProtocolStreamAdapter()`
- `buildHumanToolResumeRequest()` and resume helpers
- `ProtocolMessageRenderer` and the default card registry
- `ToolkitBridge` and `isToolkitBridge()`

Request messages use the canonical `parts` field defined by `chat-protocol-contract`. For frontend tools, use `toolkitBridge`; the older `resolveFrontendTool` callback is deprecated.

## Requirements

- Node.js 18 or later
- React and React DOM 18 or later
- A compatible `chat-protocol-contract` package
