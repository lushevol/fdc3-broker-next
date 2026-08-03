import { ScTag } from '../src/components/ScTag/ScTag.js';
import { ScClosableTag } from '../src/components/ScTag/ScClosableTag.js';
export * from '../src/components/ScTag/ScTag.js';
export * from '../src/components/ScTag/ScClosableTag.js';

if (!window.customElements.get('sc-tag')) window.customElements.define('sc-tag', ScTag);
if (!window.customElements.get('sc-closable-tag')) window.customElements.define('sc-closable-tag', ScClosableTag);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tag': ScTag;
    'sc-closable-tag': ScClosableTag;
  }
}
