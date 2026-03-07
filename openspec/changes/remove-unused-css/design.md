## Context

The `cashflowblotter-light.html` file is a static snapshot of a React-based micro-frontend application using Ant Design and MUI component libraries. The file contains:

- **56,900 total lines** (~2.2MB)
- **108 `<style>` tags** with ~43,000 lines of CSS
- **~1,600 DOM elements** in the body
- **Estimated unused CSS**: 80-90% of selectors don't match any element

This is a static HTML export - no dynamic class injection occurs. The CSS bloat comes from framework stylesheets that were inlined wholesale.

## Goals / Non-Goals

**Goals:**

- Remove CSS rules whose selectors don't match any element in the DOM
- Preserve CSS rules that match at least one element
- Maintain valid CSS syntax and structure in the output
- Handle complex selectors (descendant combinators, attribute selectors, `:where()`, `:not()`)
- Process large files efficiently (target: <30 seconds for 2.2MB file)
- Provide CLI and programmatic API

**Non-Goals:**

- Dynamic CSS analysis (JS-injected classes) - file is static
- CSS minification or optimization (separate concern)
- Cross-file CSS deduplication
- CSS variable analysis (keep all `:root` variables as they may be referenced)
- Handling pseudo-element content (::before, ::after that creates elements)

## Decisions

### 1. Parser Selection

**Decision:** Use `css-tree` for CSS parsing and `cheerio` for HTML parsing.

**Rationale:**
| Option | Pros | Cons |
|--------|------|------|
| `css-tree` | Lightweight (30KB), accurate AST, fast | No built-in selector matching |
| `postcss` | Large ecosystem, plugins available | Heavier (300KB+), slower for our use case |
| `cheerio` | Fast, jQuery-like API, lightweight | No full DOM rendering (doesn't matter for static HTML) |
| `jsdom` | Full DOM implementation | 2MB+ dependency, slower for large documents |

**Why this combo:** `css-tree` gives us a clean AST to traverse CSS rules. `cheerio` efficiently extracts all element selectors, classes, IDs, and attributes from HTML without the overhead of a full browser environment.

### 2. Selector Matching Strategy

**Decision:** Use a two-phase approach - extract DOM signature, then match selectors.

**Approach:**

1. **Phase 1 - DOM Signature Extraction:**
   - Parse HTML with cheerio
   - Extract all: element tags, class names, IDs, attributes (name only), attribute pairs
   - Store in Sets for O(1) lookup

2. **Phase 2 - Selector Analysis:**
   - Parse CSS with css-tree
   - For each rule, split on `,` to get selector list
   - For each selector, check if it _could_ match the DOM signature
   - Keep rule if any selector matches

**Selector matching logic:**

```
For selector ".ant-btn-primary":
  → Check if "ant-btn-primary" exists in classSet → KEEP

For selector ".ant-message-notice .anticon":
  → Check if "ant-message-notice" AND "anticon" exist in classSet
  → If both exist, descendant combinator could match → KEEP

For selector "[disabled]":
  → Check if "disabled" exists in attributeSet → KEEP
```

**Rationale:** Full CSS selector matching against a live DOM is complex. For static HTML, we can use conservative heuristics: if a selector's components (classes, IDs, tags, attributes) exist in the DOM, keep it. This may keep some unused rules (false positives) but won't remove needed rules (false negatives).

### 3. Architecture

**Decision:** Single function with clear separation of concerns.

```
packages/ratan-design/src/css-cleanup/
├── index.ts           # Main entry point, exports cleanUnusedCss()
├── dom-signature.ts   # Extract element data from HTML
├── selector-match.ts  # Check if selector matches DOM signature
├── css-process.ts     # Parse CSS, filter rules, regenerate
└── cleanUnusedCss.test.ts
```

**API:**

```typescript
interface CleanUnusedCssOptions {
  html: string;
  preserveVariables?: boolean; // Default: true
  preserveKeyframes?: boolean; // Default: true
  preserveMediaQueries?: boolean; // Default: true
}

interface CleanUnusedCssResult {
  html: string; // Cleaned HTML
  stats: {
    originalRules: number;
    keptRules: number;
    removedRules: number;
    originalSize: number;
    newSize: number;
  };
}

function cleanUnusedCss(options: CleanUnusedCssOptions): CleanUnusedCssResult;
```

### 4. Conservative Matching

**Decision:** When uncertain, keep the rule.

**Rules that are ALWAYS kept:**

- `@keyframes` rules (may be referenced by animation-name)
- `:root` CSS variables (may be referenced anywhere)
- `@media` queries (evaluate contents, but keep container)
- `@font-face` rules (font-family may be used)
- Rules with pseudo-elements `::before`, `::after` (create elements)

**Rules that are REMOVED:**

- Class selectors where no matching class exists in DOM
- ID selectors where no matching ID exists in DOM
- Element selectors where no matching tag exists in DOM
- Attribute selectors where attribute doesn't exist in DOM

## Risks / Trade-offs

| Risk                                                            | Mitigation                                                           |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Removing CSS that appears unused but is dynamically applied     | File is static snapshot - no dynamic classes. Document assumption.   |
| Complex selectors (`:not()`, `:has()`) may have false positives | Use conservative matching - keep if uncertain                        |
| Performance on very large CSS (>100K rules)                     | Process style tags in parallel, use efficient data structures (Sets) |
| Pseudo-element content creates elements we can't see            | Always keep rules with `::before`, `::after`                         |
| CSS variables referenced in JS won't be detected                | Keep all `:root` variables by default                                |

**Trade-off:** We accept some false positives (keeping unused rules) to avoid false negatives (removing needed rules). The goal is significant reduction (80-90%), not 100% precision.

## Migration Plan

1. **Phase 1:** Implement core function with test coverage
2. **Phase 2:** Run against `cashflowblotter-light.html` and verify output renders correctly
3. **Phase 3:** Add CLI wrapper for easy invocation
4. **Rollback:** Original file is preserved; output goes to new file by default

## Open Questions

None at this time. The approach is straightforward for static HTML analysis.
