---
name: scdevkit-webkit
description: >
  API reference for @scdevkit/webkit web components. Use this skill when working with sc-* components in Service Bench plugin projects — looking up properties, attributes, slots, or events for a specific component; choosing the right webkit component for a UI requirement; applying webkit design system tokens or CSS variables; or implementing common patterns (forms, dialogs, data grids, notifications) with LitElement and @scdevkit/webkit.
---

# SC WebKit — API Reference

This skill provides **version-accurate** component APIs by reading directly from the installed `node_modules/@scdevkit/webkit` package. It covers 95+ web components and the webkit design system.

**Use this skill when:**
- Looking up exact properties, attributes, methods, or slots for a `sc-*` component
- Choosing which webkit component fits a UI requirement
- Applying webkit design tokens or CSS variables
- Building LitElement components in a Service Bench plugin project

---

## Dynamic API Lookup

When a user asks about a specific `sc-*` component's API, follow these steps exactly.

### Step 1 — Find the project root

Identify the folder containing the active project's `package.json`. webkit is at:
```
{project-root}/node_modules/@scdevkit/webkit/
```

### Step 2 — Resolve the component's module path via custom-elements.json

The component manifest maps every tag name to its source path. Use `grep_search` on the manifest:

```
File:  {project-root}/node_modules/@scdevkit/webkit/custom-elements.json
Query: "sc-button"   ← replace with the tag name you're looking for
```

Look for the `custom-element-definition` block — it contains the `module` path:
```json
{
  "kind": "custom-element-definition",
  "name": "sc-button",
  "declaration": {
    "name": "ScButton",
    "module": "/src/components/ScButton/ScButton.js"
  }
}
```

> **Why this step matters**: Tag names do NOT map predictably to folder names.
> - `sc-text-input` → `ScFormInput/ScTextInput.js` (not `ScTextInput/`)
> - `sc-basic-layout` → `ScLayout/ScBasicLayout.js` (not `ScBasicLayout/`)
> - `sc-dialog` → `ScDialog.js` (flat file, no subdirectory)
>
> Always resolve through `custom-elements.json` — never guess.

### Step 3 — Read the TypeScript declaration file

Convert the `module` path to a `.d.ts` path:
- Strip the leading `/`
- Prepend `dist/`
- Replace `.js` with `.d.ts`

| module (from JSON) | d.ts path to read |
|--------------------|-------------------|
| `/src/components/ScButton/ScButton.js` | `dist/src/components/ScButton/ScButton.d.ts` |
| `/src/components/ScFormInput/ScTextInput.js` | `dist/src/components/ScFormInput/ScTextInput.d.ts` |
| `/src/components/ScDialog.js` | `dist/src/components/ScDialog.d.ts` |

Read:
```
{project-root}/node_modules/@scdevkit/webkit/{converted d.ts path}
```

The `.d.ts` file contains:
- JSDoc with `@attribute` names, valid values, and descriptions
- `@slot` documentation
- TypeScript property declarations with types and defaults
- Method signatures

### Step 4 — Check inherited properties (base classes)

If the class declaration shows `extends SomeBase`, check for a sibling `SomeBase.d.ts` in the same directory to find inherited properties (e.g., `ScButton extends ButtonBase` — `ButtonBase.d.ts` has `loading`, `disabled`, `size`, etc.).

### Step 5 — Event documentation

The `.d.ts` files may not include `@fires` tags. If the user needs event names and they're not in the `.d.ts`:
- Check `55313-sc-dev-web/src/components/{ComponentFolder}/` if that workspace folder is open — the `.ts` source files have complete event documentation
- Common pattern: webkit events are prefixed `sc-` (e.g., `sc-change`, `sc-select`, `sc-hide`, `sc-show`)

---

## Quick Tag→Module Reference

Most-used components and their actual module paths (from `custom-elements.json`):

