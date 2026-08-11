import { html, fixture, expect } from '@open-wc/testing';
import { ScAIAgreement } from '../../../src/components/ScAIAgreement/ScAIAgreement.js';
import '../../../elements/sc-ai-agreement.js';

describe('ScAIAgreement', () => {
  it('renders the component with default properties', async () => {
    const el = await fixture<ScAIAgreement>(
      html`<sc-ai-agreement></sc-ai-agreement>`,
      { scopedElements: { 'sc-ai-agreement': ScAIAgreement } }
    );

    expect(el).to.be.instanceOf(ScAIAgreement);
  });

  it('renders the component with default slot', async () => {
    const el = await fixture<ScAIAgreement>(
      html`<sc-ai-agreement>link</sc-ai-agreement>`,
      { scopedElements: { 'sc-ai-agreement': ScAIAgreement } }
    );

    expect(el).to.be.instanceOf(ScAIAgreement);
  });

  it('renders the component with content slot', async () => {
    const el = await fixture<ScAIAgreement>(
      html`<sc-ai-agreement>
        <div slot="content">agreement content</div>
      </sc-ai-agreement>`,
      { scopedElements: { 'sc-ai-agreement': ScAIAgreement } }
    );

    expect(el).to.be.instanceOf(ScAIAgreement);
  });

  it('details button is clicked', async () => {
    const el = await fixture<ScAIAgreement>(
      html`<sc-ai-agreement></sc-ai-agreement>`,
      { scopedElements: { 'sc-ai-agreement': ScAIAgreement } }
    );
    await el.updateComplete;
    const agreeButton = el.shadowRoot?.querySelector('sc-link');
    expect(agreeButton).to.exist;
    agreeButton?.dispatchEvent(new Event('click', { bubbles: true }));
  });
});

