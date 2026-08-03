import { ScAvatar } from '../src/components/ScAvatar/ScAvatar.js';
export * from '../src/components/ScAvatar/ScAvatar.js';

window.customElements.define('sc-avatar', ScAvatar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-avatar': ScAvatar
  }
}