## Why

The `cashflowblotter-light.html` file is 56,900 lines with 108 `<style>` tags containing CSS from frameworks like Ant Design and MUI. Approximately 43,000+ lines are CSS in the head, while only ~1,600 DOM elements exist in the body. This results in a massive file (2.2MB) where most CSS rules never apply to any elements, causing slow loading, parsing overhead, and difficult maintenance. A cleanup function would extract only the CSS rules that match elements in the DOM, dramatically reducing file size.

## What Changes

- Add a new utility function to analyze HTML and remove unused CSS selectors
- The function will:
  - Parse HTML to extract all CSS rules from `<style>` tags
  - Parse the DOM to identify all elements, classes, IDs, and attributes
  - Match CSS selectors against actual DOM elements
  - Remove CSS rules whose selectors don't match any element
  - Output cleaned HTML with only applied CSS

## Capabilities

### New Capabilities

- `css-cleanup`: A function/tool that removes unused CSS from HTML files by analyzing which CSS selectors actually match elements in the DOM

### Modified Capabilities

None - this is a new standalone utility.

## Impact

- **New code**: `packages/ratan-design/src/css-cleanup/` - utility function and tests
- **Input**: HTML files with embedded CSS (like `cashflowblotter-light.html`)
- **Output**: Cleaned HTML with only CSS that applies to actual DOM elements
- **Dependencies**: Will need a CSS parser (e.g., `css-tree` or `postcss`) and an HTML parser (e.g., `jsdom` or `cheerio`)
- **No breaking changes**: This is a new utility, existing code is unaffected
