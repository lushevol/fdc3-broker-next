/**
 * React Error Boundary component for FDC3 Agent operations.
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors to console with detailed context, and displays a fallback UI
 * instead of the crashed component tree. It is specifically designed to handle
 * errors in FDC3 agent hooks and operations like raiseIntent, broadcast, and
 * context/listener management.
 *
 * @example Basic Usage
 * ```tsx
 * import { ErrorBoundary, AgentProvider } from '@fm/fdc3-agent';
 *
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Agent error:', error, errorInfo);
 *   }}
 * >
 *   <AgentProvider>
 *     <YourTileComponent />
 *   </AgentProvider>
 * </ErrorBoundary>
 * ```
 *
 * @example With Custom Fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={
 *     <div className="agent-error">
 *       <h2>FDC3 Connection Error</h2>
 *       <p>Unable to connect to FDC3 broker.</p>
 *     </div>
 *   }
 *   recoverable={false}
 * >
 *   <AgentProvider>{children}</AgentProvider>
 * </ErrorBoundary>
 * ```
 *
 * @example Handling Specific Operations
 * ```tsx
 * function MyTile() {
 *   const fdc3 = useFDC3();
 *
 *   const handleBroadcast = async (context: Context) => {
 *     try {
 *       await fdc3.broadcast(context);
 *     } catch (error) {
 *       // Handle individual operation errors
 *       console.error('Broadcast failed:', error);
 *     }
 *   };
 *
 *   return <button onClick={() => handleBroadcast(context)} />;
 * }
 * ```
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Child components to be wrapped by the error boundary */
  children: ReactNode;
  /** Custom fallback UI to display when an error is caught */
  fallback?: ReactNode;
  /** Callback function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether the error is recoverable (shows retry button) */
  recoverable?: boolean;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * Default fallback UI component
 */
function DefaultFallback({
  error,
  recoverable,
  onRetry,
  onDismiss,
}: {
  error: Error | null;
  recoverable: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}): React.JSX.Element {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      style={{
        padding: '24px',
        margin: '16px',
        backgroundColor: '#fff8e1',
        border: '2px solid #ffa000',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: '200px',
      }}
      role="alert"
      aria-live="polite"
    >
      <h2
        style={{
          color: '#f57c00',
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
        }}
      >
        FDC3 Agent Error
      </h2>

      <p
        style={{
          color: '#333',
          marginBottom: '16px',
          lineHeight: '1.5',
        }}
      >
        Something went wrong with the FDC3 agent. This may affect the ability to communicate with
        other applications.
      </p>

      {error && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            border: '1px solid #ffe0b2',
          }}
        >
          <strong>Error Message:</strong>
          <p
            style={{
              margin: '8px 0 0 0',
              color: '#ef6c00',
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
              color: '#ef6c00',
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
        }}
      >
        {recoverable && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1565c0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2';
            }}
          >
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
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
          Dismiss
        </button>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary component for catching and handling errors in FDC3 agent operations
 *
 * Features:
 * - Catches JavaScript errors in child components
 * - Logs errors with detailed context to console
 * - Displays user-friendly error messages
 * - Provides recovery options (retry, dismiss)
 * - Supports custom fallback UI
 * - Shows detailed error info in development mode
 *
 * Common errors handled:
 * - FDC3 operation errors (raiseIntent, broadcast, etc.)
 * - Context/listener management errors
 * - Broker connection errors
 * - Intent resolution errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
    console.error('FDC3 Agent Error Boundary caught an error:', {
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
   * Handle dismiss action - keep error state but hide UI
   */
  handleDismiss = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
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
          onDismiss={this.handleDismiss}
        />
      );
    }

    return this.props.children;
  }
}
