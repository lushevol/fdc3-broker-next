---
name: framework-guidelines
description: SC WebKit framework rules for component implementation. Use when generating or reviewing SC WebKit component code. Covers mandatory rules: only use documented component properties from .stories.d.ts files, never import sc-* components (they are globally registered), always apply responsive breakpoints (xs/md/lg) on sc-grid-column elements, use sc-data-grid for any tabular data, and place all implementation code inside the designated container.
compatibility: Designed for VS Code Copilot agent mode
---

# SC WebKit — Framework Guidelines

## Essential Development Rules

1. **Component Properties**: Only use properties documented in `.stories.d.ts` files
2. **Attribute Value Verification**: CRITICAL - Always verify valid attribute values by checking `options` arrays and `argTypes` in `.stories.d.ts` files before implementation. NEVER assume or guess attribute values.
3. **Styling**: Use SC WebKit's grid system (`sc-grid-row`, `sc-grid-column`) and `sc-spacer` for layout
4. **Icons**: Reference `node_modules/@scdevkit/icons/dist/src/libraries/MainIconLibrary.d.ts` for available icon names
5. **Code Placement**: ALL implementation code must be placed inside the `<div id="insertHere">` container
6. **Component Imports**: NEVER import SC WebKit component elements (e.g., `sc-tab-group.js`, `sc-button.js`, etc.) - all SC WebKit components are pre-loaded and available globally in the application
7. **Responsive Design**: MANDATORY - ALWAYS include responsive breakpoint attributes (`xs`, `md`, `lg`) on ALL `sc-grid-column` elements. NEVER use only `xs` attribute - always add `md` and `lg` for proper responsive behavior across all screen sizes.

## Component Import Guidelines

**FORBIDDEN Component Imports**:
```typescript
// ❌ NEVER DO THIS - Components are already available
import '@scdevkit/webkit/dist/elements/sc-tab-group.js';
import '@scdevkit/webkit/dist/elements/sc-button.js';
import '@scdevkit/webkit/dist/elements/sc-modal.js';
```

**REQUIRED Imports ONLY**:
```typescript
// ✅ ONLY import these essentials
import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
```

**Rule**: All SC WebKit components (`sc-*`) are globally registered and available without imports. Only import LitElement essentials and ScGridStyle for layout.

## Table Implementation Requirements

**CRITICAL TABLE RULE**: If the Figma design contains any form of tabular data structure (rows, columns, headers), you MUST use `sc-data-grid` and achieve AT LEAST 30% visual similarity using its documented properties.

**Table Detection Criteria**:
- Design shows data in rows and columns
- Contains table headers
- Has sorting indicators
- Shows filtering capabilities
- Displays data lists with consistent structure
- Any grid-like layout with data

**MANDATORY sc-data-grid Usage**:
1. **Always Check Properties First**: Examine `sc-data-grid.stories.d.ts` for ALL available features
2. **Use Built-in Features**: Leverage ALL documented properties for:
   - Filtering functionality
   - Sorting capabilities  
   - Data pagination
   - Row selection
   - Hierarchical data display
   - Data grouping
   - Column/row pinning
3. **Custom Styling**: Use only verified styling properties from `sc-data-grid.stories.d.ts`
4. **Accept Visual Differences**: SC WebKit's data grid styling takes precedence over pixel-perfect design matching

**30% Visual Similarity Criteria**:
- Column structure matches (same number of columns)
- Data hierarchy is preserved (if applicable)
- Basic sorting/filtering functionality is present (if shown in design)
- Row selection works (if required)
- Core data display is functional and readable

**Acceptable Visual Differences**:
- SC WebKit's default colors instead of exact Figma color codes
- SC WebKit's typography system instead of custom fonts
- Standard spacing increments (8px, 16px, 24px) instead of arbitrary spacing
- Component borders and styling from SC WebKit's design system
- Icon variations using available SC WebKit icon library

**ABSOLUTELY FORBIDDEN Table Practices**:
- Creating custom table structures using `sc-grid-row`/`sc-grid-column`
- Using HTML `<table>` elements
- Building table-like layouts with custom divs
- Implementing sorting, filtering, or pagination manually when `sc-data-grid` supports it

**Implementation Process for Tables**:
1. **Identify Table Structure**: Confirm design contains tabular data
2. **Read sc-data-grid Documentation**: Study `sc-data-grid.stories.d.ts` completely
3. **Map Data Structure**: Organize data to fit sc-data-grid's expected format
4. **Configure Properties**: Use ONLY documented properties to match design features
5. **Validate Functionality**: Ensure sorting, filtering, and other features work properly

