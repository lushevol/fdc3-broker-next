# chat-protocol-contract

Shared protocol contract for chat run requests, request-history messages, stream frames, fixtures, and validation.

## Notes

- Canonical request message field is `parts`, not `content`.
- Request history supports `system`, `user`, `assistant`, and `tool` roles.
- `tool` messages are for historical tool outputs in continuation requests, not a replacement for streaming frames.
- The Assistant UI capture adaptation lives in [docs/ai-chatbot-api-capture.md](docs/ai-chatbot-api-capture.md).

## Commands

```bash
npm --workspace packages/chat-protocol-contract run build
npm --workspace packages/chat-protocol-contract run test
npm --workspace packages/chat-protocol-contract run lint
```
