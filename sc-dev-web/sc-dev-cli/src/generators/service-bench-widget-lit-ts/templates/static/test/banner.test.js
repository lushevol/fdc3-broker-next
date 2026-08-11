import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../elements/banner.js';

describe('banner', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<sb-widget-<??= name ??>-test></sb-widget-<??= name ??>-test>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
