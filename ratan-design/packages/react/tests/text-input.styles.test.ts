import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('TextInput static state CSS', () => {
  it.each([
    ['error', '--sc-form-input-error-border-color'],
    ['success', '--sc-form-input-success-border-color'],
    ['disabled', '--sc-form-disabled-input-background-color'],
    ['read-only', 'border-color: transparent'],
  ] as const)('maps %s state to the frozen style contract', async (state, expectedStyle) => {
    const css = await readFile(
      path.resolve('src/components/text-input/text-input.css'),
      'utf8',
    );

    expect(css).toContain(`[data-${state}='true']`);
    expect(css).toContain(expectedStyle);
  });

  it('uses scoped Ratan roots and no replacement public token namespace', async () => {
    const css = await readFile(
      path.resolve('src/components/text-input/text-input.css'),
      'utf8',
    );

    expect(css).toContain("[data-ratan-component='TextInput']");
    expect(css).not.toMatch(/--(?:pui|ratan)-/);
  });
});
