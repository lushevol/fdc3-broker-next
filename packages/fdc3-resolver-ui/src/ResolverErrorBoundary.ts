/**
 * React Error Boundary component for FDC3 Resolver Dialog operations.
 *
 * @deprecated Use `ErrorBoundary` from `@fm/fdc3-broker` with theme="resolver" instead.
 * This re-export is provided for backward compatibility.
 *
 * @example Migration
 * ```tsx
 * // Before:
 * import { ResolverErrorBoundary } from '@fm/fdc3-resolver-ui';
 *
 * // After:
 * import { ErrorBoundary } from '@fm/fdc3-broker';
 * <ErrorBoundary
 *   theme="resolver"
 *   title="Intent Resolution Error"
 *   description="We encountered an error while trying to display the app selection dialog."
 *   closeButtonText="Cancel Operation"
 *   onClose={handleCancel}
 *   ... />
 * ```
 */

import { ErrorBoundary as ErrorBoundaryComponent, ErrorBoundaryThemes } from 'ratan-fdc3-broker';
import type { ErrorBoundaryProps, ErrorBoundaryTheme } from 'ratan-fdc3-broker';

// Re-export types
export type { ErrorBoundaryProps, ErrorBoundaryTheme };

// Re-export the ErrorBoundary class and themes
export { ErrorBoundaryComponent as ErrorBoundary, ErrorBoundaryThemes };

/**
 * @deprecated Use `ErrorBoundary` from `@fm/fdc3-broker` instead.
 * This alias is provided for backward compatibility.
 */
export const ResolverErrorBoundary = ErrorBoundaryComponent;
