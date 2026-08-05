import { Link } from './Link.js';
import { LinkEditor } from './LinkEditor.js';

if (!window.customElements.get('form-link')) {
  window.customElements.define('form-link', Link);
}
if (!window.customElements.get('form-link-editor')) {
  window.customElements.define('form-link-editor', LinkEditor);
}