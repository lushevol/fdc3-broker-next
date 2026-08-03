import { expect } from '@open-wc/testing';
import { TextFieldTemplate } from '../../../src/models/Components/TextFieldTemplate.js';

describe('TextFieldTemplate model', () => {
  it('render the properties', () => {
    const textFieldTemplate = TextFieldTemplate.from();
    expect(textFieldTemplate.label).to.equal('Text Field');
  });
});