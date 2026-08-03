import { ScStep } from '../src/components/ScStepper/ScStep.js';
export * from '../src/components/ScStepper/ScStep.js';

if (!window.customElements.get('sc-step')) window.customElements.define('sc-step', ScStep);

declare global {
  interface HTMLElementTagNameMap {
    'sc-step': ScStep;
  }
}
