# Copilot Code Generation Guide for Web Component UI Library

This markdown file provides instructions and examples to help GitHub Copilot generate code for this UI library, which is built using Web Components. Use this as a reference for creating new components, updating existing ones, or generating documentation and usage examples.

## Project Overview
- **Framework:** Web Components (Lit, Custom Elements)
- **Language:** TypeScript
- **Component Location:** `elements/` directory
- **Demo Pages:** `demo/` directory

## Component Structure
Each component should:
- Be defined as a class extending `LitElement` or `HTMLElement`.
- Use decorators (e.g., `@customElement`, `@property`) if using Lit.
- Export the class as default or named export.
- Include a template (render method for Lit, or shadow DOM for vanilla).
- Support properties, events, and slots as needed.

### Example: Lit-based Component
```ts
import { LitElement, html, css, property, customElement } from 'lit-element';

@customElement('sc-example')
export class ScExample extends LitElement {
  @property({ type: String }) label = 'Default';

  static styles = css`
    :host { display: block; }
  `;

  render() {
    return html`<div>{{label}}</div>`;
  }
}
```

### Example: Vanilla Web Component
```ts
class ScVanilla extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<span>Hello, world!</span>`;
  }
}
customElements.define('sc-vanilla', ScVanilla);
```

## Usage Example (HTML)
```html
<sc-example label="Hello Copilot!"></sc-example>
```

## Guidelines for Copilot
- Place new components in the `elements/` directory.
- Use TypeScript for all new code.
- Follow the naming convention: `sc-<component-name>.ts`.
- Add demo usage in `demo/` if creating a new component.
- Export all public APIs (properties, methods, events) in JSDoc comments.
- Use LitElement for new components unless vanilla is required.

## Documentation
- Add a section in this file for each new component with usage and API.
- Update `custom-elements.json` if needed for documentation tools.

---

_This file is intended to guide Copilot and developers in generating consistent, high-quality code for this Web Component UI library._
