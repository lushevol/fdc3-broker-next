import { describe, it, expect } from 'vitest';
import { cleanUnusedCss } from './index.js';

describe('cleanUnusedCss', () => {
  it('should return cleaned HTML with statistics', () => {
    const html = `
      <html>
        <head>
          <style>.used-class { color: blue; }</style>
          <style>.unused-class { color: red; }</style>
        </head>
        <body>
          <div class="used-class">Hello</div>
        </body>
      </html>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.stats.originalRules).toBe(2);
    expect(result.html).toContain('.used-class');
    expect(result.html).not.toContain('.unused-class');
    expect(result.stats.originalSize).toBeGreaterThan(0);
    expect(result.stats.newSize).toBeLessThan(result.stats.originalSize);
  });

  it('should handle empty HTML input', () => {
    const result = cleanUnusedCss({ html: '' });

    expect(result.html).toBe('');
    expect(result.stats.originalRules).toBe(0);
    expect(result.stats.keptRules).toBe(0);
    expect(result.stats.removedRules).toBe(0);
    expect(result.stats.originalSize).toBe(0);
    expect(result.stats.newSize).toBe(0);
  });

  it('should preserve HTML structure', () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
          <style>.btn { padding: 8px; }</style>
        </head>
        <body>
          <button class="btn">Click</button>
        </body>
      </html>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('<title>Test</title>');
    expect(result.html).toContain('<button class="btn">Click</button>');
  });

  it('should preserve multiple style tags in order', () => {
    const html = `
      <style id="first">.a { color: red; }</style>
      <style id="second">.b { color: blue; }</style>
      <div class="a b"></div>
    `;

    const result = cleanUnusedCss({ html });

    const firstIndex = result.html.indexOf('id="first"');
    const secondIndex = result.html.indexOf('id="second"');

    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it('should preserve :root CSS variables even when no element references them', () => {
    const html = `
      <style>:root { --primary: #1890ff; }</style>
      <div>No var reference</div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain(':root');
    expect(result.html).toContain('--primary');
  });

  it('should preserve @keyframes even when no animation uses them', () => {
    const html = `
      <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>
      <div>Not animated</div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('@keyframes');
    expect(result.html).toContain('spin');
  });

  it('should preserve @font-face rules', () => {
    const html = `
      <style>@font-face { font-family: 'Custom'; src: url('custom.woff2'); }</style>
      <div>Text</div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('@font-face');
    // CSS output is minified without spaces around colons
    expect(result.html).toContain("font-family:'Custom'");
  });

  it('should handle HTML with no style tags', () => {
    const html = '<div class="test">No styles here</div>';

    const result = cleanUnusedCss({ html });

    expect(result.stats.originalRules).toBe(0);
    expect(result.stats.keptRules).toBe(0);
    expect(result.stats.removedRules).toBe(0);
  });

  it('should preserve pseudo-element rules', () => {
    const html = `
      <style>.icon::before { content: "★"; }</style>
      <div class="icon"></div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('::before');
  });

  it('should handle complex descendant selectors', () => {
    const html = `
      <style>.parent .child { color: blue; }</style>
      <div class="parent"><span class="child">Nested</span></div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('.parent');
    expect(result.html).toContain('.child');
  });

  it('should remove unused descendant selectors when parent class does not exist', () => {
    // Conservative approach: if parent class doesn't exist, the rule can't match anything
    const html = `
      <style>.nonexistent .child { color: blue; }</style>
      <div class="child">Only child, no parent</div>
    `;

    const result = cleanUnusedCss({ html });

    // The rule is removed because .nonexistent class doesn't exist in the DOM
    expect(result.html).not.toContain('.nonexistent');
    expect(result.html).not.toContain('.child');
  });

  it('should handle attribute selectors', () => {
    const html = `
      <style>[disabled] { opacity: 0.5; }</style>
      <button disabled>Disabled</button>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('[disabled]');
  });

  it('should handle ID selectors', () => {
    const html = `
      <style>#main-title { font-size: 24px; }</style>
      <h1 id="main-title">Title</h1>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).toContain('#main-title');
  });

  it('should remove unused ID selectors', () => {
    const html = `
      <style>#nonexistent { display: none; }</style>
      <div id="actual">Content</div>
    `;

    const result = cleanUnusedCss({ html });

    expect(result.html).not.toContain('#nonexistent');
  });
});
