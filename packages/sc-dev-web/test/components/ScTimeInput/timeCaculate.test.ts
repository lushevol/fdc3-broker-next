import { generateValues, generateAMPM } from '../../../src/components/ScTimeInput/timeCaculate.js';
import { expect } from '@open-wc/testing';

describe('timeCaculate', () => {
  it('generateValues', () => {
    const data = generateValues(0, 9, 1, [1, 2, 3], false, 5);
    const data2 = generateValues(0, 9, 1, [1, 2, 3], true, 5);
    expect(data.length).to.equal(10);
    expect(data[1].disabled).to.equal(true);
    expect(data[5].selected).to.equal(true);
    expect(data2[0].label).to.equal('00');
  });

  it('generateAMPM', () => {
    const data = generateAMPM(false, 'am');
    const data2 = generateAMPM(true, 'PM');
    expect(data[0].label).to.equal('am');
    expect(data[0].selected).to.equal(true);
    expect(data2[1].label).to.equal('PM');
    expect(data2[1].selected).to.equal(true);
  });
});