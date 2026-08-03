import { ScStep } from '../src/components/ScStepper/ScStep.js';
export * from '../src/components/ScStepper/ScStep.js';

window.customElements.define('sc-step', ScStep);

declare global {
  interface HTMLElementTagNameMap {
    'sc-step': ScStep,
  }
}