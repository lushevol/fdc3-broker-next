---
name: sb-plugin-styling
description: >
  Complete CSS and styling guide for Service Bench plugin UI projects built with LitElement/TypeScript.
  Use this skill whenever you need to: write or fix component styles, choose the right CSS unit (rem vs px), apply design system color tokens, structure a page layout, build a header/panel/list/form pattern, handle hover/active/loading/empty states, use SbElement utility classes, or apply inline styles to sc-data-grid cells.
  Trigger on any request involving: styles, CSS, rem, layout, spacing, color token, --sc-color, background color, border color, text color, typography, padding, margin, gap, flexbox, grid, sc-column-layout, component styling, design token, utility class, SbElement, empty state, spinner container, hover state, active state, add-row form, list panel, header row, or any visual/layout task in a Service Bench plugin context.
---

# Service Bench — Plugin Styling

Service Bench plugin components use LitElement's `css` tagged template or optionally `SbElement` (from `@scdevkit/service-bench-core`) which provides a set of built-in CSS utility classes on top of LitElement.

---

## 1. Units — Always `rem`, Never `px`

All spacing, sizing, and border values must use `rem`. The font root is 16px.

| px  | rem        |
|-----|-----------|
| 1   | 0.0625rem |
| 2   | 0.125rem  |
| 3   | 0.1875rem |
| 4   | 0.25rem   |
| 8   | 0.5rem    |
| 12  | 0.75rem   |
| 16  | 1rem      |
| 20  | 1.25rem   |
| 24  | 1.5rem    |
| 32  | 2rem      |

**Exceptions**: viewport-relative sizes (`15vh`) and font sizes can use `rem` too.  
**Never** write `1px`, `8px`, `16px` etc. in `static styles`.

> ⚠️ In `sc-data-grid` cell renderers, styles are applied via inline `style="..."` strings because the cell lives in shadow DOM — inline styles only, no class-based styles. In that narrow context, `px` is acceptable because you can't reference CSS variables from outside the shadow root easily. Still prefer `rem` whenever possible.

---

## 2. Design System Color Tokens

Always use CSS custom properties (`var(--sc-color-*)`) instead of hardcoded hex values. These respect light/dark mode automatically.

### Dividers & Borders

```css
border: 0.0625rem solid var(--sc-color-grey-100);         /* standard separator */
border-bottom: 0.0625rem solid var(--sc-color-grey-50);   /* subtle row divider */
border-left: 0.1875rem solid var(--sc-color-blue-500);    /* active item accent */
```

### Backgrounds

```css
background-color: var(--sc-color-grey-25);   /* row hover state */
background-color: var(--sc-color-blue-50);   /* selected/active item */
background-color: var(--sc-color-blue-25);   /* inline add-form highlight */
background-color: var(--sc-color-red-25);    /* error/destructive highlight */
background: var(--sc-color-foundation-basic-page-base, #ffffff);       /* page bg */
background: var(--sc-color-foundation-basic-container-layer, #ffffff); /* card/panel bg */
```

### Text Colors

```css
color: var(--sc-color-grey-600);   /* secondary / label text */
color: var(--sc-color-grey-500);   /* tertiary / id/code text */
color: var(--sc-color-grey-400);   /* muted / placeholder / dash */
color: var(--sc-color-blue-600);   /* link / action text */
color: var(--sc-color-blue-750);   /* emphasis / heading link */
```

### Status / Semantic Colors

```css
color: var(--sc-color-amber-750);   /* warning indicator */
color: var(--sc-color-violet-500);  /* special state */
border: 0.0625rem solid var(--sc-color-blue-100);  /* info form border */
border: 0.0625rem solid var(--sc-color-red-100);   /* error form border */
```

---

## 3. SbElement — Built-in Utility Classes

When a component extends `SbElement` instead of `LitElement`, it gains a set of pre-defined utility classes **and** pre-wired navigation/user context consumers.

### Setup

```typescript
import { css } from 'lit';
import { SbElement } from '@scdevkit/service-bench-core';

export class MyPage extends SbElement {
  // CRITICAL: must merge this.styles to avoid overriding the base classes
  static styles = [
    SbElement.styles,   // or: (MyPage as any).styles  — same thing
    css`
      .my-container {
        padding: 1.25rem;
      }
    `
  ];

  render() {
    return html`<div class="h5 m-16">Hello</div>`;
  }
}
```

> ⚠️ If you forget `SbElement.styles` in the array, ALL built-in utility classes stop working. Always include it first.

`SbElement` also provides `this._navigationContextConsumer` and `this._userContextConsumer` for free — no need to set up `createContext` calls manually.

### Typography Classes

Apply heading styles to any element:

```html
<div class="h1">Heading 1</div>
<div class="h2">Heading 2</div>
<div class="h3">Heading 3</div>
<div class="h4">Heading 4</div>
<div class="h5">Heading 5</div>
<div class="h6">Heading 6</div>
<div class="hero">Hero text</div>
<div class="subtitle">Subtitle text</div>
```

