import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSwitch } from '../../src/components/ScSwitch/ScSwitch.js';
import '../../elements/sc-switch.js';

describe('ScSwitch', () => {
  it('renders default switch', async () => {
    const el = await fixture<ScSwitch>(html`<sc-switch label='test' value='test'></sc-switch>`);
    const el1 = await fixture<ScSwitch>(html`
      <sc-switch disabled checked label-position='right' help-text='test'></sc-switch>`);
    await el.click();
    await el.focus();
    await el.blur();
    await el1.click();
    await el1.focus();
    await el1.blur();

    expect(el.disabled).to.equal(false);
  });

  it('renders readonly switch', async () => {
    const el = await fixture<ScSwitch>(html`<sc-switch label='test' value='test' readonly></sc-switch>`);
    expect(el.disabled).to.equal(false);
  });

  it('renders text label switch', async () => {
    const el = await fixture<ScSwitch>(html`<sc-switch label='test' value='test' text-icon-label='text-label'></sc-switch>`);
    const el1 = await fixture<ScSwitch>(html`
      <sc-switch label='test' value='test' text-icon-label='icon-label'></sc-switch>`);
    await el.click();
    await el.focus();
    await el.blur();
    await el1.click();
    await el1.focus();
    await el1.blur();

    expect(el.disabled).to.equal(false);
  });
});
