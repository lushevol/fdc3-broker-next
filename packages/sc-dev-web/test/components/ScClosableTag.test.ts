import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScClosableTag } from '../../src/components/ScTag/ScClosableTag.js';
import '../../elements/sc-tag.js';

describe('ScClosableTag', () => {
  it('renders default tag', async () => {
    const el = await fixture<ScClosableTag>(html`<sc-closable-tag />`);
    const slTag: any = el.renderRoot.querySelector('sl-tag');
    expect(slTag?.removable).to.equal(true);
  });

  it('renders tag', async () => {
    const el = await fixture<ScClosableTag>(html`<sc-closable-tag />`);

    await fixture<ScClosableTag>(html`<sc-closable-tag type='primary' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='success' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='warning' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='error' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='transparent' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='blue' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='dark-blue' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='red' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='amber' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='green' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='black' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='white' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey-dash' />`);

    await fixture<ScClosableTag>(html`<sc-closable-tag type='primary' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='success' mode='filled'/>`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='warning' mode='filled'/>`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='error' mode='filled'/>`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='transparent' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='blue' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='dark-blue' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='red' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='amber' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='green' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='black' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='white' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey-dash' mode='filled' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='filled' />`);

    await fixture<ScClosableTag>(html`<sc-closable-tag type='primary' disabled/>`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='success' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='warning' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='error' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='transparent' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='blue' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='dark-blue' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='red' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='amber' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='green' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='black' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='white' disabled />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag type='grey-dash' disabled />`);

    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='primary' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='success' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='warning' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='error'  />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='transparent' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='blue' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='dark-blue' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='red' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='amber' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='green' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='grey' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='black' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='white' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='grey-dash' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' />`);
    await fixture<ScClosableTag>(html`<sc-closable-tag mode='alternate' type='transparent'  disabled/>`);

    const slTag: any = el.renderRoot.querySelector('sl-tag');
    expect(slTag?.removable).to.equal(true);
  });
});
