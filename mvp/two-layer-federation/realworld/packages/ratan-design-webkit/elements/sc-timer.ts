import { ScTimer } from '../src/components/ScTimer/ScTimer.js';
export * from '../src/components/ScTimer/ScTimer.js';

window.customElements.define('sc-timer', ScTimer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-timer': ScTimer;
  }
}
