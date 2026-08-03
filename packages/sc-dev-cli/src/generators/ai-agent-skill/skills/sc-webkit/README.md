# SC WebKit Skills

Copilot skill files for working with `@scdevkit/webkit` web components in Service Bench plugin projects.

## Skills

| Skill | What it covers |
|---|---|
| [sc-webkit-components](./sc-webkit-components/SKILL) | Static component index for 113 `sc-*` components across 10 categories — attributes, slots, events, and stories |
| [sc-webkit-live](./sc-webkit-live/SKILL) | Live API reference for 95+ `sc-*` components — properties, attributes, slots, events, CSS tokens, and common patterns |

---

## sc-webkit-components

Provides a **static component index** auto-generated from story files, covering 113 `sc-*` components across 10 categories.

**Use when:**
- Looking up which `sc-*` component tag to use for a given UI requirement
- Browsing available components by category (Business, Buttons & Actions, Content & Display, Data & Tables, etc.)
- Finding component attributes, slots, events, and stories from the reference files

**How it works:**
1. Identifies the component category from the index in `SKILL.md`
2. Opens the corresponding reference file (e.g. `references/sc-webkit-forms.md`) for full API details
3. Uses the attribute/slot/event tables in the reference file when implementing

---

## scdevkit-webkit

Provides **version-accurate** component APIs by reading directly from the installed `node_modules/@scdevkit/webkit` package rather than relying on static documentation that may be out of date.

**Use when:**
- Looking up exact properties, attributes, methods, or slots for a `sc-*` component (e.g. `sc-button`, `sc-data-grid`, `sc-dialog`)
- Choosing the right WebKit component for a UI requirement
- Applying webkit design tokens or CSS variables (see [design-system](./sc-webkit-live/references/design-system))
- Building LitElement components in a Service Bench plugin project

**How it works:**
1. Locates `node_modules/@scdevkit/webkit/custom-elements.json` in the active project
2. Resolves the component's module path from the manifest
3. Reads the TypeScript declaration file (`.d.ts`) for accurate, current API details

**Design system reference:** [design-system](./sc-webkit-live/references/design-system) — CSS custom properties, design tokens, and theming guidance.
