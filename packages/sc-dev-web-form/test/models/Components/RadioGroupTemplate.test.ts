import { expect } from '@open-wc/testing';
import { RadioGroupTemplate } from '../../../src/models/Components/RadioGroupTemplate.js';

describe('RadioGroupTemplate model', () => {
  it('render the properties', () => {
    const radioGroupTemplate = RadioGroupTemplate.from();
    expect(radioGroupTemplate.label).to.equal('Radio Group');
  });
});