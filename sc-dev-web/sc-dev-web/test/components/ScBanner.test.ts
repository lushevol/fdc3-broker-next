import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBanner } from '../../src/components/ScBanner/ScBanner.js';
import '../../elements/sc-banner.js';

describe('ScBanner', () => {
  it('renders banner', async () => {
    const el = await fixture<ScBanner>(
      html`<sc-banner title='Title' body='body'></sc-banner>`
    );
    await fixture<ScBanner>(html`
      <sc-banner
        image-src='/'
        title-size='xl'
        body-size='md'
        background-color='alt-blue'
        text-alignment='center'
        round-corner
        trustpoint
      >
        <div slot='title'>title</div>
        <div slot='body'>body</div>
      </sc-banner>
    `);
    await fixture<ScBanner>(
      html`<sc-banner title='Title' body='body' space-size='sm' trustpoint></sc-banner>`
    );

    expect(el.textAlignment).to.equal('left');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBanner>(
      html`<sc-banner title='Title'></sc-banner>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('expands title area to full width when title-full-width is set', async () => {
    const el = await fixture<ScBanner>(html`
      <sc-banner title='Title' title-full-width></sc-banner>
    `);

    const banner = el.shadowRoot?.querySelector('.sc-banner');
    expect(banner).to.have.class('title-full-width');
  });
});
