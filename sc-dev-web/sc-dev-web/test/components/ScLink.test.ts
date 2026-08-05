import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScLink } from '../../src/components/ScLink/ScLink.js';
import '../../elements/sc-link.js';

describe('ScLink', () => {
  it('renders default link', async () => {
    const el = await fixture<ScLink>(html`<sc-link></sc-link>`);

    expect(el.disabled).to.equal(false);
  });

  it('renders inline link', async () => {
    const el = await fixture<ScLink>(html`<sc-link block></sc-link>`);

    expect(el.block).to.equal(true);
  });

  it('renders inverse link', async () => {
    const el = await fixture<ScLink>(html`<sc-link inverse prevent-default-link></sc-link>`);

    expect(el.inverse).to.equal(true);
  });

  it('renders href', async () => {
    const el = await fixture<ScLink>(
      html`<sc-link href="http://www.google.com" prevent-default-link></sc-link>`
    );

    expect(el.href).to.equal('http://www.google.com');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScLink>(html`<sc-link></sc-link>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
