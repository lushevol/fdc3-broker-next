## Why

The `cashflow-blotter.html` file (1.2MB, 10,484 lines) suffers from severe CSS bloat that impacts maintainability, load performance, and code clarity. The file contains 108 `<style>` blocks with significant duplication, 434 inline `style` attributes (many empty), and repeated CSS rules that inflate file size unnecessarily.

## What Changes

- **Remove duplicate `<style>` blocks**: Consolidate identical CSS rules that appear in multiple style blocks
- **Remove empty `style=""` attributes**: Clean up 434 inline style attributes, many of which are empty
- **Deduplicate CSS rules**: Remove repeated identical CSS selectors and declarations
- **Preserve CSS specificity**: Maintain exact rule ordering to ensure computed styles remain identical
- **Keep pixel-perfect fidelity**: Every DOM element must retain identical computed CSS values after reduction

## Capabilities

### New Capabilities

- `css-deduplication`: Capability to identify and remove duplicate CSS rules while preserving computed styles
- `inline-style-cleanup`: Capability to remove empty inline style attributes and consolidate redundant inline styles

### Modified Capabilities

(None - this is a new file transformation, no existing specs to modify)

## Impact

**Affected Files:**

- `cashflow-blotter.html` - Primary target for CSS reduction

**Expected Results:**

- Reduced file size (estimated 30-50% reduction from duplicate removal)
- Improved load performance
- Easier maintenance and debugging
- 100% visual fidelity maintained (pixel-perfect match)

**Constraints:**

- Must preserve all CSS custom properties (CSS variables)
- Must maintain CSS rule specificity order
- Must preserve all framework-specific prefixes (`:where(.css-1uh2e0d)`, Ant Design, AG Grid)
- Screenshot comparison must show 0 differences
