import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScLabel } from '../../src/components/ScLabel/ScLabel.js';
import '../../elements/sc-label.js';

describe('ScLabel', () => {
  it('renders label', async () => {
    const el = await fixture<ScLabel>(html`
      <sc-label required label='test'></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label label='test' required tooltip="tooltip" label-size="lg"></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label required tooltip="tooltip" label-size="xl" trustpoint></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label required tooltip="tooltip" label-size="sm"></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label required tooltip="tooltip" label-size="xxs"></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label required hint="hint" label-size="md"></sc-label>
    `);
    await fixture<ScLabel>(html`
      <sc-label required hint="hint" label-size="lg"></sc-label>
    `);

    expect(el.required).to.equal(true);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScLabel>(
      html`<sc-label label='test'></sc-label>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
