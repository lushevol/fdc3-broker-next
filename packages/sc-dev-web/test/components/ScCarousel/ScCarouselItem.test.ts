import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCarouselItem } from '../../../src/components/ScCarousel/ScCarouselItem.js';
import '../../../elements/sc-carousel-item.js';

describe('ScCarouselItem', () => {
  it('renders default carousel', async () => {
    const el = await fixture<ScCarouselItem>(
      html`
        <sc-carousel-item>
          Hello world
        </sc-carousel-item>
      `
    );

    expect(el.getAttribute('role')).to.equal('group');
  });
});