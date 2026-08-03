# @scdevkit/webkit Design System Reference

CSS variables, color tokens, size system, and theming guide.

---

## CSS Variable Naming Convention

```
--sc-{component}-{variant?}-{element?}-{state?}-{property}
```

Examples:
```css
--sc-button-primary-hover-background-color
--sc-input-error-border-color
--sc-tag-blue-fill-text-color
--sc-card-selected-border-color
```

---

## Component CSS Variables

### Button

```css
/* Types: primary, secondary, text, link */
/* States: default, hover, press, select, disabled */
/* Semantic: error, alert, success (optional infix) */

--sc-button-primary-background-color
--sc-button-primary-hover-background-color
--sc-button-primary-press-background-color
--sc-button-primary-disabled-background-color
--sc-button-primary-text-color
--sc-button-primary-border-color

--sc-button-primary-error-background-color
--sc-button-primary-error-hover-background-color

--sc-button-secondary-background-color
--sc-button-secondary-border-color
--sc-button-secondary-text-color
--sc-button-secondary-hover-background-color
--sc-button-secondary-disabled-text-color

/* Inverse variants (for dark/colored backgrounds) */
--sc-button-primary-inverse-background-color
--sc-button-secondary-inverse-text-color
```

### Form Inputs (`sc-text-input`, `sc-dropdown-input`, etc.)

```css
--sc-input-background-color
--sc-input-border-color
--sc-input-focus-border-color
--sc-input-error-border-color
--sc-input-success-border-color
--sc-input-disabled-background-color
--sc-input-disabled-border-color
--sc-input-text-color
--sc-input-placeholder-color
--sc-input-label-color
--sc-input-error-text-color
```

### Card

```css
/* States: default, hover, selected, checked, disabled */
--sc-card-default-background-color
--sc-card-default-border-color
--sc-card-hover-background-color
--sc-card-hover-border-color
--sc-card-selected-background-color
--sc-card-selected-border-color
--sc-card-default-shadow
--sc-card-hover-shadow
```

### Alert

```css
/* Types: default, info, success, warning, error */
/* Variants: default (bordered), banner (filled) */
--sc-alert-{type}-{variant}-background-color
--sc-alert-{type}-{variant}-border-color
--sc-alert-{type}-{variant}-text-color
--sc-alert-{type}-{variant}-icon-color
```

### Tag

```css
/* Colors: blue, dark-blue, red, amber, green, grey, black, white */
/* Styles: fill, outline, link, disabled */
--sc-tag-blue-fill-background-color
--sc-tag-blue-fill-text-color
--sc-tag-blue-fill-border-color
--sc-tag-blue-outline-background-color
--sc-tag-red-fill-background-color
--sc-tag-grey-outline-text-color
```

### Badge

```css
/* Colors: blue, dark-blue, amber, green, red, grey, transparent */
/* Styles: fill, outline */
--sc-badge-{color}-{style}-background-color
--sc-badge-{color}-{style}-text-color
--sc-badge-{color}-{style}-border-color
```

### Dot Status

```css
/* Types: info, success, warning, error, minor-error, pending, draft, urgent-error, neutral */
--sc-dot-status-{type}-color
```

### Modal & Dialog

```css
/* Semantic: default, blue, green, amber, red */
--sc-modal-background-color
--sc-modal-text-color
--sc-modal-close-icon-color
--sc-modal-header-border-color
--sc-modal-footer-border-color
--sc-modal-{semantic}-background-color
--sc-modal-{semantic}-icon-color
```

### Navigation (Tabs)

```css
/* Variants: default, filled, segmented */
--sc-tab-{variant}-{state}-background-color
--sc-tab-{variant}-{state}-text-color
--sc-tab-{variant}-active-indicator-color
```

### Stepper

```css
/* States: current, incomplete, finish, error, process, disabled */
--sc-stepper-{state}-background-color
--sc-stepper-{state}-text-color
--sc-stepper-{state}-border-color
```

### Scrollbar

```css
--sc-scrollbar-track-color
--sc-scrollbar-thumb-color
--sc-scrollbar-thumb-hover-color
--sc-scrollbar-thumb-active-color
```

---

## Base Color Tokens

All component variables reference base tokens:

```css
/* Format: --sc-color-{name}-{shade} */
/* Shades: 25, 50, 100, 200, 300, 400, 450, 500, 600, 700, 800, 850, 900, 950 */

/* Blue (primary) */
--sc-color-blue-50   /* lightest */
--sc-color-blue-500  /* base */
--sc-color-blue-900  /* darkest */

/* Neutrals */
--sc-color-grey-25 through --sc-color-grey-950

/* Semantic */
--sc-color-red-50 through --sc-color-red-850    /* errors */
--sc-color-green-50 through --sc-color-green-850 /* success */
--sc-color-amber-50 through --sc-color-amber-850 /* warnings */

/* Additional */
--sc-color-orange-*, --sc-color-teal-*, --sc-color-purple-*
--sc-color-white, --sc-color-black

/* Dark mode variants */
--sc-color-blue-500-dark
--sc-color-grey-200-dark
```

---

## Size System

```typescript
type SIZE = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// rem equivalents
xxs = 0.125rem  //  2px
xs  = 0.25rem   //  4px
sm  = 0.5rem    //  8px
md  = 1rem      // 16px  ← default
lg  = 1.5rem    // 24px
xl  = 2rem      // 32px
xxl = 2.5rem    // 40px
```

Common size-related attributes: `size`, `space-size`, `radius`, `icon-size`, `text-size`

---

## Typography

```typescript
type TEXT_SIZE = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

xxs = 0.625rem  // 10px
xs  = 0.75rem   // 12px
sm  = 0.875rem  // 14px
md  = 1rem      // 16px
lg  = 1.25rem   // 20px
xl  = 1.5rem    // 24px
xxl = 2rem      // 32px
```

Components: `sc-title`, `sc-paragraph` (from `ScTypography`)

---

## Theming

### Apply Theme in a Lit Component

```typescript
import ScTheme from '@scdevkit/webkit/styles/ScTheme.js';

static get styles() {
  return [
    ScTheme.getStyles(),
    css`
      :host { color: var(--sc-input-text-color); }
    `
  ];
}
```

### Light / Dark Mode

```html
<!-- Light mode (default, applied to :root/:host) -->
<div class="sc-mode-light"> ... </div>

<!-- Dark mode -->
<div class="sc-mode-dark"> ... </div>
```

Import CSS files:
```typescript
import '@scdevkit/webkit/styles/modes/ScLightMode.css';
import '@scdevkit/webkit/styles/modes/ScDarkMode.css';
```

### Override Variables

```css
:root {
  --sc-button-primary-background-color: #your-brand-color;
}

.my-container {
  --sc-card-default-background-color: #f0f4f8;
}
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `@scdevkit/webkit/styles/ScTheme.js` | `ScTheme.getStyles()` — import into component styles |
| `@scdevkit/webkit/styles/modes/ScLightMode.css` | Light theme CSS |
| `@scdevkit/webkit/styles/modes/ScDarkMode.css` | Dark theme CSS |
| `@scdevkit/webkit/styles/util.js` | Utility functions |
