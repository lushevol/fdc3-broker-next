import {
  createContext,
  useContext,
  type PropsWithChildren,
} from 'react';
import './generated/tokens.css';
import './components.css';
import type {
  DesignDensity,
  DesignScheme,
} from './foundation/tokens';

export interface DesignAppearance {
  readonly scheme: DesignScheme;
  readonly density: DesignDensity;
  readonly direction: 'ltr' | 'rtl';
}

export type DesignScope = 'host' | 'application' | 'standalone' | 'storybook';

interface DesignSystemContextValue {
  readonly portalContainer?: Element;
  readonly appearance?: DesignAppearance;
}

const DesignSystemContext = createContext<DesignSystemContextValue>({});

export interface DesignSystemProviderProps extends PropsWithChildren {
  readonly appearance: DesignAppearance;
  readonly scope?: DesignScope;
  /**
   * Local overlay target for a host or Tile root. When omitted, React Aria
   * portals to document.body.
   */
  readonly portalContainer?: Element;
}

export function useDesignSystemContext(): DesignSystemContextValue {
  return useContext(DesignSystemContext);
}

export function DesignSystemProvider({
  appearance,
  scope = 'application',
  portalContainer,
  children,
}: DesignSystemProviderProps) {
  return (
    <DesignSystemContext.Provider value={{ portalContainer, appearance }}>
      <div
        className="ratan-design-root"
        data-ratan-scope={scope}
        data-ratan-theme={appearance.scheme}
        data-ratan-density={appearance.density}
        dir={appearance.direction}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
}
