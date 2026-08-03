---
name: sb-i18n
description: >
  Internationalization (i18n) guide for Service Bench plugin UI components.
  Use this skill whenever a user asks about: adding i18n, internationalization, multi-language support, locale, translations, translate labels/text/strings, msg(), createLocaleContext, language files, zh-CN, Chinese/English support, or wants user-visible text to be localizable in a plugin component. Trigger on any request involving: add i18n, support multiple languages, localize text, translate my component, set up locale, createLocaleContext, i18n setup, msg() function, language key-value files, or adding Chinese/Japanese/French etc. support to a Service Bench plugin UI built with LitElement and TypeScript.
---

# Service Bench — Plugin i18n

## Overview

Service Bench plugin UIs use a **context-based locale system** powered by `createLocaleContext()` from `@scdevkit/service-bench-core`. Each component subscribes to the current locale and retrieves translated strings via `msg(key, defaultValue)`.

The locale is driven by the user's preference settings at the platform level — plugins do not need to manage language switching themselves. Components simply call `msg()` and the correct language is resolved automatically.

---

## File Structure

Every plugin that needs i18n creates an `i18n/` directory, typically inside `src/`:

```
src/
└── i18n/
    ├── en.js         ← English translations (the source of truth)
    ├── zh-CN.js      ← Simplified Chinese translations
    └── index.js      ← Aggregator — exports { locale }
```

You can add more language files alongside these (e.g. `ja.js`, `fr.js`) following the same pattern.

---

## Language File Format

Language files are plain ES modules that export a flat object of key-value pairs. Use camelCase keys and group them by feature or section for readability.

**`src/i18n/en.js`**
```js
export default {
  pageTitle: 'My Page',
  saveButton: 'Save',
  cancelButton: 'Cancel',
  loadingMessage: 'Loading...',
  errorMessage: 'Something went wrong',
  confirmDeleteTitle: 'Confirm Delete',
  confirmDeleteBody: 'Are you sure you want to delete this item?',
};
```

**`src/i18n/zh-CN.js`**
```js
export default {
  pageTitle: '我的页面',
  saveButton: '保存',
  cancelButton: '取消',
  loadingMessage: '加载中...',
  errorMessage: '发生错误',
  confirmDeleteTitle: '确认删除',
  confirmDeleteBody: '您确定要删除此项目吗？',
};
```

Every key in `en.js` should also appear in each other language file. The `msg()` fallback covers missing keys gracefully — it returns the English default — but it's good practice to keep them in sync.

---

## Aggregator (`src/i18n/index.js`)

The `index.js` file imports all language files and assembles them into the shape expected by `createLocaleConsumer`:

```js
import en from './en.js';
import zhCN from './zh-CN.js';

const languages = {
  en,
  'zh-CN': zhCN,
};

const locale = {
  languages,
};

export { locale };
export default { locale };
```

To add a new language (e.g. Japanese), create `ja.js`, import it here, and add `ja` to the `languages` object.

---

## Component Setup

### 1. Import and create the locale context at **module level** (outside the class)

The context must be created once per module, not inside the constructor or class body. Creating it inside a class or lifecycle method breaks the context subscription.

```typescript
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { SbElement, createLocaleContext } from '@scdevkit/service-bench-core';
import { locale } from '../i18n/index.js';

// ✅ Module level — outside the class
const localeContext = createLocaleContext();

@customElement('my-plugin-component')
export class MyPluginComponent extends SbElement {
  // ...
}
```

### 2. Declare the locale consumer as a class field

Pass `locale.languages` and `this` to `createLocaleConsumer`. This subscribes the component to locale changes and triggers re-render when the user's language changes.

```typescript
@customElement('my-plugin-component')
export class MyPluginComponent extends SbElement {
  private _localeConsumer = localeContext.createLocaleConsumer(locale.languages, this);

  // Optional: getter for cleaner access in class methods
  private get _msg() {
    return this._localeConsumer.msg;
  }
}
```

### 3. Use `msg()` for all user-visible text

In `render()`, destructure `msg` from the consumer, then call `msg(key, defaultValue)` for every translated string:

```typescript
render() {
  const { msg } = this._localeConsumer;

  return html`
    <div class="page-container">
      <h1>${msg('pageTitle', 'My Page')}</h1>

      <sc-button @click=${this._handleSave}>
        ${msg('saveButton', 'Save')}
      </sc-button>

      <sc-button variant="secondary" @click=${this._handleCancel}>
        ${msg('cancelButton', 'Cancel')}
      </sc-button>
    </div>
  `;
}
```

