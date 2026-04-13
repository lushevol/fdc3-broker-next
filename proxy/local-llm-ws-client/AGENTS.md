# local-llm-ws-client

Socket.IO client for local LLM. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Socket.IO client that connects to the `ws-gateway-server` relay for local LLM integration.

## Key Details

- **Language:** TypeScript
- **Transport:** Socket.IO client
- **Testing:** Jest with `ts-jest`
- **Build:** `tsc` (TypeScript compiler)

## Commands

```bash
npm run dev    # Start with ts-node-dev (hot reload)
npm run build  # tsc compile
npm run test   # Jest
```

## Conventions

- Source in `src/`
- Tests also in `src/` (Jest roots)
- `testPathIgnorePatterns`: `/node_modules/`, `/dist/`

## Important

- Not started by default in root `npm run dev` or `npm run dev:services`
- Must have `ws-gateway-server` running first
