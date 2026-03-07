# CSS Cleanup Utility

A utility to remove unused CSS from HTML files by analyzing which selectors match elements in the DOM.

## Installation

The utility is part of the `ratan-design` package. It uses `css-tree` and `cheerio` for parsing.

## Usage

### Programmatic API

```typescript
import { cleanUnusedCss } from 'ratan-design';

const result = cleanUnusedCss({ html: inputHtml });

console.log(result.html); // Cleaned HTML
console.log(result.stats); // Statistics
```

#### API

```typescript
interface CleanUnusedCssOptions {
  html: string; // The HTML string to process
  preserveVariables?: boolean; // Preserve :root CSS variables (default: true)
  preserveKeyframes?: boolean; // Preserve @keyframes rules (default: true)
  preserveMediaQueries?: boolean; // Preserve @media queries (default: true)
}

interface CleanUnusedCssResult {
  html: string; // The cleaned HTML string
  stats: {
    originalRules: number; // Total rules before cleanup
    keptRules: number; // Rules kept after cleanup
    removedRules: number; // Rules removed
    originalSize: number; // Original HTML size in bytes
    newSize: number; // Cleaned HTML size in bytes
  };
}
```

### CLI

```bash
# Basic usage
npx tsx css-cleanup-cli.ts input.html

# Specify output file
npx tsx css-cleanup-cli.ts -o output.html input.html

# Show help
npx tsx css-cleanup-cli.ts --help
```

## How It Works

1. **DOM Signature Extraction**: Parses the HTML and extracts all element tags, class names, IDs, and attributes.

2. **Selector Matching**: For each CSS rule, checks if any selector in the rule could match an element in the DOM signature.

3. **Conservative Approach**: When uncertain (complex pseudo-classes like `:not()`, `:has()`), the rule is kept to avoid removing needed styles.

## What's Preserved

The following CSS constructs are always preserved:

- `@keyframes` rules (may be referenced by animation-name)
- `:root` CSS variables (may be referenced anywhere)
- `@font-face` rules (font-family may be used)
- `@media` queries (inner rules are filtered)
- Pseudo-element rules (`::before`, `::after`)

## Performance

On a 2.2MB HTML file with ~5,000 CSS rules:

- Processing time: ~400ms
- Size reduction: ~48%
- Rules reduction: ~37%

## Limitations

- **Static HTML only**: The utility analyzes the HTML as-is. CSS classes added dynamically via JavaScript won't be detected.
- **Conservative matching**: Some unused rules may be kept to avoid false negatives.
- **No cross-file analysis**: Only CSS within `<style>` tags in the same HTML file is processed.