**ENFORCEMENT**: Any implementation using custom HTML for tabular data structures will be rejected. All table-like designs MUST use `sc-data-grid` regardless of visual complexity or hierarchy requirements.


## Reference Sources

**Primary**: `node_modules/@scdevkit/webkit/dist/stories/*.stories.d.ts` - Complete component definitions with properties, types, and documentation
**Component Mapping**: `.github/resources/components-map.json` - Design-to-component mappings with default properties
**Live Examples**: `node_modules/@scdevkit/webkit/dist/storybook/` - Compiled Storybook examples and registry

## Live Examples Verification Protocol

**MANDATORY**: Before implementing any SC WebKit component, you MUST examine live Storybook examples to understand proper usage patterns and avoid implementation errors.

**Step-by-Step Live Examples Process**:

1. **Locate Story Bundle**: Find the component's webpack bundle file
   ```bash
   # Pattern: {component-name}-stories.*.iframe.bundle.js
   # Example: sc-action-bar → sc-action-bar-stories.*.iframe.bundle.js
   # Example: sc-button → sc-button-stories.*.iframe.bundle.js
   # Look in: node_modules/@scdevkit/webkit/dist/storybook/
   
   # Use wildcard pattern to find actual files:
   ls node_modules/@scdevkit/webkit/dist/storybook/sc-action-bar-stories.*.iframe.bundle.js
   ls node_modules/@scdevkit/webkit/dist/storybook/sc-button-stories.*.iframe.bundle.js
   ```

2. **Check Story Registry**: Examine `index.json` for available examples
   ```bash
   # Replace {component-name} with actual component name (without 'sc-' prefix)
   # Example: For sc-action-bar, use "action-bar"
   grep -o '"components-action-bar[^"]*"[^}]*}' index.json
   
   # General pattern for any component:
   grep -o '"components-{component-name}[^"]*"[^}]*}' index.json
   ```

3. **Read Bundle Implementation**: Study actual story code for:
   - **Property Usage**: How attributes are applied (`config`, `type`, `size`, etc.)
   - **Slot Implementation**: Custom content insertion patterns
   - **Configuration Objects**: Complex property structures (e.g., action bar config)
   - **Event Handlers**: Interactive functionality patterns
   - **Attribute Combinations**: Valid property pairings

4. **Extract Verified Patterns**: Copy proven code patterns from bundle files:
   ```javascript
   // Example from sc-action-bar bundle:
   var Default = function(props) {
     return html`<sc-action-bar .config=${props.config}></sc-action-bar>`;
   };
   ```

5. **Cross-Reference Documentation**: Validate bundle patterns against `.stories.d.ts` definitions

**Critical Benefits**:
- **Avoid Guesswork**: Use only proven attribute combinations
- **Prevent Errors**: Eliminate invalid property usage
- **Understand Complexity**: Learn proper configuration object structures
- **Copy Working Code**: Reference actual functional implementations

**Example Verification Workflow**:
```typescript
// 1. Find sc-action-bar examples
// 2. Study Default, BreadcrumbBar, CustomActionBar stories
// 3. Extract configuration patterns:
const actionBarConfig = {
  "left-back": { back: { mode: "href", to: "#", label: "Back" } },
  "left-actions": [{ text: "title-1" }, { buttonDropdown: {...} }],
  "right-groups": [{ button: { type: "primary", buttonText: "Submit" } }]
};
// 4. Apply verified pattern in implementation
```

## Component Implementation Protocol

**Core Rule**: Use `node_modules/@scdevkit/webkit/dist/stories` as the SINGLE SOURCE OF TRUTH for all SC WebKit components.

**CRITICAL Property Verification Rule**: 
- **ALWAYS** verify component properties in actual TypeScript definition files (`.d.ts`) located in `node_modules/@scdevkit/webkit/dist/src/components/`
- **NEVER** rely solely on Storybook documentation strings or comments in bundle files - they may contain outdated or misleading property names
- **Example**: For `sc-data-grid`, check `node_modules/@scdevkit/webkit/dist/src/components/ScDataGrid/mixins/table-state-mixin.d.ts` to confirm actual properties like `.columns` and `.data` (NOT `.columnDefs` or `.rowData`)
- **Process**: When uncertain about property names, locate the component's TypeScript definition file and verify the exact property names in the interface/type definitions

