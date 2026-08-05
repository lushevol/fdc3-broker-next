import { expect } from '@open-wc/testing';
import { RatingTemplate } from '../../../src/models/Components/RatingTemplate.js';

describe('RatingTemplate model', () => {
  it('render the properties', () => {
    const ratingGroupTemplate = RatingTemplate.from();
    expect(ratingGroupTemplate.label).to.equal('Rating');
  });
});