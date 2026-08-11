import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScGridRow } from '../../../src/components/ScGrid/ScGridRow.js';
import '../../../elements/sc-grid.js';

describe('ScGridRow', () => {
  it('renders element', async () => {
    const el = await fixture<ScGridRow>(html`<sc-grid-row></sc-grid-row>`);

    expect(el.getAttribute('no-gutters')).to.equal(null);
  });

  it('renders no-gutters attribute', async () => {
    const el = await fixture<ScGridRow>(
      html`<sc-grid-row no-gutters></sc-grid-row>`
    );

    expect(el.getAttribute('no-gutters')).to.equal('');
  });
});
