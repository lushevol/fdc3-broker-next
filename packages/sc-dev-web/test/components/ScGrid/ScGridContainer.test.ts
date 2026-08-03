import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScGridContainer } from '../../../src/components/ScGrid/ScGridContainer.js';
import '../../../elements/sc-grid.js';

describe('ScGridContainer', () => {
  it('renders element', async () => {
    const el = await fixture<ScGridContainer>(
      html`<sc-grid-container></sc-grid-container>`
    );

    expect(el.getAttribute('fluid')).to.equal(null);
  });

  it('renders fluid attribute', async () => {
    const el = await fixture<ScGridContainer>(
      html`<sc-grid-container fluid></sc-grid-container>`
    );

    expect(el.getAttribute('fluid')).to.equal('');
  });
});
