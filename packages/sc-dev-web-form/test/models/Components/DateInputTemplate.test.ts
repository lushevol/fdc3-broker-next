import { expect } from '@open-wc/testing';
import { DateInputTemplate } from '../../../src/models/Components/DateInputTemplate.js';

describe('DateInputTemplate model', () => {
  it('render the properties', () => {
    const dateInputTemplate = DateInputTemplate.from();
    expect(dateInputTemplate.label).to.equal('Date Input');
  });
});