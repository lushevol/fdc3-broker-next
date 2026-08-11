import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  createRatanChangeDetail,
  useControllableState,
} from '../src/controllable-state.js';

describe('useControllableState', () => {
  it('updates uncontrolled state and reports a Ratan-owned reason detail', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'initial', onChange }),
    );

    act(() => result.current.setValue('next', 'input'));

    expect(result.current.value).toBe('next');
    expect(result.current.isControlled).toBe(false);
    expect(onChange).toHaveBeenCalledWith({
      value: 'next',
      previousValue: 'initial',
      reason: 'input',
    });
  });

  it('reports controlled changes without mutating the supplied value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 1, defaultValue: 0, onChange }),
    );

    act(() => result.current.setValue((previous) => previous + 1, 'press'));

    expect(result.current.value).toBe(1);
    expect(result.current.isControlled).toBe(true);
    expect(onChange).toHaveBeenCalledWith({
      value: 2,
      previousValue: 1,
      reason: 'press',
    });
  });

  it('does not notify when Object.is considers the value unchanged', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'same', onChange }),
    );

    act(() => result.current.setValue('same', 'programmatic'));

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('createRatanChangeDetail', () => {
  it('includes the optional native trigger without implementation types', () => {
    const trigger = new Event('reset');
    expect(createRatanChangeDetail(false, true, 'reset', trigger)).toEqual({
      value: false,
      previousValue: true,
      reason: 'reset',
      trigger,
    });
  });
});
