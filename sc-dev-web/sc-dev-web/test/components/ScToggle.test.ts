import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScToggle } from '../../src/components/ScToggle/ScToggle.js';
import '../../elements/sc-toggle.js';

describe('ScToggle', () => {
  it('renders toggle', async () => {
    const el = await fixture<ScToggle>(html`
      <sc-toggle value="dark">
        <sc-toggle-option value="light"> Light </sc-toggle-option>
        <sc-toggle-option value="dark"> Dark </sc-toggle-option>
        <sc-toggle-option value="auto"> Auto </sc-toggle-option>
      </sc-toggle>
    `);

    expect(el.value).to.equal('dark');
  });

  it('renders toggle with different size', async () => {
    const el = await fixture<ScToggle>(html`
      <sc-toggle value="dark" size="md">
        <sc-toggle-option value="light" size="md"> Light </sc-toggle-option>
        <sc-toggle-option value="dark"> Dark </sc-toggle-option>
        <sc-toggle-option value="auto"> Auto </sc-toggle-option>
      </sc-toggle>
    `);
    el.updateSelectedOption();

    expect(el.size).to.equal('md');
  });
});
