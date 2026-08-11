import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBox } from '../../src/components/ScBox/ScBox.js';
import '../../elements/sc-box.js';

describe('ScBox', () => {
  it('renders box', async () => {
    const el = await fixture<ScBox>(
      html`<sc-box >Test</sc-box>`
    );

    expect(el.spaceSize).to.equal('sm');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBox>(
      html`<sc-box summary='Title'>Test</sc-box>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
