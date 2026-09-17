import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Snackbar from '.';
import { PREFIX } from './common/style';

describe('Base notification HTML compatibility', () => {
  it('keeps formatting, removes unsafe HTML, and forwards actions and dismissal', () => {
    const close = vi.fn();
    const undo = vi.fn();
    render(
      <Snackbar
        open
        severity="success"
        variant="outlined"
        message={
          '<b>Transfer approved</b><img src="bad" onerror="alert(1)"><script>alert(2)</script>'
        }
        action={<button onClick={undo}>Undo</button>}
        onClose={close}
      />,
    );
    const notification = screen.getByTestId(PREFIX);
    expect(screen.getByText('Transfer approved').tagName).toBe('B');
    expect(notification.querySelector('script')).toBeNull();
    expect(notification.querySelector('img')).not.toHaveAttribute('onerror');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(close).toHaveBeenCalledOnce();
  });
});
