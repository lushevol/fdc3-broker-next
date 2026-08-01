import { ScStickyPanel } from '../src/components/ScPanel/ScStickyPanel.js';
export * from '../src/components/ScPanel/ScStickyPanel.js';

window.customElements.define('sc-sticky-panel', ScStickyPanel);

declare global {
  interface HTMLElementTagNameMap {
    'sc-sticky-panel': ScStickyPanel;
  }
}
