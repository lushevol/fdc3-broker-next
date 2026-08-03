import { ScChat } from '../src/components/ScChat/ScChat.js';

export * from '../src/components/ScChat/ScChat.js';

if (!window.customElements.get('sc-chat')) {
  window.customElements.define('sc-chat', ScChat);
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-chat': ScChat;
  }
}
