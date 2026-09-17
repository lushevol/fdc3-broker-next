import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Loader, PageLoader, RatanDesignProvider, Snackbar } from '../src';

describe('public feedback controls', () => {
  it('announces loading without requiring visible text and accepts dimensions', () => {
    const { rerender } = render(<Loader />);
    const status = screen.getByRole('status', { name: 'Loading...' });
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(status.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(status.querySelector('svg')?.parentElement).toHaveStyle({
      width: '90px',
      height: '90px',
    });

    rerender(<Loader text="Loading trades" size="32px" aria-label="Refreshing trades" />);
    expect(screen.getByRole('status', { name: 'Refreshing trades' })).toHaveTextContent(
      'Loading trades',
    );
    expect(screen.getByText('Loading trades')).toBeVisible();
    expect(screen.getByRole('status').querySelector('svg')?.parentElement).toHaveStyle({
      width: '32px',
      height: '32px',
    });

    rerender(<PageLoader text="Loading workspace" size={20} data-testid="page" />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status', { name: 'Loading workspace' })).toBeVisible();
    expect(screen.getByTestId('page')).toContainElement(screen.getByRole('status'));
    expect(screen.getByRole('status').querySelector('svg')?.parentElement).toHaveStyle({
      width: '20px',
      height: '20px',
    });
  });
});

describe('public notification content', () => {
  it('treats strings as text and preserves React content and actions', () => {
    const retry = vi.fn();
    const { rerender } = render(<Snackbar open message="<b>Pending</b>" />);
    expect(screen.getByText('<b>Pending</b>')).toBeVisible();
    expect(screen.getByText('<b>Pending</b>').querySelector('b')).toBeNull();

    rerender(
      <Snackbar
        open
        message={<button onClick={retry}>Retry transfer</button>}
        action={<button onClick={retry}>Undo</button>}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry transfer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(retry).toHaveBeenCalledTimes(2);
  });

  it('forwards dismissal events and auto-hide reasons', () => {
    vi.useFakeTimers();
    try {
      const close = vi.fn();
      render(<Snackbar open message="Saved" onClose={close} autoHideDuration={1000} />);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(close).toHaveBeenCalledOnce();
      close.mockClear();
      act(() => vi.advanceTimersByTime(1000));
      expect(close).toHaveBeenCalledWith(null, 'timeout');
    } finally {
      vi.useRealTimers();
    }
  });

  it.each(['light', 'dark'] as const)('supports WebKit feedback in %s mode', (mode) => {
    render(
      <RatanDesignProvider mode={mode} designGeneration="webkit">
        <PageLoader
          text="Refreshing"
          size={24}
          slotProps={{ loader: { 'aria-label': 'Fetching' } }}
        />
        <Snackbar
          open
          message="Refresh complete"
          severity="success"
          variant="outlined"
          alertsx={(theme) => ({ padding: theme.spacing(2) })}
        />
      </RatanDesignProvider>,
    );
    expect(screen.getByRole('status', { name: 'Fetching' })).toHaveTextContent('Refreshing');
    expect(screen.getByText('Refresh complete')).toBeVisible();
  });
});
