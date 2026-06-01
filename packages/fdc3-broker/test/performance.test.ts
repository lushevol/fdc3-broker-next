import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PerformanceTracker } from '../src/performance';

describe('PerformanceTracker', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should warn and return zero when ending an unknown operation', () => {
    const tracker = new PerformanceTracker();

    expect(tracker.end('missing-operation')).toBe(0);
    expect(warn).toHaveBeenCalledWith(
      '[FDC3:Perf] No start mark found for operation: missing-operation',
    );
  });

  it('should measure an operation duration and warn for slow operations', () => {
    const now = vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(250);
    const tracker = new PerformanceTracker();

    tracker.start('slow-operation');
    const duration = tracker.end('slow-operation');

    expect(duration).toBe(150);
    expect(warn).toHaveBeenCalledWith('[FDC3:Perf] slow-operation took 150.00ms');
    expect(now).toHaveBeenCalledTimes(2);
  });

  it('should return measured async function results', async () => {
    vi.spyOn(performance, 'now').mockReturnValueOnce(10).mockReturnValueOnce(40);
    const tracker = new PerformanceTracker();

    await expect(tracker.measure('quick-operation', async () => 'ok')).resolves.toBe('ok');

    expect(warn).not.toHaveBeenCalled();
  });

  it('should end measurement even when the async function rejects', async () => {
    vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(130);
    const tracker = new PerformanceTracker();

    await expect(
      tracker.measure('failing-operation', async () => {
        throw new Error('failed');
      }),
    ).rejects.toThrow('failed');

    expect(warn).toHaveBeenCalledWith('[FDC3:Perf] failing-operation took 130.00ms');
  });

  it('should clear active marks', () => {
    const tracker = new PerformanceTracker();

    tracker.start('operation');
    tracker.clear();

    expect(tracker.end('operation')).toBe(0);
    expect(warn).toHaveBeenCalledWith('[FDC3:Perf] No start mark found for operation: operation');
  });
});