When using `msg` in class methods (not in render), use the getter pattern:

```typescript
private _handleError() {
  this._showToast({
    type: 'error',
    title: this._msg('errorMessage', 'Something went wrong'),
  });
}
```

---

## `msg()` Reference

```typescript
msg(key: string, defaultValue: string): string
```

| Parameter | Description |
|-----------|-------------|
| `key` | Property name from the language file — must match exactly |
| `defaultValue` | Shown if the key is missing or locale is not yet loaded. Use English. |

`msg()` never throws — it always returns a string. The fallback chain is:
1. Current locale's translation for `key`
2. `defaultValue` if the key is missing or locale is unavailable

**Always provide `defaultValue`** — it serves as the English text and as documentation for what the key means.

---

## Getting the Current Language

If you need to know which locale is active (e.g. to conditionally format dates or numbers):

```typescript
const currentLanguage = this._localeConsumer.value.getCurrentLanguage();
// Returns a BCP-47 locale string, e.g. 'en' or 'zh-CN'
```

---

## Adding a New Language

1. Create the new language file (e.g. `src/i18n/ja.js`) with the same keys as `en.js`
2. Import it and register it in `src/i18n/index.js`:

```js
import en from './en.js';
import zhCN from './zh-CN.js';
import ja from './ja.js';  // ← new

const languages = {
  en,
  'zh-CN': zhCN,
  ja,               // ← new
};

const locale = { languages };
export { locale };
export default { locale };
```

No changes are needed in the component — `msg()` will automatically resolve to the new language once the platform switches the locale.

---

## Complete Example

```typescript
// src/components/my-page/MyPage.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SbElement, createLocaleContext } from '@scdevkit/service-bench-core';
import { locale } from '../../i18n/index.js';

const localeContext = createLocaleContext();

@customElement('my-plugin-page')
export class MyPluginPage extends SbElement {
  static styles = css`
    .page { padding: var(--sc-spacing-16); }
  `;

  private _localeConsumer = localeContext.createLocaleConsumer(locale.languages, this);

  private get _msg() {
    return this._localeConsumer.msg;
  }

  @state() private _loading = false;

  private async _handleSave() {
    this._loading = true;
    try {
      await this._saveData();
      this._showToast({ type: 'success', title: this._msg('saveSuccess', 'Saved successfully!') });
    } catch {
      this._showToast({ type: 'error', title: this._msg('saveError', 'Save failed. Please try again.') });
    } finally {
      this._loading = false;
    }
  }

  render() {
    const { msg } = this._localeConsumer;

    return html`
      <div class="page">
        <h2>${msg('pageTitle', 'My Page')}</h2>

        ${this._loading
          ? html`<sc-loading>${msg('loadingMessage', 'Loading...')}</sc-loading>`
          : html`
            <sc-button @click=${this._handleSave}>
              ${msg('saveButton', 'Save')}
            </sc-button>
            <sc-button variant="secondary" @click=${this._handleCancel}>
              ${msg('cancelButton', 'Cancel')}
            </sc-button>
          `
        }
      </div>
    `;
  }
}
```

---

## Common Pitfalls

| ❌ Don't do this | ✅ Do this instead |
|------------------|-------------------|
| `html\`<h1>My Page</h1>\`` | `html\`<h1>${msg('pageTitle', 'My Page')}</h1>\`` |
| `createLocaleContext()` inside the class | `createLocaleContext()` at module level, outside the class |
| `import { msg } from '@lit/localize'` | `const { msg } = this._localeConsumer` — the @lit/localize msg() is for the design system, not plugins |
| `msg('saveButton')` (missing default) | `msg('saveButton', 'Save')` — always provide the fallback |
| One giant language file for the whole plugin | Flat key-value files per language in `src/i18n/` |

---

## Key Naming Conventions

- Use **camelCase** for all keys: `saveButton`, `pageTitle`, `errorMessage`
- Make keys **descriptive and specific**: prefer `confirmDeleteTitle` over `deleteTitle` or `title`
- Group related keys with a **common prefix** when working with a large set: `filter_status`, `filter_date`, `filter_reset`
- Avoid abbreviations in keys — they'll be used across the codebase for a long time