| Tag | Module path (→ .d.ts) |
|-----|-----------------------|
| `sc-button` | `dist/src/components/ScButton/ScButton.d.ts` |
| `sc-icon-button` | `dist/src/components/ScIconButton/ScIconButton.d.ts` |
| `sc-text-input` | `dist/src/components/ScFormInput/ScTextInput.d.ts` |
| `sc-dropdown-input` | `dist/src/components/ScDropdown/ScDropdownInput.d.ts` |
| `sc-checkbox` | `dist/src/components/ScCheckbox/ScCheckbox.d.ts` |
| `sc-radio` | `dist/src/components/ScRadio/ScRadio.d.ts` |
| `sc-switch` | `dist/src/components/ScSwitch/ScSwitch.d.ts` |
| `sc-dialog` | `dist/src/components/ScDialog.d.ts` *(flat file)* |
| `sc-modal` | `dist/src/components/ScModal/ScModal.d.ts` |
| `sc-data-grid` | `dist/src/components/ScDataGrid/ScDataGrid.d.ts` |
| `sc-table` | `dist/src/components/ScTable/ScTable.d.ts` |
| `sc-badge` | `dist/src/components/ScBadge/ScBadge.d.ts` |
| `sc-tag` | `dist/src/components/ScTag/ScTag.d.ts` |
| `sc-alert` | `dist/src/components/ScAlert/ScAlert.d.ts` |
| `sc-toast` | `dist/src/components/ScToast/ScToast.d.ts` |
| `sc-card` | `dist/src/components/ScCard/ScCard.d.ts` |
| `sc-tab` | `dist/src/components/ScTab/ScTab.d.ts` |
| `sc-tab-group` | `dist/src/components/ScTab/ScTabGroup.d.ts` |
| `sc-pagination` | `dist/src/components/ScPagination/ScPagination.d.ts` |
| `sc-column-layout` | `dist/src/components/ScLayout/ScColumnLayout.d.ts` |
| `sc-basic-layout` | `dist/src/components/ScLayout/ScBasicLayout.d.ts` |

For any component not in this table, resolve via `custom-elements.json` (Step 2).

---

## Component Selection Guide

### Data Display
| Need | Component |
|------|-----------|
| Large dataset, sortable, paginated (server-side) | `sc-data-grid` |
| Simple tabular data | `sc-table` |
| Read-only key-value pairs | `sc-data-view` |
| Tree / hierarchical list | `sc-tree` |
| Sidebar navigation list | `sc-list-navigation` |
| Badge / count chip | `sc-badge` |
| Color status dot | `sc-dot-status` |
| Tag / closable chip | `sc-tag`, `sc-closable-tag` |
| Step progress | `sc-stepper` |
| Progress bar | `sc-progress-bar` |

### Forms & Inputs
| Need | Component |
|------|-----------|
| Single-line text | `sc-text-input` |
| Multi-line / textarea | `sc-text-input` with `multiline` attribute |
| Number | `sc-number-input` |
| Password | `sc-password-input` |
| Date picker | `sc-date-picker` |
| Date range | `sc-date-range-picker` |
| Time | `sc-time-input` |
| Dropdown select (single) | `sc-dropdown-input` |
| Dropdown multi-select | `sc-dropdown-multi-select` |
| Checkbox | `sc-checkbox`, `sc-checkbox-group` |
| Radio | `sc-radio`, `sc-radio-group` |
| Toggle / Switch | `sc-switch`, `sc-toggle` |
| Search with autocomplete | `sc-search-field` |
| File upload | `sc-file-list`, `sc-file-drop-zone` |
| Range slider | `sc-slider` |
| Star rating | `sc-rating` |
| Rich text (WYSIWYG) | `sc-rich-text-editor` |
| Grouped inputs | `sc-input-group` |

### Actions
| Need | Component |
|------|-----------|
| Primary / secondary action | `sc-button` |
| Icon-only action | `sc-icon-button` |
| Button with dropdown menu | `sc-button-dropdown` |
| Group of related buttons | `sc-button-group` |
| Context / overflow menu | `sc-menu` with `sc-menu-item` |
| Action bar (toolbar) | `sc-action-bar` |
| Copy to clipboard | `sc-copy` |

### Layout
| Need | Component |
|------|-----------|
| Page shell (header + nav + content) | `sc-basic-layout` |
| Search layout (header + filters + results) | `sc-search-layout` |
| Column-based layout (Service Bench standard) | `sc-column-layout` |
| Top navigation bar | `sc-navbar` |
| Responsive grid | `sc-grid-container` + `sc-grid-row` + `sc-grid-column` |
| Card container | `sc-card` |
| Expandable section | `sc-accordion` |
| Tab navigation | `sc-tab-group` + `sc-tab` |
| Horizontal menu bar | `sc-menu-bar` |
| Side panel / drawer | `sc-side-sheet`, `sc-draggable-side-sheet` |
| Sticky footer panel | `sc-sticky-panel` |
| Collapsible box | `sc-box` |
| Divider | `sc-divider` |
| Spacer | `sc-spacer` |

### Feedback & Overlays
| Need | Component |
|------|-----------|
| Modal dialog | `sc-dialog` |
| Icon + content modal | `sc-modal` |
| Inline message / alert | `sc-alert` |
| Site-wide banner | `sc-banner` |
| Toast (auto-dismiss) | `sc-toast` |
| Snackbar (persists until dismissed) | `sc-snackbar` |
| Tooltip on hover | `sc-tooltip` |
| Loading spinner | `sc-spinner` |
| Page skeleton loader | `sc-content-loader` |

