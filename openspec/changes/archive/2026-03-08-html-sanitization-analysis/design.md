# Design: HTML Sanitization and Analysis

## Context

A 1.9MB static HTML file exported from a React application using Ant Design (AntD) and Material UI (MUI) needs to be analyzed for a design system migration. The file contains:

- Heavy inline SVG icons and graphics
- Base64-encoded images embedded in `src` attributes
- Redundant `<script>` tags from bundle exports
- Deeply nested DOM structures ("div-soup")

The goal is to create a pipeline that sanitizes the HTML, maps semantic components, and extracts layout intent for future design system decisions.

### Constraints

- Input file: `packages/ratan-design/original-websites/cashflowblotter-light.html`
- Must preserve AntD (`ant-*`) and MUI (`Mui*`) class names for layout analysis
- Output files must be human-readable and machine-parseable
- Target 60-80% file size reduction in sanitization step

## Goals / Non-Goals

**Goals:**

- Reduce HTML file size by 60-80% through sanitization
- Preserve semantic class structure for component identification
- Generate component manifest for design system migration planning
- Extract layout grid, typography, and spacing patterns

**Non-Goals:**

- Automated code generation from HTML (manual adaptation required)
- Full design system implementation (analysis only)
- Browser-specific CSS normalization
- JavaScript behavior extraction

## Decisions

### D1: Node.js with Cheerio over Python with BeautifulSoup

**Decision**: Use Node.js with Cheerio for the sanitization script.

**Rationale**:

- Better integration with existing npm-based monorepo tooling
- Cheerio provides jQuery-like API familiar to frontend developers
- Native TypeScript support for type safety
- Faster execution for large HTML files

**Alternatives considered**:

- Python BeautifulSoup: More mature HTML parsing, but adds Python dependency to Node.js monorepo
- jsdom: Full DOM implementation, but heavier weight and slower

### D2: Three-Stage Pipeline Architecture

**Decision**: Implement as sequential stages: Sanitization → Semantic Mapping → Layout Extraction.

**Rationale**:

- Each stage produces an artifact usable independently
- Size reduction in stage 1 makes stage 2 feasible for AI processing
- Clear separation of concerns enables parallel development
- Artifacts can be versioned and reviewed separately

**Stage Details**:

| Stage                | Input                        | Output                                         | Tool            |
| -------------------- | ---------------------------- | ---------------------------------------------- | --------------- |
| 1. Sanitization      | `cashflowblotter-light.html` | `clean_structure.html`, `styles_audit.txt`     | Node.js/Cheerio |
| 2. Semantic Mapping  | `clean_structure.html`       | `component_manifest.md`, `structural_map.html` | AI-assisted     |
| 3. Layout Extraction | `structural_map.html`        | `layout_intent.md`                             | AI-assisted     |

### D3: Placeholder Strategy for Non-Text Content

**Decision**: Use semantic placeholders for SVG and Base64 content.

**Rationale**:

- Preserves document structure for layout analysis
- Markers enable future rehydration if needed
- Reduces noise for AI pattern recognition

**Placeholder format**:

- SVG: `<i data-icon-placeholder="true" data-original-tag="svg"></i>`
- Base64 images: `src="BASE64_DATA"` (keep `<img>` tag)

### D4: Class Preservation Strategy

**Decision**: Preserve all classes matching patterns `ant-*`, `Mui*`, and custom classes; remove inline styles.

**Rationale**:

- AntD/MUI classes encode layout intent (e.g., `ant-col-6`, `MuiTypography-h6`)
- Inline styles are often dynamically generated and less reliable for analysis
- Class names are the foundation for component identification

## Risks / Trade-offs

### R1: Information Loss in Sanitization

- **Risk**: Removing SVGs and Base64 images loses icon/image context
- **Mitigation**: Placeholder elements mark where content was removed; original file retained for reference

### R2: Dynamic Class Names

- **Risk**: CSS-in-JS libraries generate hash-based class names that change between builds
- **Mitigation**: Focus analysis on stable AntD/MUI class prefixes; document dynamic classes as "unstable"

### R3: Large File for AI Processing

- **Risk**: Even after 80% reduction, ~400KB HTML may exceed some AI context windows
- **Mitigation**: Stage 2 can process document sections (header, sidebar, main content) separately

### R4: Manual Interpretation Required

- **Risk**: Component manifest requires human judgment for final design decisions
- **Mitigation**: Provide clear documentation and examples; flag ambiguous patterns for review

## Migration Plan

### Phase 1: Sanitization Script Development

1. Create `scripts/sanitize-html.ts` in the ratan-design package
2. Implement Cheerio-based transformation pipeline
3. Test against `cashflowblotter-light.html`
4. Validate output size reduction target

### Phase 2: Semantic Mapping

1. Process `clean_structure.html` section by section
2. Identify repeated DOM patterns programmatically where possible
3. Generate component manifest with AI assistance
4. Review and refine structural map

### Phase 3: Layout Extraction

1. Parse structural map for grid patterns
2. Document typography hierarchy from MUI classes
3. Identify spacing rhythm patterns
4. Generate `layout_intent.md` summary

### Rollback Strategy

- Original HTML file is never modified
- Each stage produces new files; previous stage outputs are preserved
- Can restart from any stage by re-running that step

## Open Questions

1. **Section boundaries**: Should semantic mapping define custom section boundaries (header/sidebar/main) or use semantic HTML landmarks?
2. **Component naming convention**: Should abstracted components follow AntD naming (e.g., `AntdTable`) or functional naming (e.g., `DataTable`)?
3. **Output format**: Should `component_manifest.md` be structured as YAML frontmatter for machine parsing?
