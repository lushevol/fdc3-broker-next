---
name: sc-webkit-components
description: >
  Component index and API reference for @scdevkit/webkit web components. Always load this skill before generating or editing UI code in Service Bench plugin projects. Trigger on any Service Bench UI task including pages, components, forms, layouts, inputs, selectors, buttons, tables, filters, search, previews, dialogs, and interactive controls. Use this skill to choose the correct sc-* component, validate attributes/events/slots, and enforce WebKit-first implementation policy with documented fallbacks only when no equivalent exists.
---

# SC WebKit — Components

> Auto-generated from 121 story files — 113 components across 10 categories.

## How to use

This file is the entry point. Identify the category that matches the task, then read the
corresponding reference file to get full component APIs (attributes, slots, events, stories).

**Steps:**
1. Find the `sc-` tag you need in the component lists below.
2. Open the listed reference file for that category.
3. Use the attribute/slot/event tables in the reference file when implementing.

## Component Selection Policy

For Service Bench plugin UI work, WebKit components are mandatory whenever an equivalent exists.

**Use these mappings by default:**
1. Page and section titles: `sc-title`
2. Body copy, descriptions, helper text, empty states, and status text: `sc-paragraph`
3. Primary and secondary actions: `sc-button`
4. Icon-only actions: `sc-icon-button`
5. Copy-to-clipboard actions: `sc-copy`
6. Search inputs: `sc-search-field`
7. Single-line text inputs: `sc-text-input`
8. Choice controls: `sc-checkbox`, `sc-switch`, `sc-radio-group`, `sc-dropdown-input`, `sc-dropdown-multi-select`
9. Layout and page scaffolding: `sc-column-layout`, `sc-card`, `sc-box`, `sc-spacer`, `sc-divider`

**Do not default to native HTML controls** (`button`, `input`, `textarea`, `select`, `h1`-`h6`, `p`) when a suitable `sc-*` component exists. Use native tags only when the WebKit component does not cover the behavior you need or when you have a concrete API limitation and can explain the fallback.

When a native fallback is unavoidable:
1. Keep it isolated inside a small wrapper component.
2. Prefer semantic content only, not user actions.
3. Document the limitation in the implementation notes or commit message.

When a task involves a heading, paragraph, action button, search box, copy action, or form control, check the relevant reference file before writing code.

If a component choice is ambiguous, search the category reference first and prefer the most specific `sc-*` component over a generic native element.

## Mapping Clarification

The section `Component Index` is a component catalog, not an automatic mapping engine.

- `Component Selection Policy` and `Hard Rules` are the enforcement sources for generation.
- `Component Index` only tells which components exist and where to find their API docs.
- If there is any conflict, always follow `Component Selection Policy` and `Hard Rules`.

## Hard Rules (Enforced)

1. MUST use `sc-*` WebKit components whenever an equivalent exists.
2. MUST explain every native HTML fallback with a concrete API limitation.
3. NEVER introduce native interactive controls (`button`, `input`, `textarea`, `select`) when an equivalent `sc-*` component exists.
4. NEVER ship UI changes without listing which `sc-*` components were used.

## Fallback Policy (Strict)

Native fallback is allowed only when all conditions below are true:
1. No equivalent `sc-*` component exists.
2. The limitation is explicitly documented in implementation notes.
3. The fallback is isolated in a small wrapper component.
4. The fallback does not become the default choice for similar controls.

## Response Contract (Required For UI Tasks)

For any UI code generation or modification, include:
1. `WebKit components used`: list every `sc-*` component used.
2. `Native fallbacks used`: list each fallback and reason, or state `none`.
3. `Requirement mapping`: map each UI requirement to the chosen component.

## Generation Gate (Must Pass Before Final Output)

Before returning UI code, run this check:

1. Inputs: use `sc-text-input` (or `sc-search-field` for search), never native `input`.
2. Selectors: use `sc-dropdown-input` or `sc-dropdown-multi-select`, never native `select`.
3. Paragraph/body text: use `sc-paragraph`, never native `p`.
4. Labels: use `sc-label`, never native `label`.
5. Card containers: use `sc-card` when rendering card-like sections.
6. Grid layout rows/columns: use `sc-grid-row` and `sc-grid-column` where row/column structure is needed.

