import { ScAIAgreement } from '../src/components/ScAIAgreement/ScAIAgreement.js';

export * from '../src/components/ScAIAgreement/ScAIAgreement.js';

if (!window.customElements.get('sc-ai-agreement')) {
  window.customElements.define('sc-ai-agreement', ScAIAgreement);
}