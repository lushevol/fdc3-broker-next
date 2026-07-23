import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';
import { generateTokenCss } from '../src/foundation/generate-token-css';
import {
  COLOR_TOKEN_NAMES,
  DENSITY_TOKEN_NAMES,
  semanticTokens,
  validateSemanticTokens,
} from '../src/foundation/tokens';

describe('production design tokens', () => {
  it('uses the scoped production package identity', () => {
    expect(packageJson).toMatchObject({ name: '@fm/ratan-design', version: '1.1.0' });
  });

  it('defines complete light and dark semantic color roles', () => {
    expect(Object.keys(semanticTokens.color.light)).toEqual(COLOR_TOKEN_NAMES);
    expect(Object.keys(semanticTokens.color.dark)).toEqual(COLOR_TOKEN_NAMES);
    expect(validateSemanticTokens(semanticTokens)).toEqual([]);
  });

  it('defines complete compact and comfortable density roles', () => {
    expect(Object.keys(semanticTokens.density.compact)).toEqual(DENSITY_TOKEN_NAMES);
    expect(Object.keys(semanticTokens.density.comfortable)).toEqual(DENSITY_TOKEN_NAMES);
    expect(semanticTokens.density.compact.controlHeight).not.toBe(
      semanticTokens.density.comfortable.controlHeight,
    );
  });

  it('reports incomplete or invalid token data', () => {
    const invalid = structuredClone(semanticTokens) as unknown as Record<string, unknown>;
    const color = invalid.color as Record<string, Record<string, string>>;
    delete color.dark.focusRing;
    color.light.contentPrimary = '';
    expect(validateSemanticTokens(invalid)).toEqual([
      'color.light.contentPrimary must be a non-empty string',
      'color.dark.focusRing must be a non-empty string',
    ]);
  });

  it('generates deterministic scoped CSS without document-global theme selectors', () => {
    const first = generateTokenCss(semanticTokens);
    expect(generateTokenCss(semanticTokens)).toBe(first);
    expect(first).toContain('.ratan-design-root[data-ratan-theme="light"]');
    expect(first).toContain('--ratan-color-content-primary:');
    expect(first).toContain('.ratan-design-root[data-ratan-density="comfortable"]');
    expect(first).not.toMatch(/(?:^|\n):root\s*\{/);
  });

  it('keeps the checked-in generated artifact byte-for-byte current', () => {
    const generatedPath = resolve(process.cwd(), 'src/generated/tokens.css');
    expect(readFileSync(generatedPath, 'utf8')).toBe(generateTokenCss(semanticTokens));
  });
});