If any forbidden native tag appears and an `sc-*` equivalent exists, rewrite the output before finalizing.

---

## Component Index

### Business Components

Reference file: `references/sc-webkit-business.md`

Components: `sc-case-card`, `sc-customer-detail`, `sc-employee-avatar`, `sc-employee-card`, `sc-employee-grouped-avatar`, `sc-employee-input`, `sc-employee-multi-input`, `sc-employee-name`, `sc-form-editor`, `sc-form-viewer`, `sc-organisation-hierarchy`, `sc-organisation-role`

### Buttons & Actions

Reference file: `references/sc-webkit-buttons.md`

Components: `sc-button-group`, `sc-button`, `sc-copy`, `sc-icon-button`

### Content & Display

Reference file: `references/sc-webkit-content.md`

Components: `sc-avatar`, `sc-badge`, `sc-card`, `sc-check-card`, `sc-closable-tag`, `sc-date`, `sc-dot-status`, `sc-icon-card`, `sc-icon`, `sc-image-card`, `sc-label`, `sc-link-card`, `sc-list-item`, `sc-paragraph`, `sc-radio-card`, `sc-tag`, `sc-title`

### Data & Tables

Reference file: `references/sc-webkit-data.md`

Components: `sc-area-chart`, `sc-bar-chart`, `sc-bubble-chart`, `sc-data-view`, `sc-doughnut-chart`, `sc-gauge-chart`, `sc-line-chart`, `sc-pie-chart`, `sc-polar-area-chart`, `sc-rader-chart`, `sc-scatter-chart`, `sc-stacked-bar-chart`, `sc-table`

### Loaders & Progress

Reference file: `references/sc-webkit-feedback.md`

Components: `sc-content-loader`, `sc-progress-bar`, `sc-spinner`, `sc-stepper`, `sc-timer`

### Forms & Inputs

Reference file: `references/sc-webkit-forms.md`

Components: `sc-card-number-input`, `sc-checkbox-group`, `sc-checkbox`, `sc-date-input`, `sc-date-range-input`, `sc-dropdown-input`, `sc-file-input`, `sc-file-item`, `sc-file-list`, `sc-formatted-input`, `sc-input-group`, `sc-dropdown-multi-select`, `sc-number-input`, `sc-password-input`, `sc-radio-group`, `sc-rating`, `sc-repeater`, `sc-search-field`, `sc-slider`, `sc-switch`, `sc-text-input`, `sc-time-input`, `sc-toggle`

### Layout

Reference file: `references/sc-webkit-layout.md`

Components: `sc-accordion`, `sc-box`, `sc-column-layout`, `sc-divider`, `sc-grid-column`, `sc-grid-container`, `sc-grid-row`, `sc-landing-layout`, `sc-scrollbar`, `sc-search-layout`, `sc-spacer`, `sc-sticky-panel`

### Media & Editors

Reference file: `references/sc-webkit-media.md`

Components: `sc-calendar`, `sc-carousel`, `sc-doc-viewer`, `sc-document-image-viewer`, `sc-rich-text-editor-v2`, `sc-rich-text-editor-v2`, `sc-rich-text-editor`

### Navigation

Reference file: `references/sc-webkit-navigation.md`

Components: `sc-back`, `sc-bottom-navbar`, `sc-breadcrumb-item`, `sc-breadcrumb`, `sc-link`, `sc-list-navigation-item`, `sc-list-navigation`, `sc-pagination`, `sc-scroll-to-top`, `sc-tabs`

### Overlays & Feedback

Reference file: `references/sc-webkit-overlays.md`

Components: `sc-action-sheet`, `sc-alert`, `sc-banner`, `sc-bottom-sheet`, `sc-draggable-side`, `sc-modal`, `sc-side-sheet`, `sc-snackbar`, `sc-toast`, `sc-tooltip`

