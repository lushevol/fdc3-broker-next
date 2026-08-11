import { describe, expect, it } from 'vitest';

import { assertNoAxeViolations } from '../src/index.js';

describe('assertNoAxeViolations', () => {
  it('accepts an accessible fixture', async () => {
    document.documentElement.lang = 'en';
    document.title = 'Ratan accessibility fixture';
    document.body.innerHTML = '<main><button type="button">Save</button></main>';
    await expect(assertNoAxeViolations()).resolves.toMatchObject({ violations: [] });
  });

  it('reports violations with rule identifiers', async () => {
    document.body.innerHTML = '<main><img src="test.png"></main>';
    await expect(assertNoAxeViolations()).rejects.toThrow('image-alt');
  });
});
