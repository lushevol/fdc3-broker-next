import { expect } from '@open-wc/testing';
import { EmployeeInputTemplate } from '../../../src/models/Components/EmployeeInputTemplate.js';

describe('EmployeeInputTemplate model', () => {
  it('render the properties', () => {
    const employeeInputTemplate = EmployeeInputTemplate.from();
    expect(employeeInputTemplate.label).to.equal('Employee Input');
  });
});