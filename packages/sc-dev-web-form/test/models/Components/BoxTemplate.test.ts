import { expect } from '@open-wc/testing';
import { BoxTemplate } from '../../../src/models/Components/BoxTemplate.js';

describe('BoxTemplate model', () => {
  it('render the properties', () => {
    const boxTemplate = BoxTemplate.from();
    expect(boxTemplate.label).to.equal('Box');
  });
});