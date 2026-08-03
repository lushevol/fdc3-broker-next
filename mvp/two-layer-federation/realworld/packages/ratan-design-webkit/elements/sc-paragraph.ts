import { ScParagraph } from '../src/components/ScTypography/ScParagraph.js';
export * from '../src/components/ScTypography/ScParagraph.js';

if (!window.customElements.get('sc-paragraph')) window.customElements.define('sc-paragraph', ScParagraph);

declare global {
  interface HTMLElementTagNameMap {
    'sc-paragraph': ScParagraph;
  }
}
