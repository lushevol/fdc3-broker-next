import { expect } from '@open-wc/testing';
import { CardNumberInputTemplate } from '../../../src/models/Components/CardNumberInputTemplate.js';

describe('CardNumberInputTemplate model', () => {
  it('render the properties', () => {
    const cardNumberInputTemplate = CardNumberInputTemplate.from();
    expect(cardNumberInputTemplate.label).to.equal('Card Number Input');
  });
});