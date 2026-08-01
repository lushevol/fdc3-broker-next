import { ScDate } from '../src/components/ScDate/ScDate.js';
export * from '../src/components/ScDate/ScDate.js';

window.customElements.define('sc-date', ScDate);

declare global {
  interface HTMLElementTagNameMap {
    'sc-date': ScDate;
  }
}
