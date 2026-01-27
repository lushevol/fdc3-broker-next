/**
 * Lazy loading utilities for @fm/fdc3-resolver-ui
 *
 * This module provides React.lazy wrappers for code-splitting the resolver UI
 * components, reducing the initial bundle size for applications that don't need
 * the resolver UI immediately on page load.
 *
 * @example
 * ```tsx
 * import { lazyResolverDialog, ResolverSuspense } from '@fm/fdc3-resolver-ui';
 *
 * function App() {
 *   const LazyResolver = lazyResolverDialog();
 *
 *   return (
 *     <ResolverSuspense fallback={<div>Loading...</div>}>
 *       <LazyResolver {...props} />
 *     </ResolverSuspense>
 *   );
 * }
 * ```
 */

import { type ComponentType, lazy, type ReactNode, Suspense } from 'react';
import type { AppCardProps, ContextPreviewProps, ResolverDialogProps } from './types';

/**
 * Lazy-loaded ResolverDialog component
 *
 * Use this to dynamically load the ResolverDialog only when needed,
 * reducing the initial bundle size.
 *
 * @example
 * ```tsx
 * import { lazyResolverDialog } from '@fm/fdc3-resolver-ui';
 *
 * const Resolver = lazyResolverDialog();
 *
 * <Resolver open={true} intent="ViewChart" context={context} targets={targets} ... />
 * ```
 *
 * @returns A lazy-loaded React component
 */
export function lazyResolverDialog(): ComponentType<ResolverDialogProps> {
  return lazy(() => import('./ResolverDialog').then((mod) => ({ default: mod.ResolverDialog })));
}

/**
 * Lazy-loaded AppCard component
 *
 * Use this to dynamically load the AppCard component only when needed.
 *
 * @example
 * ```tsx
 * import { lazyAppCard } from '@fm/fdc3-resolver-ui';
 *
 * const Card = lazyAppCard();
 *
 * <Card app={appMetadata} selected={true} ... />
 * ```
 *
 * @returns A lazy-loaded React component
 */
export function lazyAppCard(): ComponentType<AppCardProps> {
  return lazy(() => import('./AppCard').then((mod) => ({ default: mod.AppCard })));
}

/**
 * Lazy-loaded ContextPreview component
 *
 * Use this to dynamically load the ContextPreview component only when needed.
 *
 * @example
 * ```tsx
 * import { lazyContextPreview } from '@fm/fdc3-resolver-ui';
 *
 * const Preview = lazyContextPreview();
 *
 * <Preview context={context} />
 * ```
 *
 * @returns A lazy-loaded React component
 */
export function lazyContextPreview(): ComponentType<ContextPreviewProps> {
  return lazy(() => import('./ContextPreview').then((mod) => ({ default: mod.ContextPreview })));
}

/**
 * Suspense boundary wrapper for resolver components
 *
 * Provides a consistent loading fallback for lazy-loaded resolver components.
 *
 * @example
 * ```tsx
 * import { lazyResolverDialog, ResolverSuspense } from '@fm/fdc3-resolver-ui';
 *
 * const LazyResolver = lazyResolverDialog();
 *
 * <ResolverSuspense fallback={<div>Loading resolver...</div>}>
 *   <LazyResolver {...props} />
 * </ResolverSuspense>
 * ```
 *
 * @props
 * @param children - The lazy-loaded component to render
 * @param fallback - Content to show while the component is loading (default: simple loading message)
 */
export function ResolverSuspense({
  children,
  fallback = <ResolverLoadingFallback />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * Default loading fallback component
 *
 * A simple loading indicator used by default in ResolverSuspense.
 */
function ResolverLoadingFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e0e0e0',
              borderTop: '2px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span>Loading resolver...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

/**
 * Preload resolver components
 *
 * Use this to prefetch resolver components before they're needed,
 * improving the user experience when the resolver is shown.
 *
 * @example
 * ```tsx
 * import { preloadResolver } from '@fm/fdc3-resolver-ui';
 *
 * // Preload when user hovers over a button
 * <button onMouseEnter={preloadResolver}>
 *   Show Resolver
 * </button>
 *
 * // Or preload on mount
 * useEffect(() => {
 *   preloadResolver();
 * }, []);
 * ```
 */
export function preloadResolver(): void {
  // Trigger lazy import to preload the component
  void import('./ResolverDialog');
  void import('./AppCard');
  void import('./ContextPreview');
}
