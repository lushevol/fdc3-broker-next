import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { semanticTokens } from '../src/foundation/tokens';

const componentsCss = readFileSync(
  resolve(process.cwd(), 'src/components.css'),
  'utf8',
);
const generatedCss = readFileSync(
  resolve(process.cwd(), 'src/generated/tokens.css'),
  'utf8',
);

describe('GDS alignment', () => {
  it('defines only resolvable scoped Ratan custom properties', () => {
    const used = [...componentsCss.matchAll(/var\((--ratan-[\w-]+)/g)].map(
      (match) => match[1],
    );
    const defined = [
      ...`${componentsCss}\n${generatedCss}`.matchAll(/(--ratan-[\w-]+)\s*:/g),
    ].map((match) => match[1]);

    expect(
      [...new Set(used)].filter((token) => !defined.includes(token)),
    ).toEqual([]);
  });

  it('uses the GDS component typography and modal presets', () => {
    expect(semanticTokens.foundation).toMatchObject({
      fontSizeBody: '0.875rem',
      lineHeightBody: '1.375rem',
      fontSizeLabel: '0.75rem',
      lineHeightLabel: '1rem',
      fontSizeTitle: '1.125rem',
      lineHeightTitle: '1.625rem',
      dialogWidthSmall: '30rem',
      dialogWidthMedium: '40rem',
      dialogWidthLarge: '50rem',
    });
  });

  it('provides intent-specific information, success, warning, and error feedback', () => {
    expect(semanticTokens.color.light).toMatchObject({
      statusInfoSurface: '#e5f1fc',
      statusReadySurface: '#ebfbe6',
      statusReviewSurface: '#fef6e7',
      statusBlockedSurface: '#fce6e7',
    });
    expect(componentsCss).toMatch(
      /\.ratan-inline-alert\[data-ratan-tone=['"]info['"]\]/,
    );
    expect(componentsCss).not.toContain('.ratan-inline-alert-marker');
  });

  it('uses the GDS pill treatment for action buttons', () => {
    expect(componentsCss).toMatch(
      /\.ratan-button\s*\{[^}]*border-radius:\s*var\(--ratan-radius-pill\)/s,
    );
  });
});
