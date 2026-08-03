import { ScScrollbar } from '../src/components/ScScrollbar/ScScrollbar.js';
export * from '../src/components/ScScrollbar/ScScrollbar.js';

if (!window.customElements.get('sc-scrollbar')) window.customElements.define('sc-scrollbar', ScScrollbar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-scrollbar': ScScrollbar;
  }
}