### Text Utilities

```html
<span class="text-break">Long unbreakable text that needs wrapping</span>
<span class="text-medium">Medium weight text</span>
```

### Spacing Classes

Spacing values are in design-system units (4 = 4px = 0.25rem):

**Pattern**: `{m|p}{x|y|t|r|b|l}-{0|4|8|12|16|20|24|32|40|48|56|64|auto}`

```html
<!-- Margin -->
<div class="m-16">    <!-- margin: 1rem all sides -->
<div class="mx-24">   <!-- margin-left + margin-right: 1.5rem -->
<div class="mt-8">    <!-- margin-top: 0.5rem -->
<div class="mb-0">    <!-- margin-bottom: 0 -->

<!-- Padding -->
<div class="p-20">    <!-- padding: 1.25rem all sides -->
<div class="px-16">   <!-- padding-left + padding-right: 1rem -->
<div class="pt-12">   <!-- padding-top: 0.75rem -->
```

### Border Color Classes

Apply border with design token color in one class:

```html
<div class="border-grey-100">  <!-- border: 1px solid var(--sc-color-grey-100) -->
<div class="border-b-grey-100"> <!-- border-bottom only -->
<div class="border-t-blue-100"> <!-- border-top only -->
<div class="border-l-blue-500"> <!-- border-left only (for active indicators) -->
<div class="border-r-grey-100"> <!-- border-right only -->
```

Directional prefixes: `border-b-`, `border-t-`, `border-l-`, `border-r-`

Colors: `amber`, `blue`, `green`, `grey`, `purple`, `red`, `current`, `muted`, `primary`, `transparent`, `white`

Shades: `50` to `950` in steps of 50. Append `-dark` for dark-mode variant.

### Background Classes

```html
<div class="bg-blue-50">        <!-- selected item background -->
<div class="bg-grey-25">        <!-- hover background -->
<div class="bg-blue-25">        <!-- form highlight background -->
<div class="bg-muted">          <!-- muted surface -->
<div class="bg-white">          <!-- white surface -->
<div class="bg-transparent">    <!-- transparent -->
```

### Text Color Classes

```html
<span class="text-grey-600">Secondary text</span>
<span class="text-blue-600">Link/action text</span>
<span class="text-red-500">Error text</span>
<span class="text-muted">Muted text</span>
```

---

## 4. Common Layout Patterns

### Page Orchestrator (`:host` + wrapper)

Every page-level component should fill its entire allocated space:

```css
:host {
  display: block;
  height: 100%;
  width: 100%;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-content-area {
  flex: 1;           /* fill remaining height after header */
  overflow-y: auto;  /* scroll if content overflows */
}
```

Shared child components (not full pages) typically only need:

```css
:host {
  display: block;
  height: 100%;  /* or omit if height is driven by content */
}
```

### Header Row (action bar across the top)

```css
.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.0625rem solid var(--sc-color-grey-100);
  padding: 0.75rem 1.25rem;
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
```

Divider between back-button and title (inline style or CSS class):
```css
/* inline on a div wrapping the title */
border-left: 0.0625rem solid var(--sc-color-grey-100);
padding-left: 1rem;
```

### Tabs Bar

```css
.tabs-bar {
  display: flex;
  align-items: center;
  border-bottom: 0.0625rem solid var(--sc-color-grey-100);
  height: 3.3125rem;
}
```

### Two-Column Layout (left panel + right panel)

Always use `sc-column-layout` — never write manual flexbox for this:

```html
<sc-column-layout
  layout="Main Content Right"
  height="cover"
  left-column-size="sm"
  style="
    --sc-layout-top-offset: 0rem;
    --sc-layout-bottom-offset: 0rem;
    --sc-layout-right-offset: 0rem;
    --sc-layout-left-offset: 0rem;
    --sc-layout-grid-column-padding-x: 0rem;
  "
>
  <div slot="left" class="left"><!-- left panel content --></div>
  <div slot="right" class="right"><!-- right panel content --></div>
</sc-column-layout>
```

Border between the two panels — use `::part` to style the internal columns:
```css
/* Right panel has a left border */
sc-column-layout::part(right-column) {
  border-left: 0.0625rem solid var(--sc-color-grey-100);
}

/* Left panel has a right border */
sc-column-layout::part(left-column) {
  border-right: 0.0625rem solid var(--sc-color-grey-100);
}
```

Remove default padding that `sc-column-layout` adds to its slots:
```css
.left  { padding: 0; }
.right { padding: 0; }
```

---

## 5. Panel & List Patterns

### Left Panel — scrollable list

```css
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-container {
  padding: 0.75rem 1rem;
  border-bottom: 0.0625rem solid var(--sc-color-grey-100);
}

.list-container {
  flex: 1;
  overflow-y: auto;
}
```

### Selectable List Item

```css
.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 0.0625rem solid var(--sc-color-grey-50);
  transition: background-color 0.15s ease;
}

.list-item:hover {
  background-color: var(--sc-color-grey-25);
}

.list-item.active {
  background-color: var(--sc-color-blue-50);
  border-left: 0.1875rem solid var(--sc-color-blue-500);
}
```

