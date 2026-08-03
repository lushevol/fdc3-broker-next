import { ScRadioCard } from '../src/components/ScCard/ScRadioCard.js';
export * from '../src/components/ScCard/ScRadioCard.js';

if (!window.customElements.get('sc-radio-card')) window.customElements.define('sc-radio-card', ScRadioCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio-card': ScRadioCard;
  }
}
