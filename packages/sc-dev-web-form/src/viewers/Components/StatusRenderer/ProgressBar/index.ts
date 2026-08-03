import { ProgressBar } from './ProgressBar.js';
import { ProgressBarEditor } from './ProgressBarEditor.js';

if (!window.customElements.get('form-progress-bar')) {
  window.customElements.define('form-progress-bar', ProgressBar);
}
if (!window.customElements.get('form-progress-bar-editor')) {
  window.customElements.define('form-progress-bar-editor', ProgressBarEditor);
}