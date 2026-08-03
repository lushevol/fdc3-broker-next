import { expect } from '@open-wc/testing';
import { CheckboxTemplate } from '../../../src/models/Components/CheckboxTemplate.js';

describe('CheckboxTemplate model', () => {
  it('render the properties', () => {
    const checkboxTemplate = CheckboxTemplate.from();
    expect(checkboxTemplate.label).to.equal('Checkbox Group');
  });
});