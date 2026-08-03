import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScInputGroup } from '../../src/components/ScInputGroup/ScInputGroup.js';
import '../../elements/sc-input-group.js';
import '../../elements/sc-text-input.js';
import '../../elements/sc-label.js';
import '../../elements/sc-divider.js';

describe('ScInputGroup', () => {
  it('renders input group', async () => {
    const el = await fixture<ScInputGroup>(html`
      <sc-input-group label="title"
        ><sc-label slot='label' label='test'></sc-label><sc-text-input></sc-text-input>
        <sc-text-input error width='60%'></sc-text-input>
        <sc-text-input success width='40%'></sc-text-input>
        <sc-text-input width='40%'></sc-text-input>
        <sc-divider></sc-divider></sc-input-group
      >
    `);
    await fixture<ScInputGroup>(html`
      <sc-input-group label="title" width="60%"
        >
        <sc-text-input error width='60%'></sc-text-input>
      </sc-input-group
      >
    `);

    expect(el.width).to.equal('100%');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScInputGroup>(
      html`<sc-input-group label="test"><sc-text-input></sc-text-input></sc-input-group>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
