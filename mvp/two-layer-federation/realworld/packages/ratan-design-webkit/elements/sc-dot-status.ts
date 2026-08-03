import { ScDotStatus } from '../src/components/ScDotStatus/ScDotStatus.js';
export * from '../src/components/ScDotStatus/ScDotStatus.js';

if (!window.customElements.get('sc-dot-status')) window.customElements.define('sc-dot-status', ScDotStatus);
declare global {
  interface HTMLElementTagNameMap {
    'sc-dot-status': ScDotStatus;
  }
}
