import { Tabs } from './Tabs.js';
import { TabsEditor } from './TabsEditor.js';

if (!window.customElements.get('form-tabs')) {
  window.customElements.define('form-tabs', Tabs);
}
if (!window.customElements.get('form-tabs-editor')) {
  window.customElements.define('form-tabs-editor', TabsEditor);
}
