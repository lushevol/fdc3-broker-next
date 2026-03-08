# Specification: HTML Sanitization

## ADDED Requirements

### Requirement: Remove script and iframe elements

The system SHALL remove all `<script>`, `<noscript>`, and `<iframe>` elements from the input HTML while preserving the rest of the document structure.

#### Scenario: Script tag removal

- **WHEN** the input HTML contains `<script>` tags with inline or external JavaScript
- **THEN** all `<script>` tags are removed from the output

#### Scenario: Noscript tag removal

- **WHEN** the input HTML contains `<noscript>` tags
- **THEN** all `<noscript>` tags are removed from the output

#### Scenario: Iframe tag removal

- **WHEN** the input HTML contains `<iframe>` tags
- **THEN** all `<iframe>` tags are removed from the output

### Requirement: Replace SVG elements with placeholders

The system SHALL replace all `<svg>` element trees with placeholder `<i>` elements that mark the original location.

#### Scenario: SVG replacement

- **WHEN** the input HTML contains `<svg>` elements with nested content
- **THEN** each `<svg>` tree is replaced with `<i data-icon-placeholder="true"></i>`

#### Scenario: Multiple SVG elements

- **WHEN** the input HTML contains multiple `<svg>` elements
- **THEN** each SVG is replaced with an individual placeholder element

### Requirement: Replace Base64 image sources

The system SHALL replace Base64-encoded image sources with a placeholder string while preserving the `<img>` element structure.

#### Scenario: Base64 image source replacement

- **WHEN** an `<img>` tag has a `src` attribute starting with `data:image/`
- **THEN** the `src` attribute value is replaced with `BASE64_DATA`

#### Scenario: Regular image URLs preserved

- **WHEN** an `<img>` tag has a regular URL `src` attribute
- **THEN** the `src` attribute is preserved unchanged

### Requirement: Remove inline styles

The system SHALL remove all `style` attributes from HTML elements while preserving `class` attributes.

#### Scenario: Style attribute removal

- **WHEN** an HTML element has a `style` attribute
- **THEN** the `style` attribute is removed from the element

#### Scenario: Class attributes preserved

- **WHEN** an HTML element has `class` attributes including `ant-*` or `Mui*` patterns
- **THEN** all `class` attributes are preserved intact

### Requirement: Strip HTML comments

The system SHALL remove all HTML comments from the document.

#### Scenario: Comment removal

- **WHEN** the input HTML contains `<!-- comment -->` blocks
- **THEN** all comment blocks are removed from the output

### Requirement: Output clean HTML file

The system SHALL output a sanitized HTML file named `clean_structure.html` with all transformations applied.

#### Scenario: Output file creation

- **WHEN** the sanitization process completes successfully
- **THEN** a file named `clean_structure.html` is created in the output directory

#### Scenario: File size reduction

- **WHEN** the sanitization process completes
- **THEN** the output file size is at least 60% smaller than the input file

### Requirement: Output CSS class audit

The system SHALL extract and output all unique CSS class names from the document.

#### Scenario: Class extraction

- **WHEN** the sanitization process completes
- **THEN** a file named `styles_audit.txt` is created listing all unique CSS classes

#### Scenario: Class categorization

- **WHEN** the styles audit is generated
- **THEN** classes are grouped by prefix (ant-_, Mui_, custom) for easier analysis
