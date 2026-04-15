# chat-protocol-contract

Shared protocol contract for chat run requests, request-history messages, stream frames, fixtures, and validation.

## Notes

- Canonical request message field is `parts`, not `content`.
- Request history supports `system`, `user`, `assistant`, and `tool` roles.
- `tool` messages are for historical tool outputs in continuation requests, not a replacement for streaming frames.
- The Assistant UI weather capture adaptation lives in [docs/ai-chatbot-api-capture.md](/Users/taissa/lushuai/code/mfe/mfe-next/packages/chat-protocol-contract/docs/ai-chatbot-api-capture.md).
