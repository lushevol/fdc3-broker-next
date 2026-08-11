import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScStickyPanel } from '../../src/components/ScPanel/ScStickyPanel.js';
import '../../elements/sc-sticky-panel.js';

describe('ScStickyPanel', () => {
  it('renders panel', async () => {
    const el = await fixture<ScStickyPanel>(
      html`<sc-sticky-panel summary='Title'>Test</sc-sticky-panel>`
    );
    fixture<ScStickyPanel>(html`<sc-sticky-panel summary='Title' open>Test</sc-sticky-panel>`);

    expect(el.open).to.equal(false);
  });

  it('renders disabled', async () => {
    const el = await fixture<ScStickyPanel>(
      html`<sc-sticky-panel summary='Title'>Test</sc-sticky-panel>`
    );
    fixture<ScStickyPanel>(html`<sc-sticky-panel summary='Title' disabled open>Test</sc-sticky-panel>`);

    expect(el.open).to.equal(false);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScStickyPanel>(
      html`<sc-sticky-panel summary='Title'>Test</sc-sticky-panel>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

});
