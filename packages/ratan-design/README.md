# ratan-design

Shared Ratan design system built with React, TypeScript, Ant Design, Emotion, generated design tokens, Vitest, and Storybook.

## Commands

```bash
npm --workspace packages/ratan-design run build
npm --workspace packages/ratan-design run test
npm --workspace packages/ratan-design run lint
npm --workspace packages/ratan-design run dev
npm --workspace packages/ratan-design run dev:sb
```

Token outputs are generated with the `generate:tokens:*` scripts. Use `dev:cashflow-preview` for the cashflow demo and `css-cleanup` for the package's CSS analysis workflow.

Detailed references:

- [Project guide](docs/PROJECT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development rules](docs/RULES.md)