In the template — toggle the `active` class based on selected state:
```typescript
class="list-item ${this.selectedId === item.id ? 'active' : ''}"
```

### Right Panel — sectioned content

```css
.metadata-section {
  padding: 1.25rem;
  border-bottom: 0.0625rem solid var(--sc-color-grey-100);
}

.metadata-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Full-width item spanning both columns */
.full-width-item {
  grid-column: 1 / -1;
}

.data-section {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
}
```

---

## 6. Form & Input Highlight Patterns

### Inline Add-Row Form

```css
.add-row-form {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--sc-color-blue-25);
  border: 0.0625rem solid var(--sc-color-blue-100);
  border-radius: 0.5rem;
}

.add-row-field {
  flex: 1;
}

.add-row-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-bottom: 0.125rem;  /* optical alignment with text inputs */
}
```

### Error Highlight Form

```css
.error-form {
  background-color: var(--sc-color-red-25);
  border: 0.0625rem solid var(--sc-color-red-100);
  border-bottom: 0.0625rem solid var(--sc-color-red-100);
  border-radius: 0.5rem;
}
```

---

## 7. Loading & Empty State Containers

Use vertical margin in `vh` units to visually center the spinner/empty content on screen:

```css
.spinner-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 15vh;
  margin-bottom: 15vh;
}
```

In the template:
```html
${this.isLoading
  ? html`<div class="spinner-container">
      <sc-spinner type="page" size="md"></sc-spinner>
    </div>`
  : this.items.length === 0
    ? html`<div class="empty-container">
        <sb-my-plugin-empty-state text="No items found"></sb-my-plugin-empty-state>
      </div>`
    : html`<!-- actual content -->`
}
```

Suppress the page title / header when data is empty or loading — don't show a half-rendered header with no content below it.

---

## 8. Content Section Patterns

### Card Info Section (metadata + label/value)

```css
.info-container {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 1.25rem;
  gap: 1rem;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
```

Use `<sc-label>` + `<sc-paragraph>` for label/value pairs:

```html
<div class="info-field">
  <sc-label label="Status" label-size="md"></sc-label>
  <sc-paragraph size="md">Active</sc-paragraph>
</div>
```

### Comment / Activity Feed Item

```css
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.item-entry {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1rem;
  border-bottom: 0.0625rem solid var(--sc-color-grey-100);
}

.item-entry:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-header {
  display: flex;
  align-items: center;
}

.item-body {
  margin-left: 3rem;    /* indent under the avatar/icon */
}

.item-meta {
  margin-left: 3rem;
  color: var(--sc-color-grey-600);
}
```

---

## 9. sc-data-grid Cell Styling

Grid cell renderers live inside shadow DOM. Regular CSS classes don't apply inside cells — **use inline styles only**:

```typescript
const columns = [
  {
    property: 'status',
    header: 'Status',
    flex: 0.5,
    cellRenderer: (params: any) => html`
      <span style="color: var(--sc-color-blue-600); font-weight: 500;">
        ${params.data.status}
      </span>
    `,
  },
  {
    property: 'name',
    header: 'Name',
    flex: 1,
    editable: true,
  },
];
```

Common inline style values for grid cells:
```
color: var(--sc-color-grey-400)   /* for dash/empty value */
color: var(--sc-color-blue-600)   /* for link-style text */
display: flex; align-items: center; gap: 0.5rem;   /* for icon + text cells */
height: 1rem; width: 1rem; border-radius: 50%; object-fit: cover;  /* avatar */
```

**Avoid** `.getRowHeight` on grids that contain dropdown inputs — the dropdown gets clipped.

---

## 10. Controlling Internal Events

Design system components (`sc-*`) often dispatch `sc-close`, `sc-select`, etc. that bubble up and can interfere with parent logic. Stop them at the page orchestrator boundary:

```typescript
connectedCallback() {
  super.connectedCallback();
  const stopLeaking = (e: Event) => e.stopPropagation();
  this.addEventListener('sc-close', stopLeaking);
  this.addEventListener('sc-select', stopLeaking);
}
```

---

## 11. Common Pitfalls

| ❌ Wrong | ✅ Right |
|---|---|
| `border: 1px solid #d9d9d9` | `border: 0.0625rem solid var(--sc-color-grey-100)` |
| `padding: 16px` | `padding: 1rem` |
| `gap: 8px` | `gap: 0.5rem` |
| `color: #595959` | `color: var(--sc-color-grey-700)` |
| Manual flexbox for two-column layout | `sc-column-layout` with `::part(left-column)` border |
| `static styles = css\`...\`` in an `SbElement` subclass | `static styles = [SbElement.styles, css\`...\`]` |
| Forgetting `SbElement.styles` in the array | Always merge base styles first — missing it disables ALL utility classes |
| CSS class on `sc-data-grid` cell content | Inline `style="..."` — cells are in shadow DOM |
