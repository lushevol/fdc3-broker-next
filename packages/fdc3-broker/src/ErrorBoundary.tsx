/**
 * React Error Boundary component for FDC3 operations.
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors to console with detailed context, and displays a fallback UI
 * instead of the crashed component tree.
 *
 * @example Basic Usage
 * ```tsx
 * import { ErrorBoundary } from '@fm/fdc3-broker';
 *
 * <ErrorBoundary
 *   title="FDC3 Error"
 *   onError={(error, errorInfo) => {
 *     console.error('Error:', error, errorInfo);
 *   }}
 * >
 *   {children}
 * </ErrorBoundary>
 * ```
 *
 * @example With Custom Fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>Something went wrong</div>}
 * >
 *   {children}
 * </ErrorBoundary>
 * ```
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Theme configuration for ErrorBoundary
 */
export interface ErrorBoundaryTheme {
  /** Primary color for headers and accents */
  primaryColor: string;
  /** Darker shade for hover states */
  primaryColorDark: string;
  /** Background color for the container */
  backgroundColor: string;
  /** Border color */
  borderColor: string;
  /** Error message background color */
  errorBgColor: string;
  /** Error message border color */
  errorBorderColor: string;
  /** Error text color */
  errorTextColor: string;
}

/**
 * Predefined themes for common use cases
 */
export const ErrorBoundaryThemes = {
  /** Default blue theme */
  default: {
    primaryColor: '#1976d2',
    primaryColorDark: '#1565c0',
    backgroundColor: '#fff3f3',
    borderColor: '#f44336',
    errorBgColor: '#ffebee',
    errorBorderColor: '#ffcdd2',
    errorTextColor: '#d32f2f',
  } satisfies ErrorBoundaryTheme,

  /** Agent theme (orange/amber) */
  agent: {
    primaryColor: '#1976d2',
    primaryColorDark: '#1565c0',
    backgroundColor: '#fff8e1',
    borderColor: '#ffa000',
    errorBgColor: '#fff3e0',
    errorBorderColor: '#ffe0b2',
    errorTextColor: '#ef6c00',
  } satisfies ErrorBoundaryTheme,

  /** Broker theme (red) */
  broker: {
    primaryColor: '#1976d2',
    primaryColorDark: '#1565c0',
    backgroundColor: '#fff3f3',
    borderColor: '#f44336',
    errorBgColor: '#ffebee',
    errorBorderColor: '#ffcdd2',
    errorTextColor: '#d32f2f',
  } satisfies ErrorBoundaryTheme,

  /** Resolver theme (purple) */
  resolver: {
    primaryColor: '#9c27b0',
    primaryColorDark: '#7b1fa2',
    backgroundColor: '#f3e5f5',
    borderColor: '#9c27b0',
    errorBgColor: '#e1bee7',
    errorBorderColor: '#ce93d8',
    errorTextColor: '#6a1b9a',
  } satisfies ErrorBoundaryTheme,
} as const;

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Child components to be wrapped by the error boundary */
  children: ReactNode;
  /** Title displayed in the error UI */
  title?: string;
  /** Description displayed in the error UI */
  description?: string;
  /** Custom fallback UI to display when an error is caught */
  fallback?: ReactNode;
  /** Callback function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether the error is recoverable (shows retry button) */
  recoverable?: boolean;
  /** Callback when close/dismiss action is triggered */
  onClose?: () => void;
  /** Text for the close/dismiss button */
  closeButtonText?: string;
  /** Theme configuration or predefined theme name */
  theme?: ErrorBoundaryTheme | keyof typeof ErrorBoundaryThemes;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default fallback UI component
 */
function DefaultFallback({
  error,
  title,
  description,
  recoverable,
  onRetry,
  onClose,
  closeButtonText,
  theme,
}: {
  error: Error | null;
  title: string;
  description: string;
  recoverable: boolean;
  onRetry: () => void;
  onClose: () => void;
  closeButtonText: string;
  theme: ErrorBoundaryTheme;
}): React.JSX.Element {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      style={{
        padding: '24px',
        margin: '16px',
        backgroundColor: theme.backgroundColor,
        border: `2px solid ${theme.borderColor}`,
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      role="alert"
      aria-live="polite"
    >
      <h2
        style={{
          color: theme.errorTextColor,
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: '#333',
          marginBottom: '16px',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>

      {error && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: theme.errorBgColor,
            borderRadius: '4px',
            border: `1px solid ${theme.errorBorderColor}`,
          }}
        >
          <strong>Error Message:</strong>
          <p
            style={{
              margin: '8px 0 0 0',
              color: theme.errorTextColor,
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
              color: theme.errorTextColor,
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
              backgroundColor: theme.primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryColorDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryColor;
            }}
          >
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
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
          {closeButtonText}
        </button>
      </div>
    </div>
  );
}

/**
 * Get theme configuration from props
 */
function getTheme(theme?: ErrorBoundaryProps['theme']): ErrorBoundaryTheme {
  if (!theme) {
    return ErrorBoundaryThemes.default;
  }
  if (typeof theme === 'string') {
    return ErrorBoundaryThemes[theme] ?? ErrorBoundaryThemes.default;
  }
  return theme;
}

/**
 * ErrorBoundary component for catching and handling errors in FDC3 operations
 *
 * Features:
 * - Catches JavaScript errors in child components
 * - Logs errors with detailed context to console
 * - Displays user-friendly error messages
 * - Provides recovery options (retry, dismiss)
 * - Supports custom fallback UI
 * - Shows detailed error info in development mode
 * - Configurable theme and text
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('FDC3 Error Boundary caught an error:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      digest: (errorInfo as any).digest,
    });

    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in onError handler:', handlerError);
      }
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleClose = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.onClose) {
      try {
        this.props.onClose();
      } catch (closeError) {
        console.error('Error in onClose handler:', closeError);
      }
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const theme = getTheme(this.props.theme);
      const title = this.props.title ?? 'FDC3 Error';
      const description = this.props.description ?? 'Something went wrong. This may affect functionality.';

      return (
        <DefaultFallback
          error={this.state.error}
          title={title}
          description={description}
          recoverable={this.props.recoverable ?? true}
          onRetry={this.handleRetry}
          onClose={this.handleClose}
          closeButtonText={this.props.closeButtonText ?? 'Dismiss'}
          theme={theme}
        />
      );
    }

    return this.props.children;
  }
}