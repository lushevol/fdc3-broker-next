import { ScIcon } from '../src/components/ScIcon/ScIcon.js';
import { ScIconProvider } from '../src/components/ScIcon/ScIconProvider.js';

export * from '../src/components/ScIcon/ScIcon.js';
export * from '../src/components/ScIcon/ScIconProvider.js';

if (!window.customElements.get('sc-icon')) window.customElements.define('sc-icon', ScIcon);
if (!window.customElements.get('sc-icon-provider')) window.customElements.define('sc-icon-provider', ScIconProvider);

declare global {
  interface HTMLElementTagNameMap {
    'sc-icon': ScIcon;
    'sc-icon-provider': ScIconProvider;
  }
}
