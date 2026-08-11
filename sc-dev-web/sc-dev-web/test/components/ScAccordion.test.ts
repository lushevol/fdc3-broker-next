import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScAccordion } from '../../src/components/ScAccordion/ScAccordion.js';
import '../../elements/sc-accordion.js';

describe('ScAccordion', () => {
  it('renders panel', async () => {
    const el = await fixture<ScAccordion>(
      html`<sc-accordion summary='Title'>Test</sc-accordion>`
    );
    fixture<ScAccordion>(html`<sc-accordion summary='Title' open>Test</sc-accordion>`);

    expect(el.open).to.equal(false);
  });

  it('renders disabled', async () => {
    const el = await fixture<ScAccordion>(
      html`<sc-accordion summary='Title'>Test</sc-accordion>`
    );
    fixture<ScAccordion>(html`<sc-accordion summary='Title' disabled icon-position="left" open>Test</sc-accordion>`);

    expect(el.open).to.equal(false);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScAccordion>(
      html`<sc-accordion summary='Title'>Test</sc-accordion>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

});
