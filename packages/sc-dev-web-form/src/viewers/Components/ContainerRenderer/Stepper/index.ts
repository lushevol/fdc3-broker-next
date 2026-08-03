import { Stepper } from './Stepper.js';
import { StepperEditor } from './StepperEditor.js';

if (!window.customElements.get('form-stepper')) {
  window.customElements.define('form-stepper', Stepper);
}
if (!window.customElements.get('form-stepper-editor')) {
  window.customElements.define('form-stepper-editor', StepperEditor);
}
