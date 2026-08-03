import { expect } from '@open-wc/testing';
import { ToggleTemplate } from '../../../src/models/Components/ToggleTemplate.js';

describe('ToggleTemplate model', () => {
  it('render the properties', () => {
    const toggleTemplate = ToggleTemplate.from();
    expect(toggleTemplate.label).to.equal('Toggle');
  });
});