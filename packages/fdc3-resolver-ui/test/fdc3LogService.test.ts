import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearFDC3Logs,
  destroyFDC3LogService,
  getFDC3LogEntries,
  initFDC3LogService,
  pushFDC3Log,
  subscribeToFDC3Logs,
} from '../src/fdc3-log/fdc3LogService';

type GlobalLogApi = {
  log(entry: Record<string, unknown>): void;
  subscribe(callback: (entry: unknown) => void): () => void;
  getEntries(): unknown[];
  clear(): void;
};

const runtime = globalThis as typeof globalThis & {
  __RATAN_FDC3__?: Record<string, unknown>;
  __RATAN_FDC3_LOGS__?: GlobalLogApi;
};

describe('FDC3 log service', () => {
  beforeEach(() => {
    destroyFDC3LogService();
    clearFDC3Logs();
    delete runtime.__RATAN_FDC3__;
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    destroyFDC3LogService();
    delete runtime.__RATAN_FDC3__;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('captures broker, console, external, and subscriber events with tile enrichment', () => {
    let brokerCallback: ((event: unknown) => void) | undefined;
    const brokerUnsubscribe = vi.fn();
    runtime.__RATAN_FDC3__ = {
      brokerInstance: {
        subscribeToLogs: vi.fn((callback: (event: unknown) => void) => {
          brokerCallback = callback;
          return brokerUnsubscribe;
        }),
        tileRegistry: {
          getAllTiles: () => [
            {
              instanceId: 'chart-1',
              appId: 'chart-app',
              metadata: { name: 'Chart Tile', title: 'Chart' },
            },
          ],
        },
      },
    };
    const received: string[] = [];
    const unsubscribe = subscribeToFDC3Logs((entry) => received.push(entry.message));
    subscribeToFDC3Logs(() => {
      throw new Error('subscriber failure');
    });

    initFDC3LogService();
    initFDC3LogService();
    for (const level of [0, 1, 2, 3, 4, 99]) {
      brokerCallback?.({
        level,
        category: level === 99 ? undefined : 'intent',
        message: level === 99 ? undefined : `broker-${level}`,
        data: { instanceId: 'chart-1' },
      });
    }
    brokerCallback?.('invalid-event');

    console.info('[Cashflow blotter] raised', { appId: 'chart-app' });
    console.warn('[IntentQueue] queued', { appId: 'chart-app' });
    console.log('[FMPTP FDC3] legacy', { appId: 'chart-app' });
    console.info('ordinary message');
    console.info({ not: 'text' });
    pushFDC3Log('error', 'intent', 'manual error', { appId: 'chart-app' }, 'tile');
    pushFDC3Log('warn', 'context', 'manual warning');
    pushFDC3Log('debug', 'general', 'manual debug');
    pushFDC3Log('perf', 'perf', 'manual performance');

    expect(getFDC3LogEntries()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'broker-0', tileId: 'chart-1', tileName: 'Chart Tile' }),
        expect.objectContaining({ message: '[Cashflow] raised' }),
        expect.objectContaining({ message: '[Queue] queued' }),
        expect.objectContaining({ message: 'legacy' }),
        expect.objectContaining({ message: 'manual error', tileId: 'chart-1' }),
      ]),
    );
    expect(received).toContain('manual warning');

    const copy = getFDC3LogEntries();
    copy.length = 0;
    expect(getFDC3LogEntries().length).toBeGreaterThan(0);
    unsubscribe();
    destroyFDC3LogService();
    expect(brokerUnsubscribe).toHaveBeenCalledOnce();
    expect(runtime.__RATAN_FDC3_LOGS__).toBeUndefined();
  });

  it('provides the external global API and resets ids when cleared', () => {
    initFDC3LogService();
    const api = runtime.__RATAN_FDC3_LOGS__!;
    const callback = vi.fn();
    const unsubscribe = api.subscribe(callback);

    api.log({
      level: 'info',
      category: 'channel',
      message: 'external entry',
      source: 'external',
      tileId: 'external-1',
      tileName: 'External App',
    });
    expect(callback).toHaveBeenCalled();
    expect(api.getEntries()).toEqual(
      expect.arrayContaining([expect.objectContaining({ message: 'external entry' })]),
    );

    unsubscribe();
    api.clear();
    api.log({ level: 'info', category: 'general', message: 'after clear' });
    expect(getFDC3LogEntries()).toEqual([expect.objectContaining({ id: 1 })]);
    clearFDC3Logs();
    expect(getFDC3LogEntries()).toEqual([]);
  });

  it('late-attaches to a broker and stops the poll timer', async () => {
    vi.useFakeTimers();
    const brokerUnsubscribe = vi.fn();
    initFDC3LogService();
    runtime.__RATAN_FDC3__ = {
      brokerInstance: {
        subscribeToLogs: vi.fn(() => brokerUnsubscribe),
        tileRegistry: { getAllTiles: () => [] },
      },
    };

    await vi.advanceTimersByTimeAsync(500);

    expect(getFDC3LogEntries()).toEqual(
      expect.arrayContaining([expect.objectContaining({ message: 'Broker subscribed (late attach)' })]),
    );
  });

  it('handles unavailable and failing broker registries and the safety timeout', async () => {
    vi.useFakeTimers();
    runtime.__RATAN_FDC3__ = { brokerInstance: {} };
    initFDC3LogService();
    runtime.__RATAN_FDC3__ = {
      brokerInstance: { tileRegistry: { getAllTiles: () => { throw new Error('not ready'); } } },
    };

    await vi.advanceTimersByTimeAsync(30_000);
    expect(getFDC3LogEntries().length).toBeGreaterThan(0);
  });

  it('maintains a bounded ring buffer', () => {
    for (let index = 0; index < 2_005; index += 1) {
      pushFDC3Log('debug', 'general', `entry-${index}`);
    }

    const entries = getFDC3LogEntries();
    expect(entries).toHaveLength(2_000);
    expect(entries[0]?.message).toBe('entry-5');
  });
});