**CRITICAL Verification Process**:
1. **Read `.stories.d.ts` Files**: MANDATORY before using any component - examine the complete TypeScript definition file
2. **Verify TypeScript Definitions**: Check actual component `.d.ts` files in `node_modules/@scdevkit/webkit/dist/src/components/` for authoritative property names
3. **Check `argTypes`**: Verify ALL available properties and their valid values in the `argTypes` section
4. **Examine `options` Arrays**: When present, use ONLY values listed in `options` arrays for attributes
4. **Study Live Storybook Examples**: MANDATORY - Examine webpack bundle files and `index.json` registry to understand:
   - Available story variants and their implementations
   - Proper attribute combinations and configuration objects
   - Slot usage patterns and custom content insertion
   - Event handling and interactive functionality
   - Verified code patterns from actual working examples
5. **Study Story Examples**: Review story exports (Default, variations) to understand proper usage patterns
6. **Validate Component Choice**: Ensure you're using the most appropriate component (e.g., `sc-tag` vs `sc-badge` vs `sc-label`)

**NEVER**:
- Assume attribute values exist without verification
- Guess property names or valid values
- Use custom attribute values not documented in the stories
- Mix up similar components without checking their specific purposes

**Implementation Steps**:
1. **Analyze Figma Design**: Extract EXACT measurements (pixel widths, heights) and proportions from design context
2. **Map Components**: Use `.github/resources/components-map.json` for initial component identification
3. **Verify Component Properties**: MANDATORY - Read the corresponding `.stories.d.ts` file to verify ALL available properties, types, and valid attribute values before implementation
4. **Study Live Examples**: CRITICAL - Examine actual Storybook examples to understand proper usage patterns:
   - **Find Bundle Files**: Locate component's webpack bundle using wildcards (e.g., `sc-action-bar-stories.*.iframe.bundle.js`)
   - **Review Story Implementations**: Study all available story variants (Default, BreadcrumbBar, CustomActionBar, etc.)
   - **Extract Usage Patterns**: Identify proper attribute combinations, configuration objects, and slot usage
   - **Copy Verified Code**: Use actual story code as reference for component implementation
   - **Check Index Registry**: Verify story count and available examples in `index.json` to ensure comprehensive coverage
5. **Validate Attribute Values**: NEVER assume attribute values - always check the `options` arrays, `argTypes`, and story examples in `.stories.d.ts` files for valid values
6. **Use SC WebKit Component**: Implement the mapped SC WebKit component using ONLY verified properties with valid values from live examples
7. **Calculate Grid Layout**: Determine proper `xs` values based on actual design proportions, NOT assumptions
8. **Apply Component Values**: Use only documented SC WebKit component attributes with verified valid values - functional consistency takes precedence over pixel-perfect visual matching
9. **Validate Proportions**: Ensure grid columns add up to 12 and match visual design accurately


## Component Template (Standard)

Create TypeScript files in `src/components` using kebab-case for multi-word component names:

```typescript
import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';

@customElement('component-name') // Use kebab-case
export class ComponentName extends LitElement { // Use PascalCase
    static styles = css`${ScGridStyle}`;
    render() {
        return html`
            <main>
                <sc-column-layout layout="Main Content Full" height="auto" additional-height="0px">
                    <div slot="content">
                        <div id="insertHere"><!-- Implementation goes here --></div> 
                    </div>
                </sc-column-layout>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'component-name': ComponentName; // Match component name
    }
}
```

**Registration**: Always update `src/app-page.ts` to import new components:
```typescript
import "./components/component-name.js"; // Always use .js extension

// Replace existing component in render method:
<div id="insertComponent">
    <component-name></component-name>
