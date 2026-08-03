import { createCapabilities } from './platformCapabilities';

it('correlates local telemetry, FDC3 intents, and close capability per Tile instance', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2026-07-27T08:00:00.000Z'));
  const close = jest.fn();
  const onEvent = jest.fn();
  const raiseIntent = jest.fn().mockResolvedValue(undefined);
  (globalThis as typeof globalThis & { fdc3?: unknown }).fdc3 = { raiseIntent };
  const capabilities = createCapabilities({ close, onEvent, tileId: 'cashflow', instanceId: 'cashflow-1' });
  capabilities.close();
  capabilities.telemetry.track('cashflow.opened');
  capabilities.telemetry.track('cashflow.failed', 'failed');
  await capabilities.fdc3.raise('ViewChart', { type: 'fdc3.instrument' });
  expect(close).toHaveBeenCalledTimes(1);
  expect(onEvent).toHaveBeenNthCalledWith(1, expect.objectContaining({ action: 'cashflow.opened', correlationId: 'cashflow-1-interaction', outcome: 'succeeded' }));
  expect(onEvent).toHaveBeenNthCalledWith(2, expect.objectContaining({ action: 'cashflow.failed', outcome: 'failed' }));
  expect(onEvent).toHaveBeenNthCalledWith(3, expect.objectContaining({ action: 'fdc3.ViewChart.requested', timestamp: '2026-07-27T08:00:00.000Z' }));
  expect(raiseIntent).toHaveBeenCalledWith('ViewChart', { type: 'fdc3.instrument' });
  delete (globalThis as typeof globalThis & { fdc3?: unknown }).fdc3;
  jest.useRealTimers();
});
