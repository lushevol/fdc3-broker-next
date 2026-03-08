# Proposal: Extract CSS from HTML

## Why

A 1.8MB HTML file (40,474 lines) contains ~50+ embedded `<style>` blocks and 1,767 inline style attributes, making it impossible to maintain, reuse, or optimize the CSS. The file was exported from a running React website for preview purposes but needs to be refactored into a maintainable structure with external CSS files.

The current structure:

- Blocks rapid page rendering (CSS must be parsed before DOM)
- Prevents CSS caching (all styles re-downloaded with HTML)
- Makes style maintenance impossible (no separation of concerns)
- Prevents reuse of design tokens and components across projects

## What Changes

- Extract all `<style>` block contents into categorized CSS files
- Replace embedded styles with `<link>` tags to external CSS files
- Organize CSS by design system layers (tokens → components → blocks)
- Preserve exact visual rendering of the original HTML

### CSS Categories Identified

Based on analysis of `cashflowblotter-light.html`:

| Category              | Examples                                               | Estimated Scope |
| --------------------- | ------------------------------------------------------ | --------------- |
| **Tokens**            | Colors, fonts, animations, CSS variables               | ~500 lines      |
| **Ant Design**        | `.ant-picker`, `.ant-select`, `.ant-input`, `.ant-btn` | ~15,000 lines   |
| **MUI**               | `.MuiButton`, `.MuiSwitch`, `.MuiTabs`, `.MuiAppBar`   | ~8,000 lines    |
| **Custom Components** | `.MicroWebUI_Base_*`, utility classes                  | ~2,000 lines    |
| **Font Definitions**  | `@font-face` rules                                     | ~200 lines      |

## Capabilities

### New Capabilities

- `css-extraction-tooling`: Script/tool to parse HTML, extract `<style>` blocks, categorize CSS rules, and generate linked CSS files
- `design-tokens`: Extracted CSS variables and base styles (colors, typography, spacing, animations)
- `component-styles`: Extracted styles for UI components (Ant Design, MUI, custom)
- `clean-html-output`: HTML file with all CSS removed and replaced with `<link>` tags

### Modified Capabilities

None - this is a new extraction capability.

## Impact

### Files Created

```
packages/ratan-design/
├── original-websites/
│   └── cashflowblotter-light.html     # Original (preserved)
└── extracted/
    └── cashflowblotter-light/
        ├── index.html                  # Clean HTML with <link> tags
        ├── css/
        │   ├── tokens.css              # Design tokens, variables, base
        │   ├── fonts.css               # @font-face definitions
        │   ├── antd.css                # Ant Design component styles
        │   ├── mui.css                 # MUI component styles
        │   ├── components.css          # Custom component styles
        │   └── utilities.css           # Utility classes
        └── assets/                     # Any referenced assets
```

### Technical Decisions Needed

1. **Extraction method**: Node.js script vs manual extraction
2. **CSS organization**: Single file vs layered files vs component-specific files
3. **Inline style handling**: Extract to CSS classes vs preserve inline for dynamic values
4. **CSS deduplication**: Remove duplicate rules across style blocks

### Dependencies

- Node.js for extraction script
- CSS parser (e.g., `css` npm package) for rule analysis
- No runtime dependencies - output is static HTML/CSS
