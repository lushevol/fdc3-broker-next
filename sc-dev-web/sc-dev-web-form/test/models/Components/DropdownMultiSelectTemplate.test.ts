import { expect } from '@open-wc/testing';
import { DropdownMultiSelectTemplate } from '../../../src/models/Components/DropdownMultiSelectTemplate.js';

describe('DropdownMultiSelectTemplate model', () => {
  it('render the properties', () => {
    const dropdownMultiSelectTemplate = DropdownMultiSelectTemplate.from();
    expect(dropdownMultiSelectTemplate.label).to.equal('Dropdown Multi Select');
  });
});