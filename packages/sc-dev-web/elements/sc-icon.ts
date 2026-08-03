import { ScIcon } from '../src/components/ScIcon/ScIcon.js';
import { ScIconProvider } from '../src/components/ScIcon/ScIconProvider.js';

export * from '../src/components/ScIcon/ScIcon.js';
export * from '../src/components/ScIcon/ScIconProvider.js';

window.customElements.define('sc-icon', ScIcon);
window.customElements.define('sc-icon-provider', ScIconProvider);

declare global {
  interface HTMLElementTagNameMap {
    'sc-icon': ScIcon,
    'sc-icon-provider': ScIconProvider
  }
}
