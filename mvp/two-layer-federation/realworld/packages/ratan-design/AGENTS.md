# @fm/ratan-design

Production, domain-neutral design foundation. See the root `AGENTS.md` and `docs/RULES.md`.

## Commands

```bash
npm run test
npm run build
npm run lint
npm run dev:sb
```

## Required conventions

- Keep the public API bounded to `src/index.ts`.
- Use semantic `--ratan-*` tokens and local provider roots.
- React/MUI/Emotion are peers; do not add runtime composition or domain dependencies.
- Update tests, stories, and release guidance for every public change.
