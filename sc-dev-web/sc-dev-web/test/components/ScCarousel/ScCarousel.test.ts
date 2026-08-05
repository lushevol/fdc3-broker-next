import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCarousel } from '../../../src/components/ScCarousel/ScCarousel.js';
import '../../../elements/sc-carousel.js';

describe('ScCarousel', () => {
  it('renders default carousel', async () => {
    const el = await fixture<ScCarousel>(
      html`
        <sc-carousel pagination autoplay loop>
          <sc-carousel-item>
            <div>Hello world</div>
          </sc-carousel-item>
          <sc-carousel-item>
            <div>Hello world2</div>
          </sc-carousel-item>
        </sc-carousel>
      `
    );

    expect(el.pagination).to.equal(true);
    expect(el.autoplay).to.equal(true);
    expect(el.loop).to.equal(true);
  });

  it('renders navigation with correct icons', async () => {
    const el = await fixture<ScCarousel>(
      html`
        <sc-carousel navigation>
          <sc-carousel-item>
            <div>Hello world</div>
          </sc-carousel-item>
        </sc-carousel>
      `
    );

    const carousel = el.shadowRoot?.querySelector('sl-carousel') as any;
    expect(carousel).to.exist;
    expect(carousel.navigation).to.equal(true);

    const prevIcon = el.shadowRoot?.querySelector('sc-icon[slot="previous-icon"]');
    const nextIcon = el.shadowRoot?.querySelector('sc-icon[slot="next-icon"]');
    expect(prevIcon).to.exist;
    expect(nextIcon).to.exist;
  });
});