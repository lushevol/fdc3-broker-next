import { expect } from '@open-wc/testing';
import { NumberInputTemplate } from '../../../src/models/Components/NumberInputTemplate.js';

describe('NumberInputTemplate model', () => {
  it('render the properties', () => {
    const numberInputTemplate = NumberInputTemplate.from();
    expect(numberInputTemplate.label).to.equal('Number Input');
  });
});