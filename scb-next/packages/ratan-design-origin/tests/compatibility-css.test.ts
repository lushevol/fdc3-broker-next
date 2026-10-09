import { describe, expect, it } from 'vitest';
import { stringCss } from '../src/compatibility-css';

it('provides reusable string classes that style an existing DOM node', () => {
  const className = stringCss({ color: 'rgb(17, 34, 51)', borderRadius: '7px' });
  const element = document.createElement('div');
  element.className = className;
  document.body.appendChild(element);
  expect(typeof className).toBe('string');
  expect(className).toMatch(/^css-/);
  expect(getComputedStyle(element).color).toBe('rgb(17, 34, 51)');
  expect(getComputedStyle(element).borderRadius).toBe('7px');
  element.remove();
});

describe('legacy tagged-template classes', () => {
  it('retains dynamic values and deduplicates repeated styles', () => {
    const opacity = 0.5;
    const first = stringCss`opacity: ${opacity}; cursor: pointer;`;
    const second = stringCss`opacity: ${opacity}; cursor: pointer;`;
    const element = document.createElement('button');
    element.className = first;
    document.body.appendChild(element);
    expect(first).toBe(second);
    expect(getComputedStyle(element).opacity).toBe('0.5');
    expect(getComputedStyle(element).cursor).toBe('pointer');
    element.remove();
  });
});
