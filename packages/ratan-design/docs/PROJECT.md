# ratan-design — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Design System Package (Internal, private)

## Purpose

SC Global Design System (GDS) component library built on Ant Design + Emotion + comprehensive design tokens. Provides reusable UI primitives (Button, Card, Input), token-to-CSS/SCSS/LESS generation, CSS cleanup utility, and HTML sanitization/analysis.

## Status

Active Development (v0.0.2)

## Key Features

- **Button** — 6 variants (primary, secondary, floating, link, link-contrast, text), 4 statuses (neutral, error, alert, success), 2 styles (text, icon-only), icon support (leading/trailing), loading state
- **Card** — 3 variants (base, clickable, selected), 4 paddings (none, small, medium, large), 3 image positions (top, left, background), selection types (checkbox, radio)
- **Input** — 3 sizes (small, medium, large), 4 statuses (default, error, warning, success), wraps Ant Design Input via ConfigProvider
- **12-color primitive + semantic token system** — grey, blue, green, amber, red, magenta, olive, violet, orange, maroon, teal, purple + prosperBlue
- **Light/dark theme support** — Complete dark mode color palette with theme switching
- **CSS/SCSS/LESS variable generation** — `cssVariables.ts` generates custom properties with `--sc-` prefix
- **Responsive grid system** — 375/768/1440 breakpoints, 12-column desktop layout
- **UX writing tokens and guidelines** — patterns.ts provides voice chart, crafting structure, micro-copy guidelines
- **CSS cleanup utility** — `cleanUnusedCss()` removes unused CSS selectors from HTML strings
- **Storybook documentation** — Interactive component playground with 10.x

## Quick Start

```bash
npm run dev               # Rslib watch mode
npm run build             # Production build (ESM, unbundled)
npm run dev:sb            # Storybook dev server
npm run build:sb          # Storybook static build
npm run test              # Vitest (jsdom)
npm run generate:tokens   # Regenerate CSS/SCSS/LESS from token sources
npm run lint              # ESLint
npm run format            # Prettier
npm run css-cleanup       # Run CSS cleanup script
```

## Dependencies

| Package               | Purpose                                     |
| --------------------- | ------------------------------------------- |
| antd 6.x              | Base component primitives (Input wraps Ant) |
| @emotion/react+styled | CSS-in-JS styling for custom components     |
| lucide-react          | Icon library                                |
| date-fns              | Date utilities                              |
| cheerio               | HTML parsing for CSS cleanup & sanitization |
| css-tree              | CSS AST parsing for cleanup utility         |
