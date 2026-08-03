import { ScDotStatus } from '../src/components/ScDotStatus/ScDotStatus.js';
export * from '../src/components/ScDotStatus/ScDotStatus.js';

window.customElements.define('sc-dot-status', ScDotStatus);
declare global {
  interface HTMLElementTagNameMap {
    'sc-dot-status': ScDotStatus
  }
}