</div>
```

## Layout Structure
Use SC WebKit's 12-column grid system with responsive column attributes. **CRITICAL**: Always analyze actual Figma design measurements to determine correct grid proportions - do NOT assume equal column widths.

### Grid Analysis Process
1. **Extract Width Measurements**: Note pixel widths from Figma design context or generated code
2. **Calculate Proportions**: Determine relative widths as percentages of total container width
3. **Convert to Grid Values**: Use this formula: `xs_value = round((element_width / total_width) * 12)`
   - Example: Element is 300px wide, total container is 1200px
   - Calculation: `(300 / 1200) * 12 = 3`, so use `xs="3"`
4. **Verify Total**: Ensure column values add up to 12 (e.g., xs="3" + xs="4" + xs="5" = 12)
5. **Adjust if Needed**: If total ≠ 12, redistribute values proportionally while maintaining visual balance

### ⚠️ CRITICAL GRID VALIDATION RULE
**EVERY `sc-grid-row` MUST have column `xs` values that sum to exactly 12.**

Examples of CORRECT grid layouts:
- `xs="12"` (1 column) = 12 ✅
- `xs="6" + xs="6"` (2 columns) = 12 ✅  
- `xs="4" + xs="4" + xs="4"` (3 columns) = 12 ✅
- `xs="3" + xs="1" + xs="4" + xs="4"` (4 columns with spacing) = 12 ✅

Examples of INCORRECT grid layouts:
- `xs="3" + xs="4" + xs="4"` = 11 ❌
- `xs="6" + xs="8"` = 14 ❌
- `xs="5" + xs="5" + xs="5"` = 15 ❌

**Solution for spacing**: Use empty columns for spacing (e.g., `<sc-grid-column xs="1"></sc-grid-column>`)

### ⚠️ AVOID REPETITIVE GRID NESTING
**FORBIDDEN**: Do NOT use repetitive `sc-grid-row` and `sc-grid-column` patterns that create unnecessary nesting.

```html
<!-- ❌ INCORRECT: Repetitive and unnecessary nesting -->
<sc-grid-row>
    <sc-grid-column xs="12">
        <sc-grid-row>
            <sc-grid-column xs="12">
                Content
            </sc-grid-column>
        </sc-grid-row>
    </sc-grid-column>
</sc-grid-row>

<!-- ✅ CORRECT: Simplified structure -->
<sc-grid-row>
    <sc-grid-column xs="12">
        Content
    </sc-grid-column>
</sc-grid-row>
```

**Rule**: Only nest grid structures when you need different column layouts at different levels. Avoid single-column full-width nesting.

### ⚠️ AVOID UNNECESSARY FULL-WIDTH GRID WRAPPING
**FORBIDDEN**: Do NOT wrap content in unnecessary `<sc-grid-row><sc-grid-column xs="12">` when the container already provides full width.

```html
<!-- ❌ INCORRECT: Unnecessary full-width grid wrapping in tab panels -->
<sc-tab-panel name="content">
    <sc-grid-row>
        <sc-grid-column xs="12">
            <sc-grid-row>
                <sc-grid-column xs="4">Content 1</sc-grid-column>
                <sc-grid-column xs="4">Content 2</sc-grid-column>
                <sc-grid-column xs="4">Content 3</sc-grid-column>
            </sc-grid-row>
        </sc-grid-column>
    </sc-grid-row>
</sc-tab-panel>

<!-- ✅ CORRECT: Direct content layout in tab panels -->
<sc-tab-panel name="content">
    <sc-grid-row>
        <sc-grid-column xs="4">Content 1</sc-grid-column>
        <sc-grid-column xs="4">Content 2</sc-grid-column>
        <sc-grid-column xs="4">Content 3</sc-grid-column>
    </sc-grid-row>
</sc-tab-panel>
```

**Rule**: In containers that already provide full width (like `sc-tab-panel`, `sc-box`, `sc-modal`), start directly with your intended grid layout. Only use `xs="12"` when you need a single-column layout within a multi-column row.

### Common Layout Examples

```html
<!-- Equal two columns (half width each: 6/12) -->
<sc-grid-row>
    <sc-grid-column xs="6">Content 1</sc-grid-column>
    <sc-grid-column xs="6">Content 2</sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>

<!-- Equal three columns (one-third width each: 4/12) -->
<sc-grid-row>
    <sc-grid-column xs="4">Content 1</sc-grid-column>
    <sc-grid-column xs="4">Content 2</sc-grid-column>
    <sc-grid-column xs="4">Content 3</sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>

<!-- Unequal three columns based on design measurements -->
<sc-grid-row>
    <sc-grid-column xs="3">Narrow Content</sc-grid-column>
    <sc-grid-column xs="4">Medium Content</sc-grid-column>
    <sc-grid-column xs="5">Wide Content</sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>

<!-- Three columns with spacing between them -->
<sc-grid-row>
    <sc-grid-column xs="3">Content 1</sc-grid-column>
    <sc-grid-column xs="1"></sc-grid-column> <!-- Empty spacing column -->
    <sc-grid-column xs="4">Content 2</sc-grid-column>
    <sc-grid-column xs="4">Content 3</sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>

