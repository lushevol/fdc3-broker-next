import { expect } from '@open-wc/testing';
import { DividerTemplate } from '../../../src/models/Components/DividerTemplate.js';

describe('DividerTemplate model', () => {
  it('render the properties', () => {
    const dividerTemplate = DividerTemplate.from();
    expect(dividerTemplate.textAlign).to.equal('left');
  });
});