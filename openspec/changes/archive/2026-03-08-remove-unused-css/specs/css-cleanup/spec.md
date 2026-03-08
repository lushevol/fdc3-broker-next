## ADDED Requirements

### Requirement: Function accepts HTML input and returns cleaned HTML

The `cleanUnusedCss` function SHALL accept an HTML string with embedded CSS and return a result object containing the cleaned HTML string and statistics about the cleanup operation.

#### Scenario: Basic function invocation

- **WHEN** `cleanUnusedCss({ html: inputHtml })` is called with valid HTML containing embedded `<style>` tags
- **THEN** the function returns an object with `html` (cleaned HTML string) and `stats` object containing rule counts and size information

#### Scenario: Empty HTML input

- **WHEN** `cleanUnusedCss({ html: "" })` is called with empty string
- **THEN** the function returns `{ html: "", stats: { originalRules: 0, keptRules: 0, removedRules: 0, originalSize: 0, newSize: 0 } }`

### Requirement: Extract DOM signature from HTML

The function SHALL parse the HTML document and extract a complete signature of all elements, including tag names, class names, IDs, and attributes.

#### Scenario: Extract all class names

- **WHEN** HTML contains elements with classes like `<div class="ant-btn primary">` and `<span class="MuiTypography-root">`
- **THEN** the DOM signature includes a Set containing "ant-btn", "primary", "MuiTypography-root"

#### Scenario: Extract all IDs

- **WHEN** HTML contains elements with IDs like `<div id="menu-appbar">` and `<input id="search-input">`
- **THEN** the DOM signature includes a Set containing "menu-appbar", "search-input"

#### Scenario: Extract all tag names

- **WHEN** HTML contains various elements like `<div>`, `<span>`, `<button>`, `<input>`, `<table>`
- **THEN** the DOM signature includes a Set containing "div", "span", "button", "input", "table"

#### Scenario: Extract all attributes

- **WHEN** HTML contains elements with attributes like `<input type="text" disabled>`, `<button aria-label="close">`
- **THEN** the DOM signature includes attribute names "type", "disabled", "aria-label" and attribute pairs "type=text", "aria-label=close"

### Requirement: Parse and filter CSS rules

The function SHALL parse all `<style>` tags in the HTML, analyze each CSS rule, and remove rules whose selectors do not match any element in the DOM signature.

#### Scenario: Remove unused class selector

- **WHEN** CSS contains `.unused-class { color: red; }` and no element in the DOM has class "unused-class"
- **THEN** the rule is removed from the output

#### Scenario: Keep used class selector

- **WHEN** CSS contains `.ant-btn { padding: 8px; }` and at least one element in the DOM has class "ant-btn"
- **THEN** the rule is preserved in the output

#### Scenario: Handle descendant combinators

- **WHEN** CSS contains `.ant-message-notice .anticon { display: inline-block; }` and both classes "ant-message-notice" and "anticon" exist in the DOM
- **THEN** the rule is preserved (conservative match - could match)

#### Scenario: Handle ID selectors

- **WHEN** CSS contains `#menu-appbar { display: none; }` and an element with id="menu-appbar" exists in the DOM
- **THEN** the rule is preserved

#### Scenario: Handle attribute selectors

- **WHEN** CSS contains `[disabled] { opacity: 0.5; }` and at least one element in the DOM has the "disabled" attribute
- **THEN** the rule is preserved

### Requirement: Preserve critical CSS constructs

The function SHALL preserve CSS constructs that are essential or cannot be reliably analyzed, even if they appear unused.

#### Scenario: Preserve @keyframes rules

- **WHEN** CSS contains `@keyframes loadingCircle { ... }` even if no element references "loadingCircle" in animation-name
- **THEN** the @keyframes rule is preserved (may be referenced dynamically)

#### Scenario: Preserve :root CSS variables

- **WHEN** CSS contains `:root { --primary-color: #1890ff; }`
- **THEN** the rule is preserved (variables may be referenced anywhere)

#### Scenario: Preserve @font-face rules

- **WHEN** CSS contains `@font-face { font-family: 'Poppins'; ... }`
- **THEN** the rule is preserved (font-family may be used)

#### Scenario: Preserve @media queries

- **WHEN** CSS contains `@media (max-width: 768px) { .container { width: 100%; } }`
- **THEN** the @media rule is preserved (evaluate inner rules but keep container)

#### Scenario: Preserve pseudo-elements

- **WHEN** CSS contains `.icon::before { content: "★"; }` or `.tooltip::after { ... }`
- **THEN** the rule is preserved (pseudo-elements create elements)

### Requirement: Handle multiple style tags

The function SHALL process all `<style>` tags in the HTML document and output cleaned style tags in their original positions.

#### Scenario: Process multiple style tags

- **WHEN** HTML contains 3 `<style>` tags with different CSS content
- **THEN** all 3 style tags are processed, cleaned, and output in their original order and positions

#### Scenario: Preserve style tag attributes

- **WHEN** A style tag has attributes like `<style type="text/css">`
- **THEN** the attributes are preserved in the output

### Requirement: Provide statistics in result

The function SHALL return detailed statistics about the cleanup operation.

#### Scenario: Return rule counts

- **WHEN** cleanup completes successfully
- **THEN** stats object includes `originalRules`, `keptRules`, `removedRules` as numbers

#### Scenario: Return size information

- **WHEN** cleanup completes successfully
- **THEN** stats object includes `originalSize` and `newSize` as byte counts

### Requirement: Conservative matching approach

The function SHALL use a conservative matching strategy that prefers keeping potentially unused rules over removing potentially used rules.

#### Scenario: Keep rules when uncertain

- **WHEN** a selector contains complex pseudo-classes like `:not()`, `:has()`, `:where()`
- **THEN** the rule is kept rather than risk removing needed styles

#### Scenario: Handle selector lists

- **WHEN** CSS contains `.used-class, .unused-class { color: blue; }`
- **THEN** the rule is kept if at least one selector in the list matches the DOM
