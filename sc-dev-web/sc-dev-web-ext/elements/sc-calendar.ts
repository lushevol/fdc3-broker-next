import { ScCalendar } from '../src/components/ScCalendar/ScCalendar.js';
export * from '../src/components/ScCalendar/ScCalendar.js';

window.customElements.define('sc-calendar', ScCalendar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-calendar': ScCalendar
  }
}