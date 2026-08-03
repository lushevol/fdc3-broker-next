import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScContentLoader } from '../../src/components/ScLoader/ScContentLoader.js';
import '../../elements/sc-content-loader.js';

describe('ScContentLoader', () => {
  it('renders content loader', async () => {
    const el = await fixture<ScContentLoader>(
      html`<sc-content-loader class='sc-content-loader'></sc-content-loader>`
    );
    await fixture<ScContentLoader>(
      html`<sc-content-loader radius='lg' pill></sc-content-loader>`
    );
    await fixture<ScContentLoader>(
      html`<sc-content-loader radius='md' square></sc-content-loader>`
    );
    await fixture<ScContentLoader>(
      html`<sc-content-loader radius='xs' circle></sc-content-loader>`
    );
    await fixture<ScContentLoader>(
      html`<sc-content-loader rectangle></sc-content-loader>`
    );
    await fixture<ScContentLoader>(
      html`<sc-content-loader radius='xxs'></sc-content-loader>`
    );

    expect(el.tagName.toLowerCase()).to.equal('sc-content-loader');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScContentLoader>(
      html`<sc-content-loader></sc-content-loader>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
