import { ScDate } from '../src/components/ScDate/ScDate.js';
export * from '../src/components/ScDate/ScDate.js';

if (!window.customElements.get('sc-date')) window.customElements.define('sc-date', ScDate);

declare global {
  interface HTMLElementTagNameMap {
    'sc-date': ScDate;
  }
}
