import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useResolverKeyboard } from '../src/useResolverKeyboard';

describe('useResolverKeyboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const pressKey = (key: string) => {
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    });
  };

  it('should ignore keyboard events while closed', () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 3,
        onSelect,
        onCancel,
        isOpen: false,
      }),
    );

    pressKey('ArrowDown');
    pressKey('Enter');
    pressKey('Escape');

    expect(result.current).toBe(0);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should move focus down and wrap to the first item', () => {
    const { result } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 2,
        onSelect: vi.fn(),
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    pressKey('ArrowDown');
    expect(result.current).toBe(1);

    pressKey('ArrowDown');
    expect(result.current).toBe(0);
  });

  it('should move focus up and wrap to the last item', () => {
    const { result } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 3,
        onSelect: vi.fn(),
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    pressKey('ArrowUp');

    expect(result.current).toBe(2);
  });

  it('should support Home and End navigation', () => {
    const { result } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 4,
        onSelect: vi.fn(),
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    pressKey('End');
    expect(result.current).toBe(3);

    pressKey('Home');
    expect(result.current).toBe(0);
  });

  it('should select the focused item with Enter and Space', () => {
    const onSelect = vi.fn();
    renderHook(() =>
      useResolverKeyboard({
        itemCount: 3,
        onSelect,
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    pressKey('ArrowDown');
    pressKey('Enter');
    pressKey(' ');

    expect(onSelect).toHaveBeenNthCalledWith(1, 1);
    expect(onSelect).toHaveBeenNthCalledWith(2, 1);
  });

  it('should call cancel with Escape', () => {
    const onCancel = vi.fn();
    renderHook(() =>
      useResolverKeyboard({
        itemCount: 3,
        onSelect: vi.fn(),
        onCancel,
        isOpen: true,
      }),
    );

    pressKey('Escape');

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should reset focus to zero when reopened', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) =>
        useResolverKeyboard({
          itemCount: 3,
          onSelect: vi.fn(),
          onCancel: vi.fn(),
          isOpen,
        }),
      { initialProps: { isOpen: true } },
    );

    pressKey('ArrowDown');
    expect(result.current).toBe(1);

    rerender({ isOpen: false });
    rerender({ isOpen: true });

    expect(result.current).toBe(0);
  });

  it('should not produce invalid focus or selection when there are no targets', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 0,
        onSelect,
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    pressKey('ArrowDown');
    pressKey('ArrowUp');
    pressKey('End');
    pressKey('Enter');

    expect(result.current).toBe(0);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should remove the keydown listener on unmount', () => {
    const removeEventListener = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() =>
      useResolverKeyboard({
        itemCount: 1,
        onSelect: vi.fn(),
        onCancel: vi.fn(),
        isOpen: true,
      }),
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
