import { expect } from '@open-wc/testing';
import ScRteElement from '../../src/shared/sc-rte-element.js';

describe('ScRteElement', () => {
  it('should have some customized functions', () => {
    const emit = ScRteElement.getPropertyOptions('emit');
    const stopDefaultEvent = ScRteElement.getPropertyOptions('stopDefaultEvent');
    expect(typeof emit).to.equal('object');
    expect(typeof stopDefaultEvent).to.equal('object');
  });
});
