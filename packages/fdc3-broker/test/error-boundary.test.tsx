import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary, ErrorBoundaryThemes, type ErrorBoundaryTheme } from '../src/ErrorBoundary';

function ThrowingChild({ message = 'boom' }: { message?: string }) {
  throw new Error(message);
}

describe('ErrorBoundary', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('should render children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Healthy FDC3 child</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Healthy FDC3 child')).toBeInTheDocument();
  });

  it('should render a custom fallback after catching an error', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>} onError={onError}>
        <ThrowingChild message="resolver exploded" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
    expect(consoleError).toHaveBeenCalledWith(
      'FDC3 Error Boundary caught an error:',
      expect.objectContaining({
        error: expect.any(Error),
        componentStack: expect.any(String),
      }),
    );
  });

  it('should render the default fallback with title, description, and error message', () => {
    render(
      <ErrorBoundary
        title="Broker failed"
        description="The broker could not complete the operation."
      >
        <ThrowingChild message="intent delivery failed" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Broker failed')).toBeInTheDocument();
    expect(screen.getByText('The broker could not complete the operation.')).toBeInTheDocument();
    expect(screen.getByText('intent delivery failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('should apply hover styles to fallback action buttons', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild message="hoverable failure" />
      </ErrorBoundary>,
    );

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });

    fireEvent.mouseEnter(retryButton);
    expect(retryButton).toHaveStyle({
      backgroundColor: ErrorBoundaryThemes.default.primaryColorDark,
    });
    fireEvent.mouseLeave(retryButton);
    expect(retryButton).toHaveStyle({ backgroundColor: ErrorBoundaryThemes.default.primaryColor });

    fireEvent.mouseEnter(dismissButton);
    expect(dismissButton).toHaveStyle({ backgroundColor: '#e0e0e0' });
    fireEvent.mouseLeave(dismissButton);
    expect(dismissButton).toHaveStyle({ backgroundColor: '#f5f5f5' });
  });

  it('should reset and re-render children when retry is clicked', () => {
    let shouldThrow = true;
    function MaybeThrowingChild() {
      if (shouldThrow) {
        throw new Error('temporary failure');
      }
      return <div>Recovered child</div>;
    }

    render(
      <ErrorBoundary>
        <MaybeThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('temporary failure')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Recovered child')).toBeInTheDocument();
  });

  it('should call onClose and reset when the close button is clicked', () => {
    let shouldThrow = true;
    const onClose = vi.fn();
    function MaybeThrowingChild() {
      if (shouldThrow) {
        throw new Error('closeable failure');
      }
      return <div>Closed fallback</div>;
    }

    render(
      <ErrorBoundary onClose={onClose} closeButtonText="Close Resolver">
        <MaybeThrowingChild />
      </ErrorBoundary>,
    );

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'Close Resolver' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Closed fallback')).toBeInTheDocument();
  });

  it('should hide retry for non-recoverable errors', () => {
    render(
      <ErrorBoundary recoverable={false}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('should show development stack details when NODE_ENV is development', () => {
    vi.stubEnv('NODE_ENV', 'development');

    render(
      <ErrorBoundary>
        <ThrowingChild message="development failure" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
    expect(screen.getAllByText(/development failure/).length).toBeGreaterThanOrEqual(2);
  });

  it('should apply predefined and custom themes', () => {
    const customTheme: ErrorBoundaryTheme = {
      primaryColor: '#111111',
      primaryColorDark: '#222222',
      backgroundColor: '#eeeeee',
      borderColor: '#333333',
      errorBgColor: '#dddddd',
      errorBorderColor: '#444444',
      errorTextColor: '#555555',
    };

    const { rerender } = render(
      <ErrorBoundary theme="resolver">
        <ThrowingChild message="resolver themed failure" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveStyle({
      backgroundColor: ErrorBoundaryThemes.resolver.backgroundColor,
    });

    rerender(
      <ErrorBoundary theme={customTheme}>
        <ThrowingChild message="custom themed failure" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveStyle({ backgroundColor: customTheme.backgroundColor });
  });

  it('should fallback to the default theme for an unknown theme key', () => {
    render(
      <ErrorBoundary theme={'unknown' as never}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveStyle({
      backgroundColor: ErrorBoundaryThemes.default.backgroundColor,
    });
  });

  it('should catch errors thrown by onError and onClose callbacks', () => {
    const onError = vi.fn(() => {
      throw new Error('onError failed');
    });
    const onClose = vi.fn(() => {
      throw new Error('onClose failed');
    });

    render(
      <ErrorBoundary onError={onError} onClose={onClose}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(consoleError).toHaveBeenCalledWith('Error in onError handler:', expect.any(Error));
    expect(consoleError).toHaveBeenCalledWith('Error in onClose handler:', expect.any(Error));
  });
});
