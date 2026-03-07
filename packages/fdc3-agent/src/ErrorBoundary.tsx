/**
 * React Error Boundary component for FDC3 Agent operations.
 *
 * @deprecated Use `ErrorBoundary` from `@fm/fdc3-broker` with theme="agent" instead.
 * This re-export is provided for backward compatibility.
 *
 * @example Migration
 * ```tsx
 * // Before:
 * import { ErrorBoundary } from '@fm/fdc3-agent';
 *
 * // After:
 * import { ErrorBoundary } from '@fm/fdc3-broker';
 * <ErrorBoundary theme="agent" title="FDC3 Agent Error" ... />
 * ```
 */

// Re-export from fdc3-broker with agent theme defaults
export { ErrorBoundary, ErrorBoundaryThemes } from 'ratan-fdc3-broker';
export type { ErrorBoundaryProps, ErrorBoundaryTheme } from 'ratan-fdc3-broker';
