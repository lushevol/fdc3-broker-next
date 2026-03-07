import { describe, it, expect } from 'vitest';
import { extractDomSignature } from './dom-signature.js';

describe('extractDomSignature', () => {
  it('should extract all class names from HTML', () => {
    const html = `
      <div class="ant-btn primary"></div>
      <span class="MuiTypography-root"></span>
    `;
    const signature = extractDomSignature(html);

    expect(signature.classes.has('ant-btn')).toBe(true);
    expect(signature.classes.has('primary')).toBe(true);
    expect(signature.classes.has('MuiTypography-root')).toBe(true);
  });

  it('should extract all IDs from HTML', () => {
    const html = `
      <div id="menu-appbar"></div>
      <input id="search-input" />
    `;
    const signature = extractDomSignature(html);

    expect(signature.ids.has('menu-appbar')).toBe(true);
    expect(signature.ids.has('search-input')).toBe(true);
  });

  it('should extract all tag names from HTML', () => {
    const html = `
      <div><span><button><input><table></table></button></span></div>
    `;
    const signature = extractDomSignature(html);

    expect(signature.tags.has('div')).toBe(true);
    expect(signature.tags.has('span')).toBe(true);
    expect(signature.tags.has('button')).toBe(true);
    expect(signature.tags.has('input')).toBe(true);
    expect(signature.tags.has('table')).toBe(true);
  });

  it('should extract attribute names and pairs from HTML', () => {
    const html = `
      <input type="text" disabled />
      <button aria-label="close"></button>
    `;
    const signature = extractDomSignature(html);

    // Attribute names
    expect(signature.attributes.has('type')).toBe(true);
    expect(signature.attributes.has('disabled')).toBe(true);
    expect(signature.attributes.has('aria-label')).toBe(true);

    // Attribute pairs
    expect(signature.attributePairs.has('type=text')).toBe(true);
    expect(signature.attributePairs.has('aria-label=close')).toBe(true);
  });

  it('should handle elements with multiple classes', () => {
    const html = `<div class="class1 class2 class3"></div>`;
    const signature = extractDomSignature(html);

    expect(signature.classes.has('class1')).toBe(true);
    expect(signature.classes.has('class2')).toBe(true);
    expect(signature.classes.has('class3')).toBe(true);
  });

  it('should return empty sets for empty HTML', () => {
    const signature = extractDomSignature('');

    // cheerio creates html/head/body by default for empty input
    // Just check that there are no unexpected elements
    expect(signature.classes.size).toBe(0);
    expect(signature.ids.size).toBe(0);
    expect(signature.attributes.size).toBe(0);
    expect(signature.attributePairs.size).toBe(0);
  });

  it('should handle tag names case-insensitively', () => {
    const html = `<DIV><SPAN></SPAN></DIV>`;
    const signature = extractDomSignature(html);

    expect(signature.tags.has('div')).toBe(true);
    expect(signature.tags.has('span')).toBe(true);
  });

  it('should not include class and id in attributes', () => {
    const html = `<div id="my-id" class="my-class"></div>`;
    const signature = extractDomSignature(html);

    expect(signature.attributes.has('id')).toBe(false);
    expect(signature.attributes.has('class')).toBe(false);
    expect(signature.ids.has('my-id')).toBe(true);
    expect(signature.classes.has('my-class')).toBe(true);
  });
});
