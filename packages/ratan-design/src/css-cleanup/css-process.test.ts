import { describe, it, expect } from 'vitest';
import { processCss, processStyleTags } from './css-process.js';
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

describe('processCss', () => {
  it('should remove unused class selector', () => {
    const css = '.unused-class { color: red; }';
    const signature = createSignature({ classes: new Set(['other-class']) });

    const result = processCss(css, signature);

    expect(result.originalRules).toBe(1);
    expect(result.keptRules).toBe(0);
    expect(result.css).not.toContain('.unused-class');
  });

  it('should keep used class selector', () => {
    const css = '.ant-btn { padding: 8px; }';
    const signature = createSignature({ classes: new Set(['ant-btn']) });

    const result = processCss(css, signature);

    expect(result.originalRules).toBe(1);
    expect(result.keptRules).toBe(1);
    expect(result.css).toContain('.ant-btn');
  });

  it('should preserve @keyframes rules', () => {
    const css =
      '@keyframes loadingCircle { from { opacity: 0; } to { opacity: 1; } }';
    const signature = createSignature({ classes: new Set() });

    const result = processCss(css, signature);

    expect(result.css).toContain('@keyframes');
    expect(result.css).toContain('loadingCircle');
  });

  it('should preserve :root CSS variables', () => {
    const css = ':root { --primary-color: #1890ff; }';
    const signature = createSignature({ tags: new Set() });

    const result = processCss(css, signature);

    expect(result.css).toContain(':root');
    expect(result.css).toContain('--primary-color');
  });

  it('should preserve @font-face rules', () => {
    const css =
      "@font-face { font-family: 'Poppins'; src: url('poppins.woff2'); }";
    const signature = createSignature({ classes: new Set() });

    const result = processCss(css, signature);

    expect(result.css).toContain('@font-face');
    // CSS output is minified without spaces around colons
    expect(result.css).toContain("font-family:'Poppins'");
  });

  it('should preserve pseudo-element rules', () => {
    const css = '.icon::before { content: "★"; }';
    const signature = createSignature({ classes: new Set(['icon']) });

    const result = processCss(css, signature);

    expect(result.css).toContain('::before');
  });

  it('should handle multiple rules', () => {
    const css = `
      .used-class { color: blue; }
      .unused-class { color: red; }
      .another-used { color: green; }
    `;
    const signature = createSignature({
      classes: new Set(['used-class', 'another-used']),
    });

    const result = processCss(css, signature);

    expect(result.originalRules).toBe(3);
    expect(result.keptRules).toBe(2);
    expect(result.css).toContain('.used-class');
    expect(result.css).toContain('.another-used');
    expect(result.css).not.toContain('.unused-class');
  });

  it('should handle selector lists (comma-separated)', () => {
    const css = '.used-class, .unused-class { color: blue; }';
    const signature = createSignature({ classes: new Set(['used-class']) });

    const result = processCss(css, signature);

    expect(result.keptRules).toBe(1);
    expect(result.css).toContain('.used-class');
  });

  it('should handle empty CSS', () => {
    const result = processCss('', createSignature({}));

    expect(result.originalRules).toBe(0);
    expect(result.keptRules).toBe(0);
    expect(result.css).toBe('');
  });
});

describe('processStyleTags', () => {
  it('should process multiple style tags', () => {
    const html = `
      <html>
        <head>
          <style>.used { color: blue; }</style>
          <style>.unused { color: red; }</style>
        </head>
        <body class="used"></body>
      </html>
    `;
    const signature = createSignature({ classes: new Set(['used']) });

    const result = processStyleTags(html, signature);

    expect(result.stats.originalRules).toBe(2);
    expect(result.stats.keptRules).toBe(1);
    expect(result.html).toContain('.used');
    expect(result.html).not.toContain('.unused');
  });

  it('should preserve style tag attributes', () => {
    const html = '<style type="text/css">.used { color: blue; }</style>';
    const signature = createSignature({ classes: new Set(['used']) });

    const result = processStyleTags(html, signature);

    expect(result.html).toContain('type="text/css"');
  });
});
