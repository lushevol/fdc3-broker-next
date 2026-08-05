import { expect } from '@open-wc/testing';
import { findAncestor, getAncestorsOf } from '../../src/shared/ancestor.js';

describe('ancestor', () => {
  describe('findAncestor', () => {
    it('returns the first ancestor matching the predicate', () => {
      const grandparent = document.createElement('div');
      const parent = document.createElement('div');
      const child = document.createElement('span');
      grandparent.appendChild(parent);
      parent.appendChild(child);
      document.body.appendChild(grandparent);

      const result = findAncestor(child, el => el === parent);
      expect(result).to.equal(parent);

      document.body.removeChild(grandparent);
    });

    it('returns null when no ancestor matches the predicate', () => {
      const el = document.createElement('span');
      // disconnected element — has no ancestors, so predicate is never truthy
      const result = findAncestor(el, () => false);
      expect(result).to.be.null;
    });

    it('returns the first matching ancestor, not a deeper one', () => {
      const grandparent = document.createElement('div');
      const parent = document.createElement('div');
      const child = document.createElement('span');
      grandparent.appendChild(parent);
      parent.appendChild(child);
      document.body.appendChild(grandparent);

      const result = findAncestor(child, el => el.tagName === 'DIV');
      expect(result).to.equal(parent);

      document.body.removeChild(grandparent);
    });
  });
});
