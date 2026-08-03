import { expect } from '@open-wc/testing';
import { DropdownInputTemplate } from '../../../src/models/Components/DropdownInputTemplate.js';

describe('DropdownInputTemplate model', () => {
  it('render the properties', () => {
    const dropdownInputTemplate = DropdownInputTemplate.from();
    expect(dropdownInputTemplate.label).to.equal('Dropdown Input');
  });
});