import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/app-<??= name ??>.js';

describe('ScWebkitBasicLit', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<app-<??= name ??>></app-<??= name ??>>`);
  });

  it('renders a h1', () => {
    const scButton = element.shadowRoot.querySelector('sc-button');
    expect(scButton).to.exist;
    expect(scButton.textContent).to.equal('View components');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
