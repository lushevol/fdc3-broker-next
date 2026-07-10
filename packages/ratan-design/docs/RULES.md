# ratan-design — Rules & Conventions

> Parent rules: [Monorepo AGENTS.md](../../../AGENTS.md) · [Monorepo rules](../../../docs/rules.md)

## Design Tokens

- **NEVER** use hardcoded colors, sizes, or typography values in component code. Always import from `src/tokens/`.
- Token imports follow this pattern:
  ```ts
  import { primitiveColors, foundationColors } from './tokens/colors';
  import { typographyStyles, fontFamily } from './tokens/typography';
  import { componentSizes, componentSpacing } from './tokens/sizes';
  ```
- When adding a new token, update the relevant source file (`colors.ts`, `sizes.ts`, etc.) and run `npm run generate:tokens` to regenerate output files.

## Component Styling

- Use **Emotion `css` template literals** and **`styled` components** for all component styling.
- Never use inline `style` props for component styling (currently Button has one minor exception for flex layout — this should be refactored).
- Never use global CSS for component styling.
- Prefer `css` template literal approach with style functions over `styled` for conditional styles based on props.

## Adding Components

1. Follow existing patterns from `Button.tsx`, `Card.tsx`, `Input.tsx`
2. Use `React.FC` type with explicit `Props` interface
3. Export both named and default exports from the component file
4. Add component to barrel export in `src/index.ts`
5. Include design token references (import from `src/tokens/`)
6. Add matching Storybook stories in `stories/`
7. Add tests in `tests/`

## Theme System

- Always support **both light and dark themes**.
- Use `cssVariables.ts` to generate CSS custom properties — do not hand-write `var()` declarations.
- Light theme: `src/tokens/themes/light.ts`
- Dark theme: `src/tokens/themes/themes/dark.ts`
- Theme type interface: `src/tokens/themes/types.ts`

## Token Generation

- Run `npm run generate:tokens` after modifying any token source file.
- Outputs go to `src/tokens/_generated/` (CSS, SCSS, LESS variants).
- The generation script is `scripts/generate-tokens.ts`.
- Sub-commands: `generate:tokens:css`, `generate:tokens:scss`, `generate:tokens:less`, `generate:tokens:preview`.

## CSS Naming Convention

- All CSS custom properties use the `--sc-` prefix (SC = Standard Chartered).
- Example: `--sc-color-blue-500`, `--sc-font-size-14`, `--sc-spacing-md`
- Foundation colors: `--sc-color-foundation-basic-background-base`
- Semantic colors: `--sc-color-semantic-fg-link-primary-rest`

## Testing

- **Vitest** with `jsdom` environment.
- Write tests in `tests/` directory, not colocated with source.
- Use `@testing-library/react` for component tests.
- Target >90% coverage.
- Run: `npm run test`
- Coverage config: v8 provider, includes `src/**/*.ts`

## Ant Design Integration

- The `Input` component wraps Ant Design `Input` via `ConfigProvider` with custom theme tokens.
- Override theme tokens for Ant Design components — **never fight the framework** with `!important` or excessive样式 overrides.
- Use Ant Design's `ThemeConfig` to map GDS tokens to Ant Design's token system.

## Dependencies

- React and Emotion are **direct dependencies** (not peer dependencies) — be aware of potential duplication issues when consumed in apps that also bundle React.
- `antd` is a direct dependency (v6.x). This means consumers get Ant Design bundled unless they also depend on it directly.
- `cheerio` and `css-tree` are direct dependencies used only by the CSS cleanup utility — consider making this tree-shakeable or optional in the future.

## No Peer Dependencies

Unlike `mf_lib`, this package lists React and Emotion as direct dependencies (not peers). This simplifies consumption but can cause duplicate React instances in micro-frontend environments. Consumers should ensure module federation shared config aligns.
