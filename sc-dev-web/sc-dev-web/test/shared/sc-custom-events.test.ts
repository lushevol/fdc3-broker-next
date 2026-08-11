import { expect } from '@open-wc/testing';
import { CUSTOM_EVENTS } from '../../src/shared/sc-custom-events.js';

describe('Custom Events', () => {
  it('should have custom events', () => {
    const events = Object.keys(CUSTOM_EVENTS);
    expect(events.length > 0).to.equal(true);
  });
});
