import { ScBadge } from '../src/components/ScBadge/ScBadge.js';
export * from '../src/components/ScBadge/ScBadge.js';

window.customElements.define('sc-badge', ScBadge);
declare global {
  interface HTMLElementTagNameMap {
    'sc-badge': ScBadge
  }
}