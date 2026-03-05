## Context

The `cashflow-blotter.html` file is a standalone HTML snapshot containing an AG Grid-based cashflow blotter UI with Ant Design components. It was exported from a running application and contains all CSS inlined within `<style>` tags. The file has significant CSS duplication due to:

1. **Multiple framework style injections**: Ant Design, AG Grid, and custom styles each inject their own `<style>` blocks
2. **Duplicate style blocks**: Same CSS rules appear in multiple `<style>` tags (observed at lines ~5000 and ~5056)
3. **Empty inline styles**: Many elements have `style=""` attributes with no value
4. **CSS custom properties**: Defined once but referenced throughout

The challenge is to reduce CSS while guaranteeing that every DOM element's computed styles remain **exactly identical**.

## Goals / Non-Goals

**Goals:**

- Reduce file size by removing duplicate CSS and empty style attributes
- Guarantee pixel-perfect visual fidelity via computed CSS verification
- Create a reproducible process that can be applied to similar HTML files

**Non-Goals:**

- Not optimizing CSS selectors or refactoring CSS architecture
- Not converting to external CSS files (keeping as standalone HTML)
- Not modifying HTML structure or content

## Decisions

### Decision 1: Use Chrome DevTools MCP for Computed CSS Capture

**Chosen:** Chrome DevTools MCP (`mcp__chrome-devtools__*`)

**Rationale:**

- Provides direct access to `getComputedStyle()` for every DOM element
- Can navigate to `file://` URLs for local HTML files
- Supports `take_screenshot` for visual verification
- Can execute scripts via `evaluate_script` to batch-capture all computed styles

**Alternatives considered:**

- **Playwright MCP**: Similar capabilities but Chrome DevTools MCP is more direct for local file access
- **Manual parsing**: Cannot accurately compute final CSS values due to cascade/specificity complexity

### Decision 2: Two-Phase Approach (Capture → Transform → Verify)

**Phase 1: Capture Baseline**

1. Open HTML file in Chrome via `chrome-devtools navigate_page`
2. Execute script to capture computed styles for all elements:
   ```javascript
   // Store: { selector: computedStyles } for each element
   // Use unique selector generation (e.g., css-path)
   ```
3. Take baseline screenshot
4. Save baseline to JSON file

**Phase 2: Transform CSS**

1. Parse HTML and identify duplicate `<style>` blocks
2. Deduplicate CSS rules (keep first occurrence, remove duplicates)
3. Remove empty `style=""` attributes
4. Write reduced HTML

**Phase 3: Verify**

1. Open reduced HTML in Chrome
2. Capture computed styles for all elements
3. Compare with baseline (must be 100% match)
4. Take screenshot and compare pixel-by-pixel

### Decision 3: Element Identification Strategy

**Chosen:** Generate unique CSS selectors using a combination of:

- `id` attribute if present
- `data-ref` attribute if present (AG Grid uses these)
- Path-based selector: `tag:nth-child(n)` fallback

**Rationale:** Elements may not have stable IDs, but we need reliable matching between original and reduced HTML.

### Decision 4: CSS Deduplication Algorithm

1. **Normalize CSS rules**: Parse each `<style>` block, normalize whitespace
2. **Hash-based deduplication**: Create hash of each rule, track seen hashes
3. **Preserve order**: First occurrence wins, maintain original cascade order
4. **Handle `@keyframes` separately**: Named animations must be deduplicated by name
5. **Preserve CSS variables**: Never remove `--custom-property` definitions

## Risks / Trade-offs

| Risk                                                                 | Mitigation                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------- |
| Performance: Capturing computed styles for ~10K DOM elements is slow | Batch process using `evaluate_script`, store in memory      |
| Memory: Large JSON baseline file                                     | Stream to disk incrementally, use efficient data structures |
| CSS specificity changes after deduplication                          | Never reorder rules; only remove exact duplicates           |
| Dynamic content (iframes, shadow DOM)                                | Handle only light DOM initially; document limitations       |

## Migration Plan

1. **Backup**: Create `cashflow-blotter.original.html` before any changes
2. **Run tool**: Execute the CSS reduction pipeline
3. **Verify**: Automated comparison of computed styles
4. **Manual review**: Visual inspection of screenshot diff
5. **Replace**: If verification passes, use reduced file

**Rollback:** If any verification fails, restore from backup file.

## Open Questions

1. **How to handle pseudo-elements?** (`::before`, `::after`) - These have computed styles too but may not be easily queryable.
   - _Resolution: Use `getComputedStyle(el, '::before')` in capture script_

2. **What about hidden/offscreen elements?** They may have different computed styles if lazy-loaded.
   - _Resolution: Capture all elements regardless of visibility state_

3. **Should we preserve all `<style>` tag attributes?** (e.g., `type="text/css"`)
   - _Resolution: Yes, preserve all attributes, only modify content_
