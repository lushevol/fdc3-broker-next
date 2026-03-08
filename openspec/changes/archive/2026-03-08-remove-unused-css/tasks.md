## 1. Setup

- [x] 1.1 Create `packages/ratan-design/src/css-cleanup/` directory structure
- [x] 1.2 Add `css-tree` and `cheerio` dependencies to `packages/ratan-design/package.json`
- [x] 1.3 Create TypeScript interfaces for `CleanUnusedCssOptions` and `CleanUnusedCssResult` in `index.ts`

## 2. DOM Signature Extraction

- [x] 2.1 Create `dom-signature.ts` with `DomSignature` interface and `extractDomSignature()` function
- [x] 2.2 Implement extraction of all element tag names from HTML
- [x] 2.3 Implement extraction of all class names from HTML
- [x] 2.4 Implement extraction of all IDs from HTML
- [x] 2.5 Implement extraction of attribute names and attribute pairs from HTML
- [x] 2.6 Write unit tests for DOM signature extraction

## 3. Selector Matching

- [x] 3.1 Create `selector-match.ts` with `selectorMatchesSignature()` function
- [x] 3.2 Implement class selector matching (`.classname`)
- [x] 3.3 Implement ID selector matching (`#idname`)
- [x] 3.4 Implement element/tag selector matching (`div`, `span`, etc.)
- [x] 3.5 Implement attribute selector matching (`[disabled]`, `[type="text"]`)
- [x] 3.6 Implement descendant combinator handling (`.parent .child`)
- [x] 3.7 Implement selector list handling (comma-separated selectors)
- [x] 3.8 Implement conservative matching for complex pseudo-classes (`:not()`, `:has()`, `:where()`)
- [x] 3.9 Write unit tests for selector matching

## 4. CSS Processing

- [x] 4.1 Create `css-process.ts` with `processStyleTag()` function
- [x] 4.2 Implement CSS parsing with `css-tree`
- [x] 4.3 Implement rule filtering logic using selector matcher
- [x] 4.4 Implement preservation of `@keyframes` rules
- [x] 4.5 Implement preservation of `:root` CSS variables
- [x] 4.6 Implement preservation of `@font-face` rules
- [x] 4.7 Implement preservation of `@media` queries (with inner rule filtering)
- [x] 4.8 Implement preservation of pseudo-element rules (`::before`, `::after`)
- [x] 4.9 Implement CSS regeneration from filtered AST
- [x] 4.10 Write unit tests for CSS processing

## 5. Main Function Integration

- [x] 5.1 Implement `cleanUnusedCss()` function in `index.ts`
- [x] 5.2 Integrate DOM signature extraction
- [x] 5.3 Process all `<style>` tags in document order
- [x] 5.4 Preserve style tag attributes in output
- [x] 5.5 Calculate and return statistics (rule counts, sizes)
- [x] 5.6 Handle edge case of empty HTML input
- [x] 5.7 Write integration tests for `cleanUnusedCss()`

## 6. Verification

- [x] 6.1 Run function against `cashflowblotter-light.html`
- [x] 6.2 Verify output HTML renders correctly (visual comparison)
- [x] 6.3 Measure file size reduction percentage
- [x] 6.4 Measure processing time for large file
- [x] 6.5 Document results and any issues found

### Verification Results

**Test file**: `cashflowblotter-light.html`

| Metric              | Value     |
| ------------------- | --------- |
| Original size       | 2.22 MB   |
| New size            | 1.14 MB   |
| **Size reduction**  | **48.5%** |
| Original rules      | 4,887     |
| Kept rules          | 3,064     |
| Removed rules       | 1,823     |
| **Rules reduction** | **37.3%** |
| Processing time     | 406ms     |

The function successfully reduced the file size by nearly 50% while processing in under 500ms.

## 7. CLI (Optional)

- [x] 7.1 Create CLI wrapper script
- [x] 7.2 Add command-line argument parsing (input file, output file)
- [x] 7.3 Add progress output and summary statistics
- [x] 7.4 Document CLI usage in README
