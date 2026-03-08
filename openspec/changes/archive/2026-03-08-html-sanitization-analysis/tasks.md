# Implementation Tasks: HTML Sanitization and Analysis

## 1. Setup

- [x] 1.1 Create scripts directory in `packages/ratan-design/scripts/`
- [x] 1.2 Add Cheerio and TypeScript dependencies to `packages/ratan-design/package.json`
- [x] 1.3 Create input/output directory structure for processing artifacts

## 2. Sanitization Script Implementation

- [x] 2.1 Create `sanitize-html.ts` script with CLI argument parsing
- [x] 2.2 Implement Cheerio-based HTML parser and loader
- [x] 2.3 Implement `<script>`, `<noscript>`, `<iframe>` element removal
- [x] 2.4 Implement SVG replacement with `<i data-icon-placeholder="true">` placeholder
- [x] 2.5 Implement Base64 image source replacement with `BASE64_DATA` placeholder
- [x] 2.6 Implement inline `style` attribute removal while preserving `class` attributes
- [x] 2.7 Implement HTML comment stripping
- [x] 2.8 Implement CSS class extraction and categorization (ant-_, Mui_, custom)
- [x] 2.9 Output `clean_structure.html` with size reduction validation
- [x] 2.10 Output `styles_audit.txt` with grouped class list

## 3. Sanitization Testing and Validation

- [x] 3.1 Run sanitization against `cashflowblotter-light.html`
- [x] 3.2 Verify file size reduction meets 60-80% target
- [x] 3.3 Validate all AntD and MUI classes are preserved
- [x] 3.4 Verify placeholder elements mark removed content correctly

## 4. Semantic Mapping Pipeline

- [x] 4.1 Create section extraction logic (header, sidebar, main content)
- [x] 4.2 Implement DOM pattern detection for table rows
- [x] 4.3 Implement DOM pattern detection for card/list item structures
- [x] 4.4 Create component abstraction with custom tag generation
- [x] 4.5 Generate `component_manifest.md` with component names and roles
- [x] 4.6 Generate `structural_map.html` with simplified HTML/XML structure

## 5. Layout Analysis Implementation

- [x] 5.1 Implement AntD grid system detection (ant-row, ant-col-\*)
- [x] 5.2 Implement MUI Grid detection (MuiGrid-\*)
- [x] 5.3 Extract and document responsive breakpoints
- [x] 5.4 Implement typography hierarchy extraction (MuiTypography-h1 through h6)
- [x] 5.5 Implement spacing pattern analysis (MuiBox-root, AntD spacing)
- [x] 5.6 Generate `layout_intent.md` technical summary document

## 6. Documentation and Finalization

- [x] 6.1 Create README for the sanitization pipeline
- [x] 6.2 Document CLI usage and options
- [x] 6.3 Add example outputs to documentation
- [x] 6.4 Create migration guidance section with class translation table
