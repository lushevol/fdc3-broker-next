import { ScProgressBar } from '../src/components/ScProgressBar/ScProgressBar.js';
export * from '../src/components/ScProgressBar/ScProgressBar.js';

window.customElements.define('sc-progress-bar', ScProgressBar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-progress-bar': ScProgressBar;
  }
}
