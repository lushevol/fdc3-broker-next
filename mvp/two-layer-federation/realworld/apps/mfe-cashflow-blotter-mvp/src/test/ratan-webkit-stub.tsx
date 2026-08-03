import type { PropsWithChildren } from 'react';

interface DesignSystemProviderProps extends PropsWithChildren {
  appearance?: { scheme?: string };
}

export function DesignSystemProvider({ appearance, children }: DesignSystemProviderProps) {
  return <div data-ratan-theme={appearance?.scheme}>{children}</div>;
}
