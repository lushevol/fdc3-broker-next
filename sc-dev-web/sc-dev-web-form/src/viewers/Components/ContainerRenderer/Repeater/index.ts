import { Repeater } from './Repeater.js';
import { RepeaterEditor } from './RepeaterEditor.js';

if (!window.customElements.get('form-repeater')) {
  // @ts-ignore
  window.customElements.define('form-repeater', Repeater);
}
if (!window.customElements.get('form-repeater-editor')) {
  // @ts-ignore
  window.customElements.define('form-repeater-editor', RepeaterEditor);
}
