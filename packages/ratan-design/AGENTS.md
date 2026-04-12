# ratan-design

Design system package. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Shared design system with Ant Design + Emotion + design tokens. Provides reusable UI primitives (Button, Card, Input) and a token system.

## Key Files

- `src/index.ts` – Main entry, exports all components and tokens
- `src/Button.tsx`, `src/Card.tsx`, `src/Input.tsx` – Core components
- `src/tokens/` – Design token definitions (also generates CSS/SCSS/LESS via scripts)
- `scripts/generate-tokens.ts` – Token generation script (outputs CSS, SCSS, LESS variants)

## Conventions

- Built with **Rslib** (library mode)
- Testing with **Vitest** (`happy-dom`/`jsdom` environment)
- Has **Storybook** for component documentation
- Components should be displayed in Storybook (add stories alongside components)
- All generated code must pass lint and tests
- `private: true` in package.json – not published to npm, only consumed internally

## Commands

```bash
npm run build              # Rslib production build
npm run dev                # Rslib watch mode
npm run test               # Vitest run
npm run dev:sb             # Storybook dev server
npm run build:sb           # Storybook static build
npm run generate:tokens    # Regenerate design tokens
npm run generate:tokens:css    # Generate token CSS output
npm run generate:tokens:scss   # Generate token SCSS output
npm run generate:tokens:less   # Generate token LESS output
npm run lint                # ESLint
npm run format              # Prettier write
npm run css-cleanup          # Run CSS cleanup script
```

## Token Generation

Running `npm run generate:tokens` reads token source files and outputs CSS custom properties, SCSS variables, and LESS variables. After modifying tokens, regenerate all outputs.

## Docs

- Rslib: https://rslib.rs/llms.txt
- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
