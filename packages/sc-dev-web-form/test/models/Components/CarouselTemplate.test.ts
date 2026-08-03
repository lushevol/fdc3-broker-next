import { expect } from '@open-wc/testing';
import { CarouselTemplate } from '../../../src/models/Components/CarouselTemplate.js';

describe('CarouselTemplate model', () => {
  it('render the properties', () => {
    const obj = {
        scrollHint: '0%',
        aspectRatio: 'auto',
        pagination: true,
        autoplay: false,
        loop: false,
        carousels: [{ id: 'Carousel1' }],
    };
    const carouselTemplate = CarouselTemplate.from(obj);
    CarouselTemplate.duplicate(carouselTemplate);
    expect(carouselTemplate.scrollHint).to.equal('0%');
    expect(carouselTemplate.aspectRatio).to.equal('auto');
    expect(carouselTemplate.pagination).to.equal(true);
    expect(carouselTemplate.autoplay).to.equal(false);
    expect(carouselTemplate.loop).to.equal(false);
    expect(carouselTemplate.carousels[0].id).to.equal('Carousel1');
  });
});
