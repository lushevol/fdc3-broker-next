import { expect } from '@open-wc/testing';
import { getNamedSlotTextContent } from '../../src/shared/slot.js';

describe('slot', () => {
  describe('getNamedSlotTextContent', () => {
    it('returns text from named slot element content', () => {
      const host = document.createElement('div');
      const errorNode = document.createElement('div');
      errorNode.setAttribute('slot', 'error');
      errorNode.innerHTML = 'I am <strong>error</strong> content';
      host.appendChild(errorNode);

      const result = getNamedSlotTextContent(host, 'error');

      expect(result).to.equal('I am error content');
    });

    it('returns text from forwarded slot assigned content', () => {
      const host = document.createElement('div');
      const forwardedSlot = document.createElement('slot');
      forwardedSlot.setAttribute('slot', 'error');

      const assignedNode = document.createElement('div');
      assignedNode.innerHTML = 'Forwarded <em>error</em> message';

      Object.defineProperty(forwardedSlot, 'assignedNodes', {
        value: () => [assignedNode],
      });

      host.appendChild(forwardedSlot);

      const result = getNamedSlotTextContent(host, 'error');

      expect(result).to.equal('Forwarded error message');
    });

    it('returns empty string for whitespace-only slot content', () => {
      const host = document.createElement('div');
      const errorNode = document.createElement('div');
      errorNode.setAttribute('slot', 'error');
      errorNode.textContent = '   \n  ';
      host.appendChild(errorNode);

      const result = getNamedSlotTextContent(host, 'error');

      expect(result).to.equal('');
    });

    it('returns empty string when named slot does not exist', () => {
      const host = document.createElement('div');

      const result = getNamedSlotTextContent(host, 'error');

      expect(result).to.equal('');
    });
  });
});
