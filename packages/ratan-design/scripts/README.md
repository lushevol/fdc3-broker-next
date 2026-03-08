# HTML Sanitization and Analysis Pipeline

A pipeline for analyzing and extracting design information from large HTML exports (React apps using Ant Design and Material UI).

## Overview

This pipeline reduces large HTML files (~2MB) by removing bloat and extracting structural/layout information for design system migration.

## Quick Start

```bash
# Navigate to the ratan-design package
cd packages/ratan-design

# Step 1: Sanitize HTML
npx tsx scripts/sanitize-html.ts ./original-websites/cashflowblotter-light.html

# Step 2: Semantic Mapping
npx tsx scripts/semantic-mapping.ts ./sanitization-output/cashflowblotter-light-cleaned.html

# Step 3: Layout Analysis
npx tsx scripts/layout-analysis.ts ./sanitization-output/cashflowblotter-light-cleaned.html
```

## Scripts

### 1. `sanitize-html.ts`

Reduces HTML file size by removing unnecessary content.

**Usage:**

```bash
npx tsx scripts/sanitize-html.ts <input-file> [options]
```

**Options:**

- `--output-dir <dir>` - Output directory (default: `./sanitization-output`)
- `--no-stats` - Skip statistics output

**What it does:**

- Removes `<script>`, `<noscript>`, and `<iframe>` tags
- Replaces SVG trees with `<i data-icon-placeholder="true">` placeholders
- Replaces Base64 image sources with `BASE64_DATA` placeholder
- Removes inline `style` attributes while preserving `class` attributes
- Strips HTML comments
- Extracts and categorizes CSS classes

**Outputs:**

- `*-cleaned.html` - Sanitized HTML file
- `styles_audit.txt` - List of unique CSS classes grouped by framework
- `sanitization-stats.json` - Statistics about the sanitization process

### 2. `semantic-mapping.ts`

Identifies repeated DOM patterns and generates component definitions.

**Usage:**

```bash
npx tsx scripts/semantic-mapping.ts <input-file> [options]
```

**What it does:**

- Extracts sections (header, sidebar, main content)
- Identifies repeated DOM patterns (buttons, inputs, grid rows, etc.)
- Maps custom application components (MicroWebUI\_\*)
- Generates simplified structural representation

**Outputs:**

- `component_manifest.md` - List of identified components with roles
- `structural_map.html` - Simplified HTML/XML structure

### 3. `layout-analysis.ts`

Extracts layout intent from the HTML structure.

**Usage:**

```bash
npx tsx scripts/layout-analysis.ts <input-file> [options]
```

**What it does:**

- Detects grid system (AntD 24-column or MUI 12-column)
- Extracts typography hierarchy
- Identifies spacing patterns
- Provides migration guidance

**Outputs:**

- `layout_intent.md` - Technical summary of layout logic

## Output Directory Structure

```
sanitization-output/
├── cashflowblotter-light-cleaned.html  # Sanitized HTML
├── styles_audit.txt                     # CSS class audit
├── sanitization-stats.json              # Sanitization statistics
├── component_manifest.md                # Component definitions
├── structural_map.html                  # Simplified structure
└── layout_intent.md                     # Layout analysis
```

## Example Results

For `cashflowblotter-light.html` (1.83 MB):

| Metric                   | Value   |
| ------------------------ | ------- |
| Original size            | 1.83 MB |
| Sanitized size           | 1.23 MB |
| Reduction                | 32.7%   |
| SVGs replaced            | 39      |
| Base64 images            | 1       |
| Style attributes removed | 1,685   |
| Comments removed         | 70      |

### Classes Found

| Category       | Count |
| -------------- | ----- |
| AntD classes   | 43    |
| MUI classes    | 142   |
| Custom classes | 373   |

### Components Identified

- **GridRow** - 57 occurrences (AG Grid data rows)
- **GridHeaderCell** - 20 occurrences
- **MuiButton** - 16 occurrences
- **MuiInput** - 10 occurrences
- **AntdInput** - 10 occurrences
- Custom components: Cashflow, App, QuickSearch, GridFooter, etc.

## Design Decisions

### Why Node.js/Cheerio?

- Native TypeScript support
- jQuery-like API familiar to frontend developers
- Better integration with npm-based monorepo

### Why Three Stages?

1. **Sanitization** reduces file size for AI processing
2. **Semantic Mapping** identifies reusable patterns
3. **Layout Analysis** captures design intent

Each stage produces artifacts that can be used independently.

## Class Translation Table

### AntD to Target Design System

| Source Class | Target                                     |
| ------------ | ------------------------------------------ |
| `ant-row`    | `<Row>` or `<div class="flex">`            |
| `ant-col-*`  | `<Col span={*}>` or `<div class="w-*/24">` |
| `ant-btn`    | `<Button>`                                 |
| `ant-input`  | `<Input>`                                  |
| `ant-select` | `<Select>`                                 |
| `ant-picker` | `<DatePicker>`                             |

### MUI to Target Design System

| Source Class        | Target                                      |
| ------------------- | ------------------------------------------- |
| `MuiGrid-container` | `<Grid container>` or `<div class="grid">`  |
| `MuiGrid-item`      | `<Grid item>` or `<div class="col-span-*">` |
| `MuiButton-root`    | `<Button>`                                  |
| `MuiTypography-*`   | `<Typography variant="*">`                  |
| `MuiBox-root`       | `<Box>` or `<div>` with Tailwind            |
| `MuiTextField-root` | `<TextField>`                               |

## Migration Guidance

1. **Grid System**: MUI 12-column grid detected. Map to CSS Grid or Tailwind grid classes.
2. **Typography**: Standard MUI typography hierarchy (body1, caption, etc.).
3. **Spacing**: 8px base unit used throughout. Map to Tailwind spacing scale.

## Limitations

- Inline CSS in `<style>` tags is not removed (contains framework styles)
- Dynamic CSS-in-JS classes (css-\*) are not automatically mapped
- Component abstraction requires human review for accuracy

## Future Enhancements

- [ ] Remove inline `<style>` tags for further size reduction
- [ ] Generate component code skeletons from patterns
- [ ] Auto-generate Tailwind config from extracted values
- [ ] Support for additional UI frameworks (Chakra, Radix)
