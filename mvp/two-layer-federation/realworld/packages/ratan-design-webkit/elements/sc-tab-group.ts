import { ScTab } from '../src/components/ScTab/ScTab.js';
import { ScTabGroup } from '../src/components/ScTab/ScTabGroup.js';
import { ScTabPanel } from '../src/components/ScTab/ScTabPanel.js';
import { ScTabDivider } from '../src/components/ScTab/ScTabDivider.js';
export * from '../src/components/ScTab/ScTab.js';
export * from '../src/components/ScTab/ScTabGroup.js';
export * from '../src/components/ScTab/ScTabPanel.js';
export * from '../src/components/ScTab/ScTabDivider.js';

if (!window.customElements.get('sc-tab-group')) window.customElements.define('sc-tab-group', ScTabGroup);
if (!window.customElements.get('sc-tab')) window.customElements.define('sc-tab', ScTab);
if (!window.customElements.get('sc-tab-panel')) window.customElements.define('sc-tab-panel', ScTabPanel);
if (!window.customElements.get('sc-tab-divider')) window.customElements.define('sc-tab-divider', ScTabDivider);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tab-group': ScTabGroup;
    'sc-tab': ScTab;
    'sc-tab-panel': ScTabPanel;
    'sc-tab-divider': ScTabDivider;
  }
}
