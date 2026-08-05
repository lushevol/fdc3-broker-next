import { expect } from '@open-wc/testing';
import { ModalTemplate } from '../../../src/models/Components/ModalTemplate.js';

describe('ModalTemplate model', () => {
  it('render the properties', () => {
    const modalTemplate = ModalTemplate.from();
    expect(modalTemplate.label).to.equal('Modal');
  });
});