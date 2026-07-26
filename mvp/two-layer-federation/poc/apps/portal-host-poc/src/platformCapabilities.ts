export interface TelemetryEvent {
  action: string;
  correlationId: string;
  instanceId: string;
  outcome: 'succeeded' | 'failed';
  tileId: string;
  timestamp: string;
}

export interface TileTelemetry {
  track(action: string, outcome?: TelemetryEvent['outcome']): void;
}

export interface TileFdc3 {
  raise(intent: string, context?: unknown): Promise<void>;
}

export interface TileCapabilities {
  close(): void;
  fdc3: TileFdc3;
  telemetry: TileTelemetry;
}

export function createCapabilities(input: {
  close(): void;
  instanceId: string;
  onEvent(event: TelemetryEvent): void;
  tileId: string;
}): TileCapabilities {
  const correlationId = `${input.instanceId}-interaction`;
  const event = (action: string, outcome: TelemetryEvent['outcome']) => input.onEvent({
    action,
    correlationId,
    instanceId: input.instanceId,
    outcome,
    tileId: input.tileId,
    timestamp: new Date().toISOString(),
  });

  return {
    close: input.close,
    telemetry: { track: (action, outcome = 'succeeded') => event(action, outcome) },
    fdc3: {
      async raise(intent, context) {
        const fdc3 = (globalThis as typeof globalThis & {
          fdc3?: { raiseIntent(intent: string, context?: unknown): Promise<unknown> };
        }).fdc3;
        if (fdc3) await fdc3.raiseIntent(intent, context);
        event(`fdc3.${intent}.requested`, 'succeeded');
      },
    },
  };
}
