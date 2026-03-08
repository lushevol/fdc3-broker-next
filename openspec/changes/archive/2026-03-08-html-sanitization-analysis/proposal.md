# HTML Sanitization and Analysis

## Why

A 1.9MB static HTML file exported from a React app (using Ant Design and Material UI) contains heavy inline SVGs, Base64 images, and redundant script tags that make it impractical for AI-assisted analysis and design system migration. This change introduces a pipeline to sanitize, semantically map, and extract layout intent from complex legacy HTML exports.

## What Changes

- **Sanitization Script**: Create a Node.js/Python script to reduce HTML file size by 60-80% by:
  - Removing `<script>`, `<noscript>`, and `<iframe>` tags
  - Replacing `<svg>` trees with `<i data-icon-placeholder="true"></i>` placeholders
  - Replacing Base64 `src` attributes with `BASE64_DATA` placeholder
  - Removing inline `style` attributes while preserving `class` attributes (especially `ant-*` and `Mui-*`)
  - Stripping HTML comments
  - Outputting `clean_structure.html` and `styles_audit.txt` (unique CSS classes)

- **Semantic Mapping**: Generate a component manifest and structural map by:
  - Identifying repeated DOM patterns (table rows, list items, grid items)
  - Abstracting repetitions into custom tags (e.g., `<Component-ProductCard>`)
  - Preserving semantic AntD/MUI classes
  - Outputting a "Master Structural Map" in simplified HTML/XML

- **Layout Intent Extraction**: Create a technical summary capturing:
  - Grid system description (columns, breakpoints)
  - Typography hierarchy (H1-H6 from MUI classes)
  - Spacing rhythm (padding increments from MuiBox-root, etc.)

## Capabilities

### New Capabilities

- `html-sanitization`: Script and pipeline to clean large HTML exports by removing bloat (scripts, SVGs, Base64 images) while preserving semantic structure
- `component-mapping`: Tooling to identify and abstract repeated DOM patterns into reusable component definitions
- `layout-analysis`: Extract and document layout intent (grid, typography, spacing) from cleaned HTML structures

### Modified Capabilities

- (none)

## Impact

- **Target file**: `packages/ratan-design/original-websites/cashflowblotter-light.html`
- **Outputs**:
  - `clean_structure.html` - Sanitized HTML (~60-80% smaller)
  - `styles_audit.txt` - Unique CSS classes list
  - Component manifest document
  - Master Structural Map
  - Layout intent technical summary
- **Dependencies**: Node.js with Cheerio or Python with BeautifulSoup
- **Downstream use**: Artifacts will inform design system migration decisions
