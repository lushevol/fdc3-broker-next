import { describe, it, expect } from 'vitest';
import {
  selectorMatchesSignature,
  anySelectorMatches,
} from './selector-match.js';
import type { DomSignature } from './types.js';

function createSignature(partial: Partial<DomSignature>): DomSignature {
  return {
    tags: partial.tags || new Set(),
    classes: partial.classes || new Set(),
    ids: partial.ids || new Set(),
    attributes: partial.attributes || new Set(),
    attributePairs: partial.attributePairs || new Set(),
  };
}

describe('selectorMatchesSignature', () => {
  describe('class selectors', () => {
    it('should return true for matching class selector', () => {
      const signature = createSignature({
        classes: new Set(['ant-btn', 'primary']),
      });
      expect(selectorMatchesSignature('.ant-btn', signature)).toBe(true);
    });

    it('should return false for non-matching class selector', () => {
      const signature = createSignature({ classes: new Set(['ant-btn']) });
      expect(selectorMatchesSignature('.unused-class', signature)).toBe(false);
    });

    it('should handle multiple class selectors', () => {
      const signature = createSignature({
        classes: new Set(['btn', 'primary']),
      });
      expect(selectorMatchesSignature('.btn.primary', signature)).toBe(true);
    });
  });

  describe('ID selectors', () => {
    it('should return true for matching ID selector', () => {
      const signature = createSignature({ ids: new Set(['menu-appbar']) });
      expect(selectorMatchesSignature('#menu-appbar', signature)).toBe(true);
    });

    it('should return false for non-matching ID selector', () => {
      const signature = createSignature({ ids: new Set(['other-id']) });
      expect(selectorMatchesSignature('#menu-appbar', signature)).toBe(false);
    });
  });

  describe('tag selectors', () => {
    it('should return true for matching tag selector', () => {
      const signature = createSignature({
        tags: new Set(['div', 'span', 'button']),
      });
      expect(selectorMatchesSignature('button', signature)).toBe(true);
    });

    it('should return false for non-matching tag selector', () => {
      const signature = createSignature({ tags: new Set(['div', 'span']) });
      expect(selectorMatchesSignature('button', signature)).toBe(false);
    });
  });

  describe('attribute selectors', () => {
    it('should return true for matching attribute selector', () => {
      const signature = createSignature({
        attributes: new Set(['disabled', 'type']),
      });
      expect(selectorMatchesSignature('[disabled]', signature)).toBe(true);
    });

    it('should return false for non-matching attribute selector', () => {
      const signature = createSignature({ attributes: new Set(['type']) });
      expect(selectorMatchesSignature('[disabled]', signature)).toBe(false);
    });
  });

  describe('descendant combinators', () => {
    it('should return true when both classes exist', () => {
      const signature = createSignature({
        classes: new Set(['ant-message-notice', 'anticon']),
      });
      expect(
        selectorMatchesSignature('.ant-message-notice .anticon', signature),
      ).toBe(true);
    });

    it('should return false when one class is missing', () => {
      const signature = createSignature({ classes: new Set(['anticon']) });
      expect(
        selectorMatchesSignature('.ant-message-notice .anticon', signature),
      ).toBe(false);
    });
  });

  describe('complex pseudo-classes', () => {
    it('should always keep :not() selectors', () => {
      const signature = createSignature({ classes: new Set() });
      expect(selectorMatchesSignature(':not(.hidden)', signature)).toBe(true);
    });

    it('should always keep :has() selectors', () => {
      const signature = createSignature({ classes: new Set() });
      expect(selectorMatchesSignature(':has(.child)', signature)).toBe(true);
    });

    it('should always keep :where() selectors', () => {
      const signature = createSignature({ classes: new Set() });
      expect(selectorMatchesSignature(':where(.item)', signature)).toBe(true);
    });
  });

  describe('pseudo-elements', () => {
    it('should always keep ::before selectors', () => {
      const signature = createSignature({ classes: new Set(['icon']) });
      expect(selectorMatchesSignature('.icon::before', signature)).toBe(true);
    });

    it('should always keep ::after selectors', () => {
      const signature = createSignature({ classes: new Set(['tooltip']) });
      expect(selectorMatchesSignature('.tooltip::after', signature)).toBe(true);
    });
  });

  describe(':root selector', () => {
    it('should always keep :root selectors', () => {
      const signature = createSignature({ tags: new Set() });
      expect(selectorMatchesSignature(':root', signature)).toBe(true);
    });
  });
});

describe('anySelectorMatches', () => {
  it('should return true if any selector in list matches', () => {
    const signature = createSignature({ classes: new Set(['used-class']) });

    expect(anySelectorMatches('.used-class, .unused-class', signature)).toBe(
      true,
    );
  });

  it('should return false if no selector matches', () => {
    const signature = createSignature({ classes: new Set(['other']) });

    expect(anySelectorMatches('.unused-1, .unused-2', signature)).toBe(false);
  });

  it('should handle single selector', () => {
    const signature = createSignature({ classes: new Set(['btn']) });

    expect(anySelectorMatches('.btn', signature)).toBe(true);
  });
});
