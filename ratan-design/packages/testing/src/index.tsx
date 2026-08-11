import {
  render,
  within,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

export function renderRatanFixture(
  fixture: ReactNode,
  options?: RenderOptions,
): RenderResult {
  return render(<>{fixture}</>, options);
}

export interface RatanUser {
  keyboard(sequence: string): Promise<void>;
}

export function createRatanUser(): RatanUser {
  return userEvent as unknown as RatanUser;
}

export async function runKeyboardSequence(
  sequence: string,
  user: RatanUser = createRatanUser(),
): Promise<void> {
  await user.keyboard(sequence);
}

export function submitForm(form: HTMLFormElement): void {
  form.requestSubmit();
}

export function resetForm(form: HTMLFormElement): void {
  form.reset();
}

export function overlayQueries() {
  return within(document.body);
}

export function readRatanToken(
  token: `--sc-${string}`,
  element: Element = document.documentElement,
): string {
  return getComputedStyle(element).getPropertyValue(token).trim();
}

export function assertParityRecord(
  actual: Readonly<Record<string, unknown>>,
  expected: Readonly<Record<string, unknown>>,
  label = 'parity record',
): void {
  const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);
  const differences = [...keys]
    .filter((key) => !Object.is(actual[key], expected[key]))
    .map(
      (key) =>
        `${key}: expected ${JSON.stringify(expected[key])}, received ${JSON.stringify(actual[key])}`,
    );
  if (differences.length > 0) {
    throw new Error(`${label} differs:\n${differences.join('\n')}`);
  }
}
