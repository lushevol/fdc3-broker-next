# Spec: Clean HTML Output

## ADDED Requirements

### Requirement: Remove all embedded style blocks

The generated HTML file SHALL have all `<style>` elements removed.

#### Scenario: Remove style elements from head

- **WHEN** the source HTML contains `<style type="text/css">` elements in `<head>`
- **THEN** all style elements SHALL be removed from the output HTML
- **AND** no empty style elements SHALL remain

#### Scenario: Remove style elements from body

- **WHEN** the source HTML contains `<style>` elements in `<body>`
- **THEN** all style elements SHALL be removed from the output HTML

### Requirement: Add stylesheet link tags

The generated HTML file SHALL include `<link>` tags for all extracted CSS files.

#### Scenario: Add link tags to head

- **WHEN** CSS files are generated from extraction
- **THEN** `<link rel="stylesheet" href="css/<filename>.css">` tags SHALL be added to `<head>`
- **AND** link tags SHALL be placed after any existing `<meta>` and `<title>` elements

#### Scenario: Link all generated CSS files

- **WHEN** multiple CSS files are generated (tokens.css, antd.css, etc.)
- **THEN** a link tag SHALL be added for each file
- **AND** link tags SHALL be ordered by CSS layer (tokens first, then components)

#### Scenario: Use relative paths

- **WHEN** link tags are generated
- **THEN** paths SHALL be relative to the HTML file location (e.g., `css/antd.css`)
- **AND** no absolute paths or URLs SHALL be used

### Requirement: Preserve inline style attributes

The generated HTML file SHALL preserve all inline `style=""` attributes on elements.

#### Scenario: Keep inline styles unchanged

- **WHEN** an element has a `style` attribute
- **THEN** the style attribute SHALL remain exactly as in the source
- **AND** no transformation or extraction of inline styles SHALL occur

#### Scenario: Preserve dynamic style values

- **WHEN** inline styles contain calculated values (e.g., `rgb(255, 255, 255)`)
- **THEN** these values SHALL be preserved exactly

### Requirement: Preserve all non-style HTML content

The generated HTML file SHALL be identical to the source except for style block removal and link tag addition.

#### Scenario: Preserve document structure

- **WHEN** the output HTML is generated
- **THEN** all elements, attributes, and text content SHALL be preserved
- **AND** the DOM structure SHALL be identical to the source

#### Scenario: Preserve data attributes

- **WHEN** elements have `data-*` attributes
- **THEN** all data attributes SHALL be preserved unchanged

#### Scenario: Preserve event handlers and scripts

- **WHEN** the source HTML contains `<script>` elements or inline event handlers
- **THEN** these SHALL be preserved in the output

### Requirement: Maintain HTML validity

The generated HTML file SHALL be valid HTML5.

#### Scenario: Generate valid HTML structure

- **WHEN** the output HTML is generated
- **THEN** it SHALL have proper `<!DOCTYPE html>` declaration
- **AND** proper HTML structure with `<html>`, `<head>`, and `<body>` elements

#### Scenario: Preserve encoding

- **WHEN** the source HTML has a specific character encoding
- **THEN** the charset declaration SHALL be preserved
- **AND** all characters SHALL be correctly encoded

### Requirement: Output file structure

The extraction SHALL produce a specific file structure.

#### Scenario: Create output directory structure

- **WHEN** extraction completes
- **THEN** the following structure SHALL exist:

```
<output-dir>/
├── index.html
└── css/
    ├── tokens.css
    ├── fonts.css
    ├── antd.css
    ├── mui.css
    ├── components.css
    └── utilities.css
```

#### Scenario: Skip empty CSS files

- **WHEN** a CSS category has no rules
- **THEN** no file SHALL be created for that category
- **AND** no link tag SHALL be added for the missing file

### Requirement: Preserve original file

The source HTML file SHALL remain unchanged after extraction.

#### Scenario: Original file untouched

- **WHEN** extraction runs on an input file
- **THEN** the input file SHALL not be modified
- **AND** the output SHALL be written to a separate location
