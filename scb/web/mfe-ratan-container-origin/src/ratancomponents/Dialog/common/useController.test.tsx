import { renderHook, act } from '@testing-library/react';
import useController from './useController';

describe('useController', () => {
  it('should initialize with default and custom props', () => {
    const { result } = renderHook(() =>
      useController({
        minWidth: 50,
        minHeight: 50,
        width: 200,
        height: 200,
      })
    );

    expect(result.current.style).toEqual({ width: 200, height: 200 });
  });

  it('should close only when enableOtherClose is true and not moving', () => {
    const onCloseMock = jest.fn();
    const { result } = renderHook(() =>
      useController({
        minWidth: 50,
        minHeight: 50,
        width: 200,
        height: 200,
        enableOtherClose: true,
        onClose: onCloseMock,
      })
    );

    act(() => {
      result.current.close();
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});