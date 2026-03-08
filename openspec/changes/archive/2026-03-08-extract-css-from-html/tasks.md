# Tasks: Extract CSS from HTML

## 1. Setup

- [x] 1.1 Create extraction script directory at `packages/ratan-design/scripts/`
- [x] 1.2 Create output directory structure at `packages/ratan-design/extracted/cashflowblotter-light/`

## 2. CSS Parser Module

- [x] 2.1 Create `extract-css.mjs` script entry point with CLI argument parsing
- [x] 2.2 Implement HTML file reading and validation
- [x] 2.3 Implement `<style type="text/css">` block extraction using regex
- [x] 2.4 Implement CSS rule parsing (split into individual rules while preserving media queries)
- [x] 2.5 Implement rule deduplication (track by selector + declarations hash)

## 3. CSS Categorization

- [x] 3.1 Implement Ant Design category matcher (`.ant-*`, `:where(.css-*)`)
- [x] 3.2 Implement MUI category matcher (`.Mui*`)
- [x] 3.3 Implement custom components matcher (`.MicroWebUI_*`)
- [x] 3.4 Implement font definitions extractor (`@font-face`)
- [x] 3.5 Implement tokens extractor (`:root`, `@keyframes`, `@charset`)
- [x] 3.6 Implement utilities catch-all category for uncategorized rules
- [x] 3.7 Add logging for uncategorized selectors (for review)

## 4. Output Generation

- [x] 4.1 Create `css/` output subdirectory
- [x] 4.2 Write `tokens.css` with CSS variables, keyframes, and base styles
- [x] 4.3 Write `fonts.css` with `@font-face` definitions
- [x] 4.4 Write `antd.css` with Ant Design component styles
- [x] 4.5 Write `mui.css` with MUI component styles
- [x] 4.6 Write `components.css` with custom MicroWebUI styles
- [x] 4.7 Write `utilities.css` with uncategorized styles
- [x] 4.8 Skip creating empty CSS files (and log which categories are empty)

## 5. HTML Generation

- [x] 5.1 Generate clean HTML with all `<style>` blocks removed
- [x] 5.2 Add `<link rel="stylesheet">` tags for each generated CSS file
- [x] 5.3 Ensure link tags are ordered by CSS layer (tokens → fonts → antd → mui → components → utilities)
- [x] 5.4 Preserve all inline `style=""` attributes unchanged
- [x] 5.5 Write output to `index.html`

## 6. CLI and Logging

- [x] 6.1 Implement CLI usage: `node extract-css.mjs <input.html> <output-dir>`
- [x] 6.2 Add error handling for missing/invalid input files
- [x] 6.3 Add extraction statistics output:
  - Total style blocks processed
  - Total CSS rules extracted
  - Rules per category
  - Duplicates removed
  - Output file sizes
- [x] 6.4 Exit with appropriate codes (0 for success, 1 for errors)

## 7. Verification

- [x] 7.1 Run extraction on `cashflowblotter-light.html`
- [x] 7.2 Compare file sizes (original vs extracted total)
- [x] 7.3 Open extracted `index.html` in browser
- [x] 7.4 Visually compare with original HTML to verify identical rendering
- [x] 7.5 Check browser DevTools for any 404s or CSS errors
- [x] 7.6 Document any issues found and fix as needed

## 8. Documentation (Optional)

- [x] 8.1 Add README to extracted output directory explaining the structure
- [x] 8.2 Add script usage comments at top of `extract-css.mjs`