<!-- Full width: 12/12 -->
<sc-grid-row>
    <sc-grid-column xs="12">Full width content</sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>
```

**Grid System Reference**: 
- `xs="1"` = 8.33% width (1/12)
- `xs="2"` = 16.67% width (2/12) 
- `xs="3"` = 25% width (3/12)
- `xs="4"` = 33.33% width (4/12)
- `xs="5"` = 41.67% width (5/12)
- `xs="6"` = 50% width (6/12)
- `xs="12"` = 100% width (12/12)

## Responsive Design with Breakpoints

SC WebKit's grid system supports responsive design through breakpoint-specific column attributes. Use multiple breakpoint attributes on the same `<sc-grid-column>` to control layout behavior across different screen sizes.

### Breakpoint System
- **`xs`**: Mobile-first (≥0px) - Default for all screen sizes
- **`sm`**: Small tablets (≥576px)
- **`md`**: Tablets and small desktops (≥1024px) 
- **`lg`**: Large desktops (≥1200px)
- **`xl`**: Extra large screens (≥1400px)
- **`xxl`**: Ultra-wide screens (≥1920px)

### Valid Column Values
Each breakpoint attribute accepts these values:
- `"auto"` - Auto width based on content
- `"1"` through `"12"` - Column span (1/12 to 12/12 of container width)

### Mobile-First Approach
**CRITICAL**: Always start with `xs` attribute for mobile layout, then progressively enhance for larger screens:

**MANDATORY RESPONSIVE IMPLEMENTATION**: 
- **NEVER** use only `xs` attribute on `sc-grid-column` elements
- **ALWAYS** include `md` and `lg` breakpoints for complete responsive behavior
- **REQUIRED PATTERN**: Every `sc-grid-column` MUST have `xs="X" md="Y" lg="Z"` format
- **NO EXCEPTIONS**: This applies to ALL grid columns regardless of layout complexity

```html
<!-- ✅ CORRECT: Mobile-first responsive layout -->
<sc-grid-row>
    <!-- Single column on mobile, 2 columns on tablet, 3 columns on desktop -->
    <sc-grid-column xs="12" md="6" lg="4">Card 1</sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4">Card 2</sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4">Card 3</sc-grid-column>
</sc-grid-row>

<!-- ❌ INCORRECT: Missing responsive breakpoints -->
<sc-grid-row>
    <sc-grid-column xs="4">Card 1</sc-grid-column>
    <sc-grid-column xs="4">Card 2</sc-grid-column>
    <sc-grid-column xs="4">Card 3</sc-grid-column>
</sc-grid-row>
```

### Common Responsive Patterns

#### Form Layout - Stacked to Side-by-Side
```html
<sc-grid-row>
    <!-- Stack on mobile, side-by-side on tablet+ -->
    <sc-grid-column xs="12" md="6">
        <sc-text-input label="First Name"></sc-text-input>
    </sc-grid-column>
    <sc-grid-column xs="12" md="6">
        <sc-text-input label="Last Name"></sc-text-input>
    </sc-grid-column>
</sc-grid-row>
```

#### Content + Sidebar Layout
```html
<sc-grid-row>
    <!-- Full width on mobile, main content + sidebar on desktop -->
    <sc-grid-column xs="12" lg="8">
        <!-- Main content area -->
        <sc-box>Main Content</sc-box>
    </sc-grid-column>
    <sc-grid-column xs="12" lg="4">
        <!-- Sidebar - appears below main content on mobile -->
        <sc-box>Sidebar</sc-box>
    </sc-grid-column>
</sc-grid-row>
```

#### Card Grid Layout
```html
<sc-grid-row>
    <!-- 1 column mobile, 2 columns tablet, 3 columns desktop, 4 columns large -->
    <sc-grid-column xs="12" md="6" lg="4" xl="3">
        <sc-card>Card 1</sc-card>
    </sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4" xl="3">
        <sc-card>Card 2</sc-card>
    </sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4" xl="3">
        <sc-card>Card 3</sc-card>
    </sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4" xl="3">
        <sc-card>Card 4</sc-card>
    </sc-grid-column>
</sc-grid-row>
```

#### Complex Form Layout
```html
<sc-grid-row>
    <!-- Full width field on mobile, 1/3 width on desktop -->
    <sc-grid-column xs="12" lg="4">
        <sc-dropdown-input label="Category"></sc-dropdown-input>
    </sc-grid-column>
    <!-- Full width field on mobile, 2/3 width on desktop -->
    <sc-grid-column xs="12" lg="8">
        <sc-text-input label="Description"></sc-text-input>
    </sc-grid-column>
