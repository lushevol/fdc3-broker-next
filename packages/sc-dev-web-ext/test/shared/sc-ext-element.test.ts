import { expect } from '@open-wc/testing';
import ScExtElement from '../../src/shared/sc-ext-element.js';

describe('ScExtElement', () => {
  it('should have some customized functions', () => {
    const emit = ScExtElement.getPropertyOptions('emit');
    const stopDefaultEvent = ScExtElement.getPropertyOptions('stopDefaultEvent');
    expect(typeof emit).to.equal('object');
    expect(typeof stopDefaultEvent).to.equal('object');
  });
});
