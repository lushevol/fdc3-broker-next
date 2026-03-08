# Spec: CSS Extraction Tooling

## ADDED Requirements

### Requirement: Parse HTML and extract style blocks

The extraction tool SHALL parse an HTML file and extract all CSS content from `<style>` blocks.

#### Scenario: Extract style blocks from HTML

- **WHEN** the tool processes an HTML file containing `<style type="text/css">` blocks
- **THEN** all CSS content within style blocks SHALL be extracted
- **AND** the original HTML file SHALL remain unchanged

#### Scenario: Handle empty or missing style blocks

- **WHEN** the tool processes an HTML file with no style blocks
- **THEN** the tool SHALL complete successfully with empty CSS output
- **AND** a warning SHALL be logged indicating no styles were found

### Requirement: Categorize CSS rules by source library

The extraction tool SHALL categorize extracted CSS rules based on selector patterns.

#### Scenario: Categorize Ant Design selectors

- **WHEN** a CSS rule contains selectors matching `.ant-*` or `:where(.css-*)`
- **THEN** the rule SHALL be categorized as Ant Design CSS

#### Scenario: Categorize MUI selectors

- **WHEN** a CSS rule contains selectors matching `.Mui*`
- **THEN** the rule SHALL be categorized as MUI CSS

#### Scenario: Categorize custom component selectors

- **WHEN** a CSS rule contains selectors matching `.MicroWebUI_*`
- **THEN** the rule SHALL be categorized as custom component CSS

#### Scenario: Categorize font definitions

- **WHEN** a CSS rule is an `@font-face` declaration
- **THEN** the rule SHALL be categorized as font CSS

#### Scenario: Categorize design tokens

- **WHEN** a CSS rule defines CSS custom properties (`:root`), `@keyframes`, or `@charset`
- **THEN** the rule SHALL be categorized as token CSS

#### Scenario: Handle uncategorized rules

- **WHEN** a CSS rule does not match any predefined category
- **THEN** the rule SHALL be placed in the utilities category
- **AND** the uncategorized selector SHALL be logged for review

### Requirement: Deduplicate CSS rules

The extraction tool SHALL remove duplicate CSS rules while preserving cascade order.

#### Scenario: Remove duplicate rules

- **WHEN** the same CSS rule (selector + declarations) appears multiple times
- **THEN** only the first occurrence SHALL be preserved
- **AND** a count of removed duplicates SHALL be logged

### Requirement: Generate output files

The extraction tool SHALL generate categorized CSS files and a modified HTML file.

#### Scenario: Generate CSS files

- **WHEN** extraction and categorization is complete
- **THEN** CSS files SHALL be created for each non-empty category
- **AND** each file SHALL be named according to its category (e.g., `antd.css`, `mui.css`)

#### Scenario: Generate clean HTML

- **WHEN** CSS extraction is complete
- **THEN** a new HTML file SHALL be generated with all `<style>` blocks removed
- **AND** `<link rel="stylesheet">` tags SHALL be added for each generated CSS file
- **AND** link tags SHALL be placed in the `<head>` element

### Requirement: Provide CLI interface

The extraction tool SHALL be executable via command line.

#### Scenario: Run extraction via CLI

- **WHEN** user runs `node scripts/extract-css.mjs <input.html> <output-dir>`
- **THEN** the tool SHALL process the input file
- **AND** write output to the specified directory
- **AND** exit with code 0 on success

#### Scenario: Handle invalid input

- **WHEN** user provides a non-existent input file
- **THEN** the tool SHALL exit with code 1
- **AND** an error message SHALL be displayed

#### Scenario: Display extraction statistics

- **WHEN** extraction completes successfully
- **THEN** the tool SHALL print statistics including:
  - Total style blocks processed
  - Total CSS rules extracted
  - Rules per category
  - Duplicates removed
  - Output file sizes
