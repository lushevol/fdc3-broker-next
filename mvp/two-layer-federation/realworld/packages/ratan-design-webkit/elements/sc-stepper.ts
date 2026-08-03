import { ScStepper } from '../src/components/ScStepper/ScStepper.js';
export * from '../src/components/ScStepper/ScStepper.js';

if (!window.customElements.get('sc-stepper')) window.customElements.define('sc-stepper', ScStepper);

declare global {
  interface HTMLElementTagNameMap {
    'sc-stepper': ScStepper;
  }
}
