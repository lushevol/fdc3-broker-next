# ws-gateway-server

NestJS WebSocket gateway (Socket.IO relay). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

WebSocket relay server built with NestJS. Provides Socket.IO gateway for real-time communication between MFE apps and backend services.

## Key Details

- **Framework:** NestJS (TypeScript)
- **Transport:** Socket.IO
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
- E2E tests in `e2e/` with separate `tsconfig.json`
- `testPathIgnorePatterns`: `/node_modules/`, `/dist/`

## Important

- Not started by default in `npm run dev` or `npm run dev:services` at root level
- Start manually if WebSocket features are needed
- No port configured in package.json – check `src/main.ts` or `app.module.ts` for default port
