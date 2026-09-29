import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoadingButton, SearchButton } from '../src';

describe.each([LoadingButton, SearchButton])('%s loading contract', (Component) => {
  it.each(['inline', 'startIcon'] as const)('preserves %s structure, refs and event behavior', (loadingPosition) => {
    const ref = React.createRef<HTMLButtonElement>();
    const click = vi.fn();
    const props = { ref, onClick: click, loadingPosition, loadingSize: 18,
      startIcon: <span data-testid="caller-icon">Icon</span>, 'data-testid': 'action' };
    const { rerender } = render(<Component {...props}>Submit</Component>);
    const button = screen.getByTestId('action');
    expect(ref.current).toBe(button);
    const idleMarkup = button.innerHTML;
    expect(button.querySelectorAll(':scope > span[style="width: 18px;"]')).toHaveLength(
      loadingPosition === 'inline' ? 2 : 0,
    );
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();

    rerender(<Component {...props} loading>Submit</Component>);
    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    const spinner = screen.getByRole('progressbar', { hidden: true });
    expect(spinner).toHaveStyle({ width: '18px', height: '18px' });
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    if (loadingPosition === 'inline') {
      expect(spinner.parentElement).toBe(button);
      expect(spinner).toHaveStyle({ marginRight: '18px' });
      expect(spinner).toHaveClass('MuiCircularProgress-colorInherit');
      expect(screen.getByTestId('caller-icon')).toBeInTheDocument();
    } else {
      expect(spinner.parentElement).toHaveClass('MuiButton-startIcon');
      expect(spinner).toHaveClass('MuiCircularProgress-colorPrimary');
      expect(screen.queryByTestId('caller-icon')).not.toBeInTheDocument();
    }
    rerender(<Component {...props}>Submit</Component>);
    expect(button.innerHTML).toBe(idleMarkup);
    expect(button).not.toHaveAttribute('aria-busy');
    rerender(<Component {...props} disabled>Submit</Component>);
    expect(button).toBeDisabled();
  });

  it('retains the default size and caller busy attribute in idle inline mode', () => {
    const { rerender } = render(<Component aria-busy="true">Submit</Component>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    rerender(<Component loading>Submit</Component>);
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveStyle({ width: '14px', height: '14px' });
  });
});
