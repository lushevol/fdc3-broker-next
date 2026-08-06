import { describe, expect, it, vi } from 'vitest';
import type { FormEvent } from 'react';

import {
  assertParityRecord,
  createRatanUser,
  overlayQueries,
  readRatanToken,
  renderRatanFixture,
  resetForm,
  runKeyboardSequence,
  submitForm,
} from '../src/index.js';

describe('Ratan consumer testing helpers', () => {
  it('renders fixtures and runs keyboard sequences', async () => {
    const onKeyDown = vi.fn();
    const { getByRole } = renderRatanFixture(
      <button type="button" onKeyDown={onKeyDown}>Action</button>,
    );
    const button = getByRole('button');
    button.focus();
    await runKeyboardSequence('{Enter}', createRatanUser());
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('submits and resets native forms', () => {
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    const { container } = renderRatanFixture(
      <form onSubmit={onSubmit}>
        <input name="value" defaultValue="initial" />
      </form>,
    );
    const form = container.querySelector('form')!;
    const input = container.querySelector('input')!;
    input.value = 'changed';
    submitForm(form);
    resetForm(form);
    expect(onSubmit).toHaveBeenCalled();
    expect(input.value).toBe('initial');
  });

  it('queries body overlays and reads SC tokens', () => {
    document.documentElement.style.setProperty('--sc-test-token', '12px');
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    document.body.append(overlay);
    expect(overlayQueries().getByRole('dialog')).toBe(overlay);
    expect(readRatanToken('--sc-test-token')).toBe('12px');
  });

  it('reports exact parity record differences', () => {
    expect(() => assertParityRecord({ width: 10 }, { width: 11 }, 'button')).toThrow(
      'button differs',
    );
    expect(() => assertParityRecord({ width: 10 }, { width: 10 })).not.toThrow();
  });
});
