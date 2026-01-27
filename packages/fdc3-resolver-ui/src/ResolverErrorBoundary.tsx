/**
 * React Error Boundary component for FDC3 Resolver Dialog operations.
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors to console with detailed context, and displays a fallback UI
 * instead of the crashed component tree. It is specifically designed to handle
 * errors in the FDC3 intent resolution dialog, allowing graceful fallback when
 * the resolver fails to display or operate correctly.
 *
 * @example Basic Usage
 * ```tsx
 * import { ResolverErrorBoundary, ResolverDialog } from '@fm/fdc3-resolver-ui';
 *
 * <ResolverErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Resolver error:', error, errorInfo);
 *   }}
 * >
 *   <ResolverDialog
 *     open={open}
 *     intent={intent}
 *     context={context}
 *     targets={targets}
 *     onSelect={handleSelect}
 *     onCancel={handleCancel}
 *   />
 * </ResolverErrorBoundary>
 * ```
 *
 * @example With Custom Fallback
 * ```tsx
 * <ResolverErrorBoundary
 *   fallback={
 *     <div className="resolver-error">
 *       <h2>Unable to Show App Selection</h2>
 *       <p>Please try again or select an app manually.</p>
 *       <button onClick={handleCancel}>Close</button>
 *     </div>
 *   }
 * >
 *   <ResolverDialog {...props} />
 * </ResolverErrorBoundary>
 * ```
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Props for the ResolverErrorBoundary component
 */
export interface ResolverErrorBoundaryProps {
  /** Child components to be wrapped by the error boundary */
  children: ReactNode;
  /** Custom fallback UI to display when an error is caught */
  fallback?: ReactNode;
  /** Callback function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether the error is recoverable (shows retry button) */
  recoverable?: boolean;
  /** Callback to cancel the resolver operation */
  onCancel?: () => void;
}

/**
 * State for the ResolverErrorBoundary component
 */
interface ResolverErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * Default fallback UI component for resolver errors
 */
function DefaultFallback({
  error,
  recoverable,
  onRetry,
  onCancel,
}: {
  error: Error | null;
  recoverable: boolean;
  onRetry: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      style={{
        padding: '24px',
        margin: '16px',
        backgroundColor: '#f3e5f5',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      role="alertdialog"
      aria-labelledby="resolver-error-title"
      aria-describedby="resolver-error-desc"
    >
      <h2
        id="resolver-error-title"
        style={{
          color: '#7b1fa2',
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
        }}
      >
        Intent Resolution Error
      </h2>

      <p
        id="resolver-error-desc"
        style={{
          color: '#333',
          marginBottom: '16px',
          lineHeight: '1.5',
        }}
      >
        We encountered an error while trying to display the app selection dialog. This may prevent
        you from choosing which application should handle this intent.
      </p>

      {error && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#e1bee7',
            borderRadius: '4px',
            border: '1px solid #ce93d8',
          }}
        >
          <strong>Error Message:</strong>
          <p
            style={{
              margin: '8px 0 0 0',
              color: '#6a1b9a',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          >
            {error.message}
          </p>
        </div>
      )}

      {isDevelopment && error && (
        <details
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontWeight: '600',
              color: '#666',
              marginBottom: '8px',
            }}
          >
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              margin: '8px 0 0 0',
              padding: '12px',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              color: '#6a1b9a',
            }}
          >
            {error.stack}
          </pre>
        </details>
      )}

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        {recoverable && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7b1fa2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#9c27b0';
            }}
          >
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
        >
          Cancel Operation
        </button>
      </div>
    </div>
  );
}

/**
 * ResolverErrorBoundary component for catching and handling errors in FDC3 resolver operations
 *
 * Features:
 * - Catches JavaScript errors in the resolver dialog
 * - Logs errors with detailed context to console
 * - Displays user-friendly error messages
 * - Provides recovery options (retry, cancel)
 * - Supports custom fallback UI
 * - Shows detailed error info in development mode
 * - Allows graceful fallback when resolver fails
 *
 * Common errors handled:
 * - Intent resolution errors
 * - Target application retrieval errors
 * - Context validation errors
 * - Rendering errors in resolver dialog
 */
export class ResolverErrorBoundary extends Component<
  ResolverErrorBoundaryProps,
  ResolverErrorBoundaryState
> {
  constructor(props: ResolverErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ResolverErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details and call custom error handler
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console with detailed context
    console.error('FDC3 Resolver Error Boundary caught an error:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      digest: (errorInfo as any).digest,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in onError handler:', handlerError);
      }
    }
  }

  /**
   * Handle retry action - reset error state and retry
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Handle cancel action - hide error UI and trigger cancel callback
   */
  handleCancel = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    // Trigger cancel callback if provided
    if (this.props.onCancel) {
      try {
        this.props.onCancel();
      } catch (cancelError) {
        console.error('Error in onCancel handler:', cancelError);
      }
    }
  };

  /**
   * Render fallback UI or children
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use default fallback UI
      return (
        <DefaultFallback
          error={this.state.error}
          recoverable={this.props.recoverable ?? true}
          onRetry={this.handleRetry}
          onCancel={this.handleCancel}
        />
      );
    }

    return this.props.children;
  }
}
