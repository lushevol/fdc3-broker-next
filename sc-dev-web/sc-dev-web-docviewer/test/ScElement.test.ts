import { expect } from '@open-wc/testing';
import ScElement from '../src/utils/ScElement.js';

describe('test sc element', () => {
  it('sc element', async () => {
    expect(typeof ScElement).to.equal('function');
  });
});
