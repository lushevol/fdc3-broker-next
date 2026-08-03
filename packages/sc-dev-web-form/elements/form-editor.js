import { FormEditor } from '../src/viewers/FormEditor/index';

if (!window.customElements.get('sc-form-editor')) {
  window.customElements.define('sc-form-editor', FormEditor);
}