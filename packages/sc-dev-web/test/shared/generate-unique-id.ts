import { expect } from '@open-wc/testing';
import { generateUniqueId, generateFileUniqueId, generateRandom } from '../../src/shared/generate-unique-id.js';

describe('generateUniqueId', () => {
  it('should generate the unique id', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1 !== id2).to.equal(true);
  });
});

describe('test generateFileUniqueId', () => {
  it('should generate different random', () => {
    const random1 = generateRandom();
    const random2 = generateRandom();
    expect(random1 !== random2).to.equal(true);
  });

  it('should generate the unique file id', () => {
    const id1 = generateFileUniqueId();
    const id2 = generateFileUniqueId();
    expect(id1 !== id2).to.equal(true);
  });
});