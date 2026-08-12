import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useViewName from './useViewName';

describe('useViewName', () => {
  it('should update viewName when changeViewName is called', () => {
    const { result } = renderHook(() => useViewName());
    expect(result.current.viewName).toBe('');
    act(() => {
      result.current.changeViewName('newViewName');
    });
    const r2 = renderHook(() => useViewName());
    expect(r2.result.current.viewName).toBe('newViewName');
  });
});
