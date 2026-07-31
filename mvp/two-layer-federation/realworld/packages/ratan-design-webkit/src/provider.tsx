import {
  DesignSystemProvider as EstablishedDesignSystemProvider,
  type DesignSystemProviderProps,
} from '@fm/ratan-design';
import '@fm/ratan-design/styles.css';
import './styles.css';

/**
 * Activates the WebKit token layer without changing the established provider
 * contract used by independently deployed applications.
 */
export function WebkitDesignSystemProvider({
  children,
  scope = 'application',
  ...props
}: DesignSystemProviderProps) {
  return (
    <EstablishedDesignSystemProvider scope={scope} {...props}>
      <div
        className="ratan-webkit-root"
        data-design-system="ratan-webkit"
        data-ratan-webkit-scope={scope}
      >
        {children}
      </div>
    </EstablishedDesignSystemProvider>
  );
}
