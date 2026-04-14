# ratan-design — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| UI Framework  | Ant Design 6.x                          |
| Styling       | Emotion (css + styled)                  |
| Build         | Rslib (ESM, unbundled, web target)      |
| Testing       | Vitest + jsdom + @testing-library/react |
| Documentation | Storybook 10.x (React + Rslib builder)  |
| Language      | TypeScript 5.9                          |

## Directory Structure

```
ratan-design/
├── src/
│   ├── index.ts              # Barrel exports (components, tokens, utilities)
│   ├── Button.tsx            # Button component (6 variants, 4 statuses, 2 styles)
│   ├── Card.tsx              # Card component (3 variants, 4 paddings, 3 image positions)
│   ├── Input.tsx             # Input component (3 sizes, 4 statuses, wraps Ant Design)
│   ├── tokens/
│   │   ├── index.ts          # Token barrel exports
│   │   ├── colors.ts         # Primitive colors (12 scales) + foundation + semantic
│   │   ├── colorsDark.ts     # Dark theme inverted color palette
│   │   ├── typography.ts     # Font families, sizes, weights, line heights, styles
│   │   ├── sizes.ts          # Component sizes, spacing, border radius, icon sizes
│   │   ├── shadows.ts        # Elevation/shadow tokens
│   │   ├── grid.ts           # Responsive breakpoints, column config, gutters
│   │   ├── patterns.ts       # UX writing principles and standard patterns
│   │   ├── cssVariables.ts   # CSS/SCSS/LESS variable generator (--sc- prefix)
│   │   ├── themes/
│   │   │   ├── light.ts      # Light theme definition
│   │   │   ├── dark.ts       # Dark theme definition
│   │   │   └── types.ts      # Theme type interfaces
│   │   └── _generated/       # Generated token outputs (CSS, SCSS, LESS)
│   └── css-cleanup/
│       ├── index.ts           # cleanUnusedCss() public API
│       ├── css-process.ts     # CSS AST processing
│       ├── dom-signature.ts   # DOM element signature extraction
│       ├── selector-match.ts  # Selector-to-DOM matching
│       └── types.ts           # Shared types (CleanUnusedCssOptions, etc.)
├── stories/                  # Storybook story files
├── tests/                    # Vitest test files
├── scripts/
│   └── generate-tokens.ts    # Token generation CLI (CSS, SCSS, LESS, preview)
├── rslib.config.ts           # Build config (ESM, unbundled)
├── vitest.config.ts          # Test config (jsdom, v8 coverage)
└── vitest.setup.ts           # Test setup (@testing-library/jest-dom)
```

## Token System Architecture

### colors.ts

- **Primitive colors**: 12 color scales (grey, blue, green, amber, red, magenta, olive, violet, orange, maroon, teal, purple) + prosperBlue. Each scale has 18-25 shade steps.
- **Foundation colors**: Semantic naming mapped to primitives via CSS custom properties (`var(--sc-color-*)`)
  - `foundationBasicColors` — background, container, divider, brand colors
  - `foundationContentColors` — header, title, body, label, input, placeholder, error, warning, success text (with inverse variants)
  - `foundationColors.state` — interactive states (surface, border, text, link, focus)
- **Semantic foreground colors**: Link and text colors organized by variant (primary, secondary, destructive, warning, success) × state (rest, hover, pressed, selected, disabled, subtle)

### colorsDark.ts

- Inverted dark theme palette. Grey scale reversed (white→black, black→white). Color scales adjusted for dark backgrounds.

### typography.ts

- Font families (primary: SC Prosper Sans), sizes (6px–56px), weights (300–900), line heights, letter spacing
- Pre-composed `typographyStyles` objects (hero, headline, section, paragraph, title, component, label, description, helper)

### sizes.ts

- Component sizes (1px–960px), spacing (2px–48px), border radius (0px–999px), icon sizes (12px–64px)

### shadows.ts

- Shadow tokens (base, elevated) with elevation levels (1–5)
- Pre-composed `shadowStyles` for direct CSS use

### grid.ts

- Breakpoints: mobile (375px), tablet (768px), desktop (1440px)
- Column configs: mobile (4 columns), tablet (8 columns), desktop (12 columns)
- Gutters: 24px default, 12px half, 6px quarter, 48px double
- Container max-widths per breakpoint

### patterns.ts

- UX writing voice chart (human, dynamic, direct)
- Crafting structure (inform → context → choices)
- Button labels, form labels, error messages, empty states, toast messages
- Micro-copy guidelines and do's/don'ts

### cssVariables.ts

- Generator functions: `generateColorCssVariables()`, `generateSizeCssVariables()`, `generateTypographyCssVariables()`, `generateGridCssVariables()`, `generateShadowCssVariables()`, `generateThemeVariables()`, `generateAllCssVariables()`, `generateThemedCssVariables()`, `generateCompleteCssModule()`, `generateScssVariables()`, `generateLessVariables()`
- All output uses `--sc-` prefix (SC = Standard Chartered)

## Component Details

### Button (`src/Button.tsx`)

- Types: primary, secondary, floating, link, link-contrast, text
- Statuses: neutral, error, alert, success
- Styles: text (default), icon-only
- Features: loading spinner, selected state, fullWidth, leading/trailing icons
- Styling: Emotion `css` template literals + `styled` components
- Tokens: Local `tokens` object derived from GDS specs (not yet imported from src/tokens/)

### Card (`src/Card.tsx`)

- Variants: base, clickable, selected
- Paddings: none, small, medium, large
- Image positions: top, left, background
- Selection types: none, checkbox, radio
- Trailing content: none, chevron, switch, more-menu, buttons, hint-text

### Input (`src/Input.tsx`)

- Sizes: small, medium, large
- Statuses: default, error, warning, success
- Wraps Ant Design `Input` via `ConfigProvider` with custom theme tokens
- Also exports `PasswordInput` and `SearchInput` subcomponents

## CSS Cleanup Utility (`src/css-cleanup/`)

`cleanUnusedCss(html: string, css: string, options?)` takes HTML and CSS strings, parses them, and removes CSS selectors that don't match any elements in the HTML. Returns `{ css: string, stats: CleanupStats }`.

Uses `css-tree` for CSS parsing and `cheerio` for HTML DOM analysis via DOM signature extraction.

## Build

- **Rslib** config: ESM output, `bundle: false` (unbundled), `target: 'web'`
- Source entry: `./src/**/*.{ts,tsx,js,jsx}` (glob, preserves file structure)
- Plugin: `pluginReact()`
- Token generation: `npm run generate:tokens` runs `scripts/generate-tokens.ts` which reads token sources and outputs CSS, SCSS, and LESS files to `src/tokens/_generated/`

## Testing

- **Vitest** with `jsdom` environment, `@testing-library/react`, `@testing-library/jest-dom`
- Coverage: v8 provider, includes `src/**/*.ts`, excludes test/spec files
- Reporters: default, JUnit XML, Sonar XML
- 30 tests across Button, Card, Input, and css-cleanup modules

## Storybook

- Storybook 10.x with React + Rslib builder
- Stories directory: `stories/`
- Run: `npm run dev:sb`
- Build: `npm run build:sb`
