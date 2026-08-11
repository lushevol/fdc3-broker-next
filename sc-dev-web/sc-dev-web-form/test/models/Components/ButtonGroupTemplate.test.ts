import { expect } from '@open-wc/testing';
import { ButtonGroupTemplate } from '../../../src/models/Components/ButtonGroupTemplate.js';

describe('ButtonGroupTemplate model', () => {
  it('render the properties', () => {
    const buttonGroupTemplate = ButtonGroupTemplate.from();
    expect(buttonGroupTemplate.label).to.equal('Button Group');
  });
});