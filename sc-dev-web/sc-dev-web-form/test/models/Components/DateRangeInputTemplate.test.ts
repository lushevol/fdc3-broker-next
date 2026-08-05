import { expect } from '@open-wc/testing';
import { DateRangeInputTemplate } from '../../../src/models/Components/DateRangeInputTemplate.js';

describe('DateRangeInputTemplate model', () => {
  it('render the properties', () => {
    const dateRangeInputTemplate = DateRangeInputTemplate.from();
    expect(dateRangeInputTemplate.label).to.equal('Date Range Input');
  });
});