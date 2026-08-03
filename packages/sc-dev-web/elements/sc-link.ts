import { ScLink } from '../src/components/ScLink/ScLink.js';
export * from '../src/components/ScLink/ScLink.js';

window.customElements.define('sc-link', ScLink);

declare global {
  interface HTMLElementTagNameMap {
    'sc-link': ScLink,
  }
}