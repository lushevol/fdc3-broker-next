import { expect } from '@open-wc/testing';
import { TimeInputTemplate } from '../../../src/models/Components/TimeInputTemplate.js';

describe('TimeInputTemplate model', () => {
  it('render the properties', () => {
    const timeInputTemplate = TimeInputTemplate.from();
    expect(timeInputTemplate.label).to.equal('Time Input');
  });
});