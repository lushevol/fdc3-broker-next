import { createRoot, type Root } from 'react-dom/client';

export const manifest = { tileId: 'positions', contractVersion: '0.1' } as const;

interface TileMountInput {
  tileId: string;
  instanceId: string;
  root: ShadowRoot;
  capabilities: {
    close(): void;
    telemetry: { track(event: string): void };
    fdc3: { raise(intent: string, context?: unknown): void };
  };
}

const mountedRoots = new Map<string, Root>();

function PositionsTile({ capabilities }: Pick<TileMountInput, 'capabilities'>) {
  return (
    <section aria-label="Positions tile" style={{ color: '#e8eef9', fontFamily: 'system-ui', padding: '16px' }}>
      <p style={{ color: '#87a4ca', margin: 0 }}>Operations / Portfolio</p>
      <h2 style={{ margin: '6px 0 12px' }}>Positions</h2>
      <p style={{ margin: '0 0 16px' }}>A second independently mountable Tile in the POC workspace.</p>
      <button
        type="button"
        onClick={() => {
          capabilities.telemetry.track('positions.fdc3.broadcast');
          capabilities.fdc3.raise('ViewChart', { type: 'fdc3.instrument', id: { ticker: 'ACME' } });
        }}
      >
        Broadcast sample instrument
      </button>
    </section>
  );
}

export function mount(input: TileMountInput): void {
  const root = createRoot(input.root);
  mountedRoots.set(input.instanceId, root);
  root.render(<PositionsTile capabilities={input.capabilities} />);
}

export function unmount(instanceId: string): void {
  mountedRoots.get(instanceId)?.unmount();
  mountedRoots.delete(instanceId);
}

export default { manifest, mount, unmount };
