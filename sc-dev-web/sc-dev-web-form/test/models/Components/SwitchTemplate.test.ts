import { expect } from '@open-wc/testing';
import { SwitchTemplate } from '../../../src/models/Components/SwitchTemplate.js';

describe('SwitchTemplate model', () => {
  it('render the properties', () => {
    const spacerTemplate = SwitchTemplate.from();
    expect(spacerTemplate.label).to.equal('Switch');
  });
});