import { expect } from '@open-wc/testing';
import { AccordionTemplate } from '../../../src/models/Components/AccordionTemplate.js';

describe('AccordionTemplate model', () => {
  it('render the properties', () => {
    const accordionTemplate = AccordionTemplate.from();
    expect(accordionTemplate.label).to.equal('Accordion');
  });
});