</sc-grid-row>
<sc-spacer vertical size="16"></sc-spacer>
<sc-grid-row>
    <!-- Equal width on all screens except mobile (stacked) -->
    <sc-grid-column xs="12" md="4">
        <sc-number-input label="Price"></sc-number-input>
    </sc-grid-column>
    <sc-grid-column xs="12" md="4">
        <sc-number-input label="Quantity"></sc-number-input>
    </sc-grid-column>
    <sc-grid-column xs="12" md="4">
        <sc-text-input label="Total" readonly></sc-text-input>
    </sc-grid-column>
</sc-grid-row>
```

### Responsive Design Rules
1. **Always use `xs`**: Every responsive column MUST have an `xs` attribute
2. **MANDATORY Breakpoints**: Every `sc-grid-column` MUST include `md` and `lg` attributes - NEVER use only `xs`
3. **Breakpoint inheritance**: Larger breakpoints inherit smaller breakpoint values if not specified
4. **Grid validation**: Column values must sum to 12 AT EACH BREAKPOINT
5. **Content priority**: Most important content should appear first in mobile layout
6. **Touch targets**: Ensure adequate spacing and sizing for mobile touch interaction
7. **Complete Responsive Pattern**: Use `xs="X" md="Y" lg="Z"` format on ALL grid columns without exception

### Responsive Validation Examples
```html
<!-- ✅ CORRECT: Valid at all breakpoints -->
<sc-grid-row>
    <sc-grid-column xs="12" md="6" lg="4">Content 1</sc-grid-column>
    <sc-grid-column xs="12" md="6" lg="4">Content 2</sc-grid-column>
    <sc-grid-column xs="12" md="12" lg="4">Content 3</sc-grid-column>
</sc-grid-row>
<!-- Mobile: 12 | Tablet: 6+6=12 then 12 | Desktop: 4+4+4=12 ✅ -->

<!-- ❌ INCORRECT: Invalid tablet layout -->
<sc-grid-row>
    <sc-grid-column xs="12" md="4" lg="4">Content 1</sc-grid-column>
    <sc-grid-column xs="12" md="4" lg="4">Content 2</sc-grid-column>
    <sc-grid-column xs="12" md="4" lg="4">Content 3</sc-grid-column>
</sc-grid-row>
<!-- Mobile: 12+12+12 (stacked) ✅ | Tablet: 4+4+4=12 ✅ | Desktop: 4+4+4=12 ✅ -->
<!-- Actually this is correct, my mistake in the comment -->

<!-- ❌ INCORRECT: Missing xs attribute -->
<sc-grid-row>
    <sc-grid-column md="6" lg="4">Content</sc-grid-column>