---

## Design System

See [references/design-system.md](references/design-system.md) for the full CSS variable reference.

### Size Scale
All size attributes accept: `xxs | xs | sm | md | lg | xl | xxl`

| Token | px equivalent |
|-------|--------------|
| `xxs` | 2px |
| `xs`  | 4px |
| `sm`  | 8px |
| `md`  | 16px (default) |
| `lg`  | 24px |
| `xl`  | 32px |
| `xxl` | 40px |

### Semantic States
| State | Color | When to use |
|-------|-------|-------------|
| *(none / default)* | Blue | Primary actions, focus states |
| `error` | Red | Validation errors, destructive actions |
| `success` | Green | Confirmation, positive outcomes |
| `warning` / `alert` | Amber | Caution, non-blocking issues |

### Theme Integration
```typescript
import ScTheme from '@scdevkit/webkit/styles/ScTheme.js';

static get styles() {
  return [ScTheme.getStyles(), css`/* component styles */`];
}
```

---

## LitElement Integration Patterns

### Importing Components

Repository-specific note for this workspace:

- `service-bench.html` already imports `@scdevkit/webkit/elements` and related SB element bundles globally.
- Therefore, do not add `import '@scdevkit/webkit/elements/...` side-effect imports inside `.ts` component files in this repository.
- Use `sc-*` tags directly in Lit templates unless the task explicitly requires changing the outer HTML bootstrap.


### Property and Attribute Binding
```typescript
html`
  <!-- String attribute -->
  <sc-button type="primary" size="md">Save</sc-button>

  <!-- One-way property binding -->
  <sc-button .disabled=${this.isLoading}>Save</sc-button>

  <!-- Boolean attribute (Lit syntax) -->
  <sc-text-input ?readonly=${!this.canEdit}></sc-text-input>

  <!-- Event listener -->
  <sc-button @click=${this.handleSave}>Save</sc-button>
`
```

### Controlled Text Input
```typescript
html`
  <sc-text-input
    label="Name"
    .value=${this.name}
    .errorText=${this.errors.name ?? ''}
    ?required=${true}
    @input=${(e: InputEvent) => { this.name = (e.target as HTMLInputElement).value; }}
  ></sc-text-input>
`
```

### Confirmation Dialog / Modal
```typescript
@state() private _dialogOpen = false;

html`
  <sc-button type="primary" @click=${() => this._dialogOpen = true}>Delete</sc-button>

  <sc-modal
    label="Confirm Delete"
    ?open=${this._dialogOpen}
    @sc-hide=${() => this._dialogOpen = false}
  >
    <sc-paragraph>This action cannot be undone.</sc-paragraph>
    <div slot="footer">
      <sc-button type="secondary" @click=${() => this._dialogOpen = false}>Cancel</sc-button>
      <sc-button type="primary" state="error" @click=${this._handleConfirm}>Delete</sc-button>
    </div>
  </sc-modal>
`
```

### Data Grid (server-side pagination)
```typescript
private _columns = [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'status', header: 'Status' },
];

html`
  <sc-data-grid
    .columns=${this._columns}
    .rows=${this._rows}
    .totalCount=${this._total}
    .pageSize=${20}
    @sc-page-change=${this._handlePageChange}
    @sc-sort-change=${this._handleSortChange}
  ></sc-data-grid>
`
```

### Toast Notification
```typescript
// Dispatch a toast from anywhere in your component
private _showToast(message: string, variant: 'success' | 'error' | 'warning' = 'success') {
  const toast = Object.assign(document.createElement('sc-toast'), {
    message,
    variant,
    duration: 3000,
  });
  document.body.appendChild(toast);
  toast.show?.();
}
```

---

## Workflow

1. **Identify component** → Use the Component Selection Guide above
2. **Look up API** → Follow Dynamic API Lookup steps to read `{component}.d.ts`
3. **Check parent class** → Read base `.d.ts` for inherited properties
4. **Apply pattern** → Use LitElement patterns above as templates
5. **Style** → Apply CSS variables from [references/design-system.md](references/design-system.md)

---

## Notes & Limitations

- **Events**: `@fires` annotations are often absent from `.d.ts`. Check `55313-sc-dev-web/src/` when event names are needed.
- **CSS parts (`::part()`)**: Not documented in `.d.ts`. Inspect via browser DevTools.
- **CSS custom properties**: Not in `.d.ts`. See [references/design-system.md](references/design-system.md).
- **Installed version**: Run `cat {project-root}/node_modules/@scdevkit/webkit/package.json | grep version` to confirm the installed version.
- **Flat files**: `sc-modal` and `sc-rating` have `.d.ts` files directly under `dist/src/components/` with no subdirectory.
