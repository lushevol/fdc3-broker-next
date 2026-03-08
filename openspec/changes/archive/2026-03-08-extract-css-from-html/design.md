# Design: Extract CSS from HTML

## Context

A 1.8MB static HTML file (`cashflowblotter-light.html`) was exported from a running React micro-frontend application for preview purposes. The file contains:

- **40,474 lines** of HTML
- **~50 `<style>` blocks** with embedded CSS
- **1,767 inline `style=""` attributes** on DOM elements
- **Mixed CSS sources**: Ant Design, MUI, custom MicroWebUI components

The HTML uses a micro-frontend architecture with Single-SPA, containing styles from multiple component libraries that were inlined during server-side rendering or snapshot capture.

**Constraints**:

- Original file must be preserved unchanged
- Output must render identically to the original
- No build step required for the extracted output (static files only)
- CSS organization should follow design system conventions (tokens → components)

## Goals / Non-Goals

**Goals:**

- Extract all CSS from `<style>` blocks into separate categorized files
- Generate clean HTML with `<link>` tags replacing embedded styles
- Organize CSS by design system layer for maintainability
- Provide an extraction script that can be reused for similar HTML files
- Enable browser caching of CSS (reduce initial load time)

**Non-Goals:**

- Extracting inline `style=""` attributes to CSS classes (preserve as-is for now)
- Minifying or optimizing CSS output
- Generating source maps
- Creating a design token system from extracted values (just extract, don't redesign)
- Running as part of a build pipeline (one-time extraction tool)

## Decisions

### D1: Extraction Method — Node.js Script

**Decision**: Create a Node.js script using native `fs` and regex-based parsing.

**Rationale**:

- No need for full HTML/CSS AST parsing for a one-time extraction
- Regex sufficient for identifying `<style>` blocks and extracting contents
- Simpler than setting up a full build pipeline
- Can be run with `node` directly, no additional tooling

**Alternatives considered**:

- **Puppeteer/JSDOM**: Overkill for static file parsing, adds unnecessary complexity
- **PostCSS/CSS parser**: Useful for CSS analysis but not needed for simple extraction
- **Manual extraction**: Too error-prone for ~25,000 lines of CSS

### D2: CSS Organization — Layered Files by Source

**Decision**: Split CSS into 6 files organized by source library/type.

| File             | Contents                              | Source Pattern                     |
| ---------------- | ------------------------------------- | ---------------------------------- |
| `tokens.css`     | CSS variables, keyframes, base resets | `:root`, `@keyframes`, `@charset`  |
| `fonts.css`      | `@font-face` definitions              | `@font-face` rules                 |
| `antd.css`       | Ant Design component styles           | `.ant-*`, `:where(.css-*)`         |
| `mui.css`        | MUI component styles                  | `.Mui*`, emotion hash classes      |
| `components.css` | Custom MicroWebUI styles              | `.MicroWebUI_*`, `.css-*` (custom) |
| `utilities.css`  | Utility classes, catch-all            | Remaining rules                    |

**Rationale**:

- Follows design system layering conventions
- Enables loading only needed stylesheets if desired
- Makes debugging easier (know which file to check for a style)
- Matches how the original React app likely organized imports

**Alternatives considered**:

- **Single CSS file**: Simpler but loses organization, harder to debug
- **Per-component files**: Too many files, over-organization for static output
- **Keep original `<style>` order**: Loses the benefit of organization

### D3: Inline Style Handling — Preserve As-Is

**Decision**: Leave inline `style=""` attributes untouched in the HTML.

**Rationale**:

- 1,767 inline styles would require generating 1,767+ unique CSS classes
- Many inline styles contain dynamic values (e.g., `background-color: rgb(247, 249, 253)`)
- Extraction would require class naming conventions that don't exist
- Risk of breaking visual rendering is high
- Inline styles are already "extracted" from CSS perspective (not in `<style>` blocks)

**Alternatives considered**:

- **Extract to utility classes**: Would need to create a utility class system
- **Extract to element-specific classes**: `._style_abc123 { ... }` - not maintainable

### D4: Deduplication — Basic Rule Merging

**Decision**: Merge identical CSS rules across `<style>` blocks, preserving specificity order.

**Rationale**:

- Same CSS rules appear in multiple style blocks (from code splitting in original app)
- Deduplication reduces file size and improves maintainability
- Must preserve order to maintain cascade behavior

**Implementation**:

- Track rules by their selector + declarations hash
- Keep first occurrence, skip duplicates
- Log duplicate count for verification

### D5: Output Structure — Flat HTML + CSS Directory

**Decision**: Output as `index.html` with `css/` subdirectory.

```
extracted/cashflowblotter-light/
├── index.html          # Main HTML file
├── css/
│   ├── tokens.css
│   ├── fonts.css
│   ├── antd.css
│   ├── mui.css
│   ├── components.css
│   └── utilities.css
└── assets/             # Future: extracted images, fonts
```

**Rationale**:

- Clean separation of concerns
- Works as a static site (just open `index.html`)
- CSS files can be cached by browser
- Easy to deploy to any static hosting

## Risks / Trade-offs

### Risk: CSS Specificity Changes

**Risk**: Reordering CSS into files might change cascade behavior.
**Mitigation**: Process styles in original order, group by file only at final output. Run visual comparison after extraction.

### Risk: Missing Style Categories

**Risk**: Some CSS rules may not fit neatly into predefined categories.
**Mitigation**: Default to `utilities.css` for uncategorized rules. Script logs uncategorized selectors for review.

### Risk: Cross-File Selector Conflicts

**Risk**: Same selector in multiple files could cause cascade issues.
**Mitigation**: Ensure each selector only appears in one file. The deduplication step handles this.

### Trade-off: No Dynamic Theme Support

**Trade-off**: The original app likely supported dark/light themes via CSS variables. The extracted CSS will have only the "light" theme values baked in.
**Acceptance**: This is acceptable since the output is a static snapshot for preview purposes.

## Implementation Approach

### Phase 1: Parse and Extract

```bash
node scripts/extract-css.mjs <input.html> <output-dir>
```

1. Read HTML file as string
2. Find all `<style type="text/css">` blocks using regex
3. Extract CSS content from each block
4. Store with original position for ordering

### Phase 2: Categorize and Deduplicate

1. Parse each CSS block into rules
2. Categorize by selector pattern:
   - `.ant-*` → antd
   - `.Mui-*` → mui
   - `.MicroWebUI_*` → components
   - `@font-face` → fonts
   - CSS variables/keyframes → tokens
   - Everything else → utilities
3. Deduplicate identical rules within each category
4. Log statistics (rules per category, duplicates removed)

### Phase 3: Generate Output

1. Create output directory structure
2. Write each CSS category to its file
3. Generate new HTML:
   - Remove all `<style>` blocks
   - Add `<link rel="stylesheet">` tags in `<head>`
   - Preserve all other HTML unchanged
4. Write `index.html`

### Phase 4: Verification

1. Compare file sizes (original vs extracted)
2. Open both in browser for visual comparison
3. Check CSS coverage (no broken styles)

## Open Questions

1. **Should we also extract embedded base64 images?**
   - Current scope: No, leave embedded images as-is
   - Future enhancement if needed

2. **Should we generate a manifest of extracted styles?**
   - Could be useful for debugging
   - Add as optional `--manifest` flag

3. **Should the script handle multiple HTML files?**
   - Currently designed for single file
   - Can be extended with glob patterns if needed
