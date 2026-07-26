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

  it('keeps overlapping operations separate and preserves their attributes', async () => {
    const tracker = new PerformanceTracker();
    let releaseFirst!: () => void;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const first = tracker.measure(
      'broadcast',
      async () => firstGate,
      { sourceAppId: 'prices', sourceInstanceId: 'prices-1', contextType: 'fdc3.instrument' },
    );
    const second = tracker.measure(
      'broadcast',
      async () => undefined,
      { sourceAppId: 'chart', sourceInstanceId: 'chart-1', contextType: 'fdc3.instrument' },
    );

    await second;
    releaseFirst();
    await first;

    const metrics = tracker.getPerfLogs();
    expect(metrics).toHaveLength(2);
    expect(metrics.map((metric) => metric.id)).toEqual(['broadcast:2', 'broadcast:1']);
    expect(metrics.map((metric) => metric.attributes?.sourceAppId).sort()).toEqual(['chart', 'prices']);
    expect(metrics.every((metric) => metric.duration >= 0)).toBe(true);
  });

  it('creates Chrome User Timing measures for completed FDC3 operations', async () => {
    const tracker = new PerformanceTracker();

    await tracker.measure('raiseIntent', async () => 'ok', { intent: 'ViewChart' });

    const entries = performance.getEntriesByType?.('measure') ?? [];
    expect(entries.some((entry) => entry.name.startsWith('fdc3:raiseIntent:'))).toBe(true);
  });
});
