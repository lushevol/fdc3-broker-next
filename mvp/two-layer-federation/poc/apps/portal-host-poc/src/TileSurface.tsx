import { useEffect, useRef, useState } from 'react';
import { createCapabilities, type TelemetryEvent } from './platformCapabilities';
import { loaderFor } from './tileLoader';
import { adoptTileStyles, type TileWorkspaceElement } from './tileWorkspace';
import type { TileInstance } from './workspaceStore';

interface Props {
  active: boolean;
  instance: TileInstance;
  onClose(instanceId: string): void;
  onTelemetry(event: TelemetryEvent): void;
}

export function TileSurface({ active, instance, onClose, onTelemetry }: Props) {
  const element = useRef<TileWorkspaceElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const workspace = element.current;
    if (!workspace) return;
    let disposed = false;
    let unmount: (() => void | Promise<void>) | undefined;
    let releaseStyles: (() => void) | undefined;
    const capabilities = createCapabilities({
      tileId: instance.entry.tileId,
      instanceId: instance.instanceId,
      close: () => onClose(instance.instanceId),
      onEvent: onTelemetry,
    });
    if ((globalThis as typeof globalThis & { fin?: unknown }).fin) {
      capabilities.telemetry.track('openfin.available');
    }

    loaderFor(instance.entry).load(instance.entry)
      .then(async (module) => {
        if (disposed) return;
        releaseStyles = adoptTileStyles(workspace.tileRoot, module.styleUrls ?? []);
        await module.mount({
          tileId: instance.entry.tileId,
          instanceId: instance.instanceId,
          root: workspace.tileRoot,
          capabilities,
        });
        unmount = module.unmount ? () => module.unmount?.(instance.instanceId) : undefined;
        capabilities.telemetry.track('portal.tile.mount.succeeded');
      })
      .catch((reason: unknown) => {
        if (disposed) return;
        setError(reason instanceof Error ? reason.message : String(reason));
        capabilities.telemetry.track('portal.tile.mount.failed', 'failed');
      });

    return () => {
      disposed = true;
      void unmount?.();
      releaseStyles?.();
    };
  }, [instance, onClose, onTelemetry]);

  if (error) {
    return <section role="alert">{instance.entry.displayName} could not load: {error}</section>;
  }
  return (
    <tile-workspace
      ref={element}
      aria-hidden={!active}
      data-instance-id={instance.instanceId}
      data-tile-id={instance.entry.tileId}
      hidden={!active}
    />
  );
}
