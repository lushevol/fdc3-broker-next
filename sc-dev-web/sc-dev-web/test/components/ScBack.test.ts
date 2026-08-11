import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBack } from '../../src/components/ScBack/ScBack.js';
import '../../elements/sc-back.js';

describe('ScBack', () => {
  it('renders back', async () => {
    const el = await fixture<ScBack>(html`<sc-back></sc-back>`);

    expect(el.to).to.equal('#');
  });

  it('renders back with custom label', async () => {
    const el = await fixture<ScBack>(html`<sc-back label="test"></sc-back>`);

    expect(el.to).to.equal('#');
  });

  it('renders back with history mode', async () => {
    const el = await fixture<ScBack>(html`<sc-back mode="history" label="test" disabled></sc-back>`);
    el.dispatchEvent(new MouseEvent('click'));

    expect(el.to).to.equal('#');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBack>(html`<sc-back></sc-back>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
