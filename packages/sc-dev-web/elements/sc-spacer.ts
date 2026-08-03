import { ScSpacer } from '../src/components/ScSpacer/ScSpacer.js';
export * from '../src/components/ScSpacer/ScSpacer.js';

window.customElements.define('sc-spacer', ScSpacer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-spacer': ScSpacer,
  }
}