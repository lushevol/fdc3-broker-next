import { ScColumnLayout } from '../src/components/ScLayout/ScColumnLayout.js';
export * from '../src/components/ScLayout/ScColumnLayout.js';

if (!window.customElements.get('sc-column-layout')) window.customElements.define('sc-column-layout', ScColumnLayout);

declare global {
  interface HTMLElementTagNameMap {
    'sc-column-layout': ScColumnLayout;
  }
}
