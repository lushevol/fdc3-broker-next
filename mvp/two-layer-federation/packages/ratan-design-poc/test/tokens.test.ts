import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/tokens.css', 'utf8');

describe('semantic token stylesheet', () => {
  it('defines scoped light and dark token sets', () => {
    expect(css).toContain('[data-ratan-theme="light"]');
    expect(css).toContain('[data-ratan-theme="dark"]');
    expect(css).toContain('--ratan-color-surface-default');
    expect(css).toContain('--ratan-color-focus-ring');
  });

  it('defines compact and comfortable density values', () => {
    expect(css).toContain('[data-ratan-density="compact"]');
    expect(css).toContain('[data-ratan-density="comfortable"]');
    expect(css).toContain('--ratan-control-height');
  });

  it('provides a visible focus-visible rule', () => {
    expect(css).toMatch(/:focus-visible[^{]*\{[^}]*outline:/s);
  });
});
