import { expect } from '@open-wc/testing';
import { FileInputTemplate } from '../../../src/models/Components/FileInputTemplate.js';

describe('FileInputTemplate model', () => {
  it('render the properties', () => {
    const fileInputTemplate = FileInputTemplate.from();
    expect(fileInputTemplate.label).to.equal('File Input');
  });
});