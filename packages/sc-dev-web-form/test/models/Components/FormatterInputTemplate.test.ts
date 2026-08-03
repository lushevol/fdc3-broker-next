import { expect } from '@open-wc/testing';
import { FormattedInputTemplate } from '../../../src/models/Components/FormattedInputTemplate.js';

describe('FormattedInputTemplate model', () => {
  it('render the properties', () => {
    const formattedInputTemplate = FormattedInputTemplate.from();
    expect(formattedInputTemplate.label).to.equal('Formatted Input');
  });
});