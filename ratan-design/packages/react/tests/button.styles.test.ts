import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const variants = ['primary', 'secondary', 'text', 'link'] as const;
const tones = ['default', 'error', 'alert', 'success'] as const;

describe('Button static state CSS', () => {
  it('maps every variant and tone to the frozen SC token namespace', async () => {
    const css = await readFile(
      path.resolve('src/components/button/button-states.css'),
      'utf8',
    );

    for (const variant of variants) {
      for (const tone of tones) {
        expect(css).toContain(
          `[data-variant='${variant}'][data-tone='${tone}']`,
        );
        const tonePart = tone === 'default' ? '' : `-${tone}`;
        expect(css).toContain(
          `--sc-button-${variant}${tonePart}-background-color`,
        );
        expect(css).toContain(
          `--sc-button-${variant}${tonePart}-hover-background-color`,
        );
        expect(css).toContain(
          `--sc-button-${variant}${tonePart}-press-background-color`,
        );
        expect(css).toContain(
          `--sc-button-${variant}${tonePart}-select-background-color`,
        );
      }
    }
  });
});