</sc-grid-row>
<!-- Mobile behavior undefined without xs attribute ❌ -->
```

## Design Implementation Guidelines

### Colors
- **MANDATORY**: Use ONLY SC WebKit component color attributes verified in `.stories.d.ts` files
- **Examples of valid usage**: Check `.stories.d.ts` for exact values like `color="primary"`, `type="warning"`, `color="blue"`
- **FORBIDDEN**: Do NOT extract hex color values from Figma design (#ffffff, #0656A8, etc.)
- **FORBIDDEN**: Do NOT use custom CSS color properties or inline color styles on SC WebKit components
- **Required**: Accept SC WebKit's predefined color palette - functional consistency takes precedence over exact visual matching from Figma design

### Typography
- **MANDATORY**: Use `<sc-title level="1-6">` for ALL headings - verify `level` attribute values in `sc-title.stories.d.ts`
- **MANDATORY**: Use SC WebKit component text properties ONLY - verify all text attributes in component `.stories.d.ts` files
- **FORBIDDEN**: Do NOT attempt to match Figma font weights, sizes, or line-heights with custom CSS
- **FORBIDDEN**: Do NOT use custom HTML elements (`<h1>`, `<p>`, `<span>`) for text when SC WebKit text components exist
- **Required**: Accept SC WebKit's typography system - functional consistency and accessibility take precedence over exact font matching from Figma design

### Icons
- **MANDATORY**: Use `<sc-icon name="icon-name">` component with exact icon name from `MainIconLibrary.d.ts`
- **MANDATORY**: Icon names must match EXACTLY from `node_modules/@scdevkit/icons/dist/src/libraries/MainIconLibrary.d.ts`
- **Example**: `<sc-icon name="arrow-right--fill"></sc-icon>`
- **FORBIDDEN**: Do NOT use custom SVG icons or image files when SC WebKit icons exist
- **Fallback**: If required icon doesn't exist in SC WebKit library, use `<div>` with inline styles for simple shapes or request icon addition

### Spacing
- **MANDATORY**: Use `<sc-spacer vertical size="NUMBER">` for vertical spacing between sections
- **Valid sizes (pixels)**: `8` (minimal), `12` (tight), `16` (standard), `24` (loose), `32` (section break), `48` (major section break)
- **Usage Guidelines**:
  - `8px`: Between related form fields or list items
  - `12px`: Between input groups or card elements  
  - `16px`: Standard spacing between content blocks
  - `24px`: Between different content sections
  - `32px`: Between major UI sections
  - `48px`: Between distinct page sections or headers
- **CUSTOM HTML ONLY**: Use inline styles with pixel values for margins/padding (e.g., `style="margin: 16px; padding: 8px"`)
- **FORBIDDEN**: Do NOT add spacing styles to SC WebKit components themselves
- **Priority**: Always prefer `<sc-spacer>` over custom inline styles

### Component Priority Decision Process
**CRITICAL**: Always follow this MANDATORY decision hierarchy when implementing design elements:

1. **MANDATORY First Step - Always Use SC WebKit Components**: 
   - **ALWAYS** start with the appropriate SC WebKit component from `.github/resources/components-map.json`
   - **ALWAYS** verify component properties in corresponding `.stories.d.ts` file BEFORE implementation
   - **ALWAYS** use the closest match in the live examples if any component matches the design pattern
   - **FOR TABLES**: MANDATORY use of `sc-data-grid` - achieve minimum 30% visual similarity using documented properties
   - **ACCEPT visual differences** - use SC WebKit component if it serves the same functional purpose
   - **IF COMPONENT DETECTED**: When any SC WebKit component is identified that matches the design pattern, MANDATORY use that component and find the closest design variant from available stories - NEVER create custom HTML for matched components
   - **Only proceed to step 2 if**: NO SC WebKit component exists for the required functionality after exhaustive component mapping review

2. **Last Resort - Custom HTML Only When ZERO Components Match**: 
   - Custom HTML `<div>` elements with inline styles are FORBIDDEN for any design pattern that has a corresponding SC WebKit component
   - Custom HTML `<div>` elements with inline styles are FORBIDDEN for any tabular data structure
   - Use custom HTML ONLY when:
     - **ZERO equivalent SC WebKit components exist** for the required functionality after thorough component mapping and live examples review
     - **NO SC WebKit component serves the same functional purpose** even with visual differences
     - The design pattern is fundamentally incompatible with ALL available components
     - **NEVER applies to tables/grids** - `sc-data-grid` must always be used
   - **INVALID reasons for custom HTML:**
     - Color differences from design
     - Font, spacing, or sizing differences
     - Border radius or styling preferences
     - Desire for pixel-perfect visual matching
     - **ANY COMPONENT MATCH EXISTS**: Absolutely forbidden when any SC WebKit component serves similar purpose

### Component Usage Rules
- **Component Selection Clarity**: 
  - **`sc-tab-group`**: Use for **interactive content switching** with clickable tab headers and corresponding tab panels. Design shows clickable navigation between different content sections.
  - **`sc-stepper`**: Use for **progress indication** in linear workflows. Design shows step-by-step progress without content switching capability.
  - **Key Difference**: Tabs = switchable content sections; Stepper = progress visualization only.
- **Tab Groups Styling**: **MANDATORY** - When `<sc-tab-group>` has `<sc-box>` as a parent (within 5 levels up in the hierarchy), add inline styling `style="padding: 16px"` for consistent spacing and add `style="width: 98%"` to `<sc-tab-panel>` children
  ```html
  <!-- ✅ CORRECT: Tab group with sc-box within 5 levels up -->
    <sc-box>
        <sc-grid-row>
            <sc-grid-column xs="12">
                <sc-tab-group style="padding: 16px" alignment="left" type="outline">
                    <sc-tab slot="nav" panel="content">Tab Content</sc-tab>
                    <sc-tab-panel name="content" style="width: 98%">
                        <div>Form content inside tab</div>
                    </sc-tab-panel>
                </sc-tab-group>
            </sc-grid-column>
        </sc-grid-row>
    </sc-box>
  
  <!-- ✅ ALSO CORRECT: Tab group with sc-box as direct parent -->
    <sc-box>
        <sc-tab-group style="padding: 16px" alignment="left" type="outline">
            <sc-tab slot="nav" panel="content">Tab Content</sc-tab>
            <sc-tab-panel name="content" style="width: 98%">
                <div>Form content inside tab</div>
            </sc-tab-panel>
        </sc-tab-group>
    </sc-box>
  ```
- **Tab Panel with Box Content**: **MANDATORY** - When `<sc-tab-panel>` contains `<sc-box>` as a direct child, wrap the `<sc-box>` in a `<div>` with `style="padding: 16px"` for proper spacing
  ```html
  <!-- ✅ CORRECT: Tab panel containing sc-box with wrapper div -->
    <sc-tab-panel name="content">
        <sc-box type="elevated" space-size="24">
            <div style="padding: 16px">
                <sc-grid-row>
                    <sc-grid-column xs="4">Content 1</sc-grid-column>
                    <sc-grid-column xs="4">Content 2</sc-grid-column>
                    <sc-grid-column xs="4">Content 3</sc-grid-column>
                </sc-grid-row>
            </div>
        </sc-box>
    </sc-tab-panel>
  
  <!-- ❌ INCORRECT: Tab panel with sc-box without wrapper -->
    <sc-tab-panel name="content">
        <sc-box type="elevated" space-size="24">
            <sc-grid-row>
                <sc-grid-column xs="4">Content 1</sc-grid-column>
                <sc-grid-column xs="4">Content 2</sc-grid-column>
                <sc-grid-column xs="4">Content 3</sc-grid-column>
            </sc-grid-row>
        </sc-box>
    </sc-tab-panel>
  ```
- **Tables and Data Grids**: **MANDATORY** - Always use `<sc-data-grid>` for all tabular data designs. Study `sc-data-grid.stories.d.ts` completely for ALL available features and properties. Custom table styling is NOT permitted. NO EXCEPTIONS - even for complex hierarchical data, check documentation for appropriate properties.
- **Labels**: Use component's `label` attribute (e.g., `<sc-text-input label="Name">`, `<sc-number-input label="Name">`, `<sc-dropdown-input label="Name">`) when label appears directly above the input field. Use standalone `<sc-label>` only when the label is positioned separately from its input
- **Currency Inputs**: For input fields with currency prefixes (USD, EUR, etc.), use `sc-input-group` with nested `sc-text-input` elements:
  ```html
  <sc-input-group label="Amount (USD)" required width="100%">
      <sc-text-input value="USD" disabled></sc-text-input>
      <sc-text-input value="1,234.56"></sc-text-input>
  </sc-input-group>
  ```
  **Rules for Currency Inputs:**
  - First input contains the currency prefix (use `disabled` if it appears grayed out in design)
  - Second input contains the editable value (can be `sc-text-input`, `sc-number-input`, or `sc-dropdown-input`)
  - Label with required indicator (*) goes on the `sc-input-group`, not individual inputs

- **Alerts and Messages**: **MANDATORY** - Always use `<sc-alert type="warning|error|success|info">` for all alert/message designs. Verify `type` attribute values in `sc-alert.stories.d.ts`. Custom alert styling is NOT permitted.
- **Disabled States**: Add `disabled` attribute ONLY when Figma design explicitly shows grayed-out/inactive visual states
- **Styling Restrictions**: 
  - Use inline styles ONLY on custom HTML elements for spacing (margins, padding) with pixel values
  - NEVER add CSS classes or custom styling to SC WebKit components
  - NEVER add inline styles to SC WebKit components themselves
  - NEVER use both `disabled` and `readonly` attributes on the same component
- **Container Strategy**: Use ONE `<sc-box>` per distinct content section. Avoid nesting multiple `<sc-box>` components unless complex layouts require separate container contexts (e.g., modal within a sidebar within main content area).


## Code Generation Workflow

### File Creation Process
1. **Component Naming**: Use descriptive kebab-case names reflecting the design purpose (e.g., `user-dashboard`, `product-card`, `navigation-header`)
2. **File Structure**: Follow the standard component template exactly
3. **Registration**: Always update `src/app-page.ts` to import and register new components
4. **Dummy Data**: Include realistic sample data at the top of component files for development and testing