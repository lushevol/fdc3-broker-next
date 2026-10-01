import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getVisualExports,
  getStoryImports,
  findMissingCoverage,
} from './verify-storybook-coverage.mjs';

test('discovers component reexports and declarations without prop types or constants', () => {
  assert.deepEqual(
    getVisualExports(`
    export { Button, type ButtonProps, useTheme, DEFAULT_RATAN_APPEARANCE } from './index';
    export type { Theme } from './theme';
    export const Picker = () => null;
    export function Provider() { return null; }
    export interface PickerProps { label: string }
  `),
    ['Button', 'Picker', 'Provider'],
  );
});

test('requires a runtime reference, accepting aliases and namespace galleries', () => {
  const used = getStoryImports(`
    import { Button as Action, Input, type ButtonProps } from '../src';
    import * as Icons from '../src/icons';
    const render = () => <Action>Save</Action>;
    const gallery = Object.entries(Icons);
  `);
  assert.deepEqual(used, [
    { entry: '../src', names: ['Button'] },
    { entry: '../src/icons', names: ['*'] },
  ]);
});

test('fails on a newly exported visual component until a story covers it', () => {
  assert.deepEqual(findMissingCoverage(['Button', 'Input'], new Set(['Button'])), ['Input']);
  assert.deepEqual(findMissingCoverage(['Add', 'Close'], new Set(['*'])), []);
});
