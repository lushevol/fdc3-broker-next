import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../elements/home.js';

describe('Home', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<sb-<??= name ??>-home></sb-<??= name ??>-home>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
