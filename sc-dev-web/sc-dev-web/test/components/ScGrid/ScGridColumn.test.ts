import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScGridColumn } from '../../../src/components/ScGrid/ScGridColumn.js';
import '../../../elements/sc-grid.js';

describe('ScGridColumn', () => {
  it('renders element', async () => {
    const el = await fixture<ScGridColumn>(
      html`<sc-grid-column></sc-grid-column>`
    );

    expect(el.getAttribute('xxl')).to.equal(null);
    expect(el.getAttribute('xl')).to.equal(null);
    expect(el.getAttribute('lg')).to.equal(null);
    expect(el.getAttribute('md')).to.equal(null);
    expect(el.getAttribute('sm')).to.equal(null);
  });

  it('renders layout', async () => {
    const el = await fixture<ScGridColumn>(
      html`<sc-grid-column xl="3" md="6"></sc-grid-column>`
    );
    expect(el.getAttribute('xl')).to.equal('3');
    expect(el.getAttribute('md')).to.equal('6');
  });
});
