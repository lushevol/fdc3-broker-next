import { expect } from '@open-wc/testing';
import { SpacerTemplate } from '../../../src/models/Components/SpacerTemplate.js';

describe('SpacerTemplate model', () => {
  it('render the properties', () => {
    const spacerTemplate = SpacerTemplate.from();
    expect(spacerTemplate.size).to.equal('20');
  });
});