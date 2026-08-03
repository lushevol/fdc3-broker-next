import { expect } from '@open-wc/testing';
import { revertColor } from '../../src/shared/util.js';

describe('Util', () => {
  it('call revertColor', async () => {
    const result1 = revertColor('--sc-color-red-50');
    expect(result1).to.equal('#FCE6E7');

    const result2 = revertColor('--sc-color-maroon-50');
    expect(result2).to.equal('#F7E9EE');

    const result3 = revertColor('#00E394');
    expect(result3).to.equal('#00E394');
  });
});
