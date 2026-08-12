import { requestIdleCallbackPolyfill, cancelIdleCallbackPolyfill } from "./requestIdleCallback";

describe('requestIdleCallback Polyfill', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call the callback with timeRemaining and didTimeout properties', () => {
    const callback = vi.fn();
    requestIdleCallbackPolyfill(callback);

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        didTimeout: false,
        timeRemaining: expect.any(Function),
      })
    );

    const timeRemaining = callback.mock.calls[0][0].timeRemaining();
    expect(timeRemaining).toBeGreaterThanOrEqual(0);
    expect(timeRemaining).toBeLessThanOrEqual(50);
  });

  it('should cancel the idle callback using cancelIdleCallback', () => {
    const callback = vi.fn();
    const id = requestIdleCallbackPolyfill(callback);

    cancelIdleCallbackPolyfill(id);
    vi.advanceTimersByTime(1);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle edge case where callback execution is delayed', () => {
    const callback = vi.fn();
    requestIdleCallbackPolyfill(callback);

    vi.advanceTimersByTime(100); // Simulate delay beyond 50ms

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        didTimeout: false,
        timeRemaining: expect.any(Function),
      })
    );

    const timeRemaining = callback.mock.calls[0][0].timeRemaining();
    expect(timeRemaining).toBe(0); // No time remaining after delay
  });
});
