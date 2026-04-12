# mf_container

Module Federation container host. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Alternative container implementation using **Module Federation** instead of SystemJS. Simpler setup for micro-frontends that don't need single-spa lifecycle management.

## Key Files

- `rsbuild.config.ts` – Uses `@module-federation/rsbuild-plugin`
- `module-federation.config` – Module Federation config (remotes, exposes, shared deps)
- `src/App.tsx` – Root React component

## Conventions

- Does **not** output SystemJS – uses Module Federation (Rspack plugin) instead
- No `env-cmd` – uses plain `.env` file
- No separate `.env.local`/`.env.server` split
- No Jest test setup (add if needed)
- Port: 3000 (from `.env`)
- Has `dev:debug` script with `FEDERATION_DEBUG=true` for MF debugging

## Commands

```bash
npm run dev        # Dev server (rsbuild dev)
npm run dev:debug  # Dev server with Module Federation debug logging
npm run build      # rsbuild build
npm run preview    # rsbuild preview (serve production build locally)
npm run lint       # ESLint
```

## Differences from SystemJS containers

- No single-spa lifecycle (bootstrap/mount/unmount)
- No import map – remotes defined in `module-federation.config`
- Shared dependencies configured in Module Federation config, not import map
- No `system-entry.ts` or public path setup needed
