import { expect } from '@open-wc/testing';
import { StepperTemplate } from '../../../src/models/Components/StepperTemplate.js';

describe('StepperTemplate model', () => {
  it('render the properties', () => {
    const spacerTemplate = StepperTemplate.from();
    expect(spacerTemplate.steps.length).to.equal(2);
  });
});