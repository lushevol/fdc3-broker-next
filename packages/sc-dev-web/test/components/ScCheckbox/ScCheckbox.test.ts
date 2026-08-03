import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCheckbox } from '../../../src/components/ScCheckbox/ScCheckbox.js';
import '../../../elements/sc-checkbox.js';

describe('ScCheckbox', () => {
  it('renders default checkbox', async () => {
    const el = await fixture<ScCheckbox>(
      html`<sc-checkbox>Default</sc-checkbox>`
    );

    expect(el.innerHTML.includes('Default')).to.equal(true);
  });

  it('renders disabled checkbox', async () => {
    const el = await fixture<ScCheckbox>(
      html`<sc-checkbox disabled>Disabled</sc-checkbox>`
    );

    expect(el.disabled).to.equal(true);
  });

  it('renders checked checkbox', async () => {
    const el = await fixture<ScCheckbox>(
      html`<sc-checkbox checked>Checked</sc-checkbox>`
    );

    expect(el.checked).to.equal(true);
  });

  it('renders indeterminate checkbox', async () => {
    const el = await fixture<ScCheckbox>(
      html`<sc-checkbox indeterminate>Indeterminate</sc-checkbox>`
    );

    expect(el.indeterminate).to.equal(true);
  });

  it('renders compact checkbox', async () => {
    const el = await fixture<ScCheckbox>(
      html`<sc-checkbox compact>Compact</sc-checkbox>`
    );

    expect(el.compact).to.equal(true);
  });
});
