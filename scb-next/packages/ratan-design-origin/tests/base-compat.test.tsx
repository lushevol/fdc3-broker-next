import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button, Dialog, Loader, LoadingButton, Time } from '../src/base-compat';

describe('migration-only Base presentation adapters', () => {
  it('preserves the legacy button and loading namespaces', () => {
    const click = vi.fn();
    const { rerender } = render(
      <>
        <Button.default type="primary" onClick={click}>
          Open trade
        </Button.default>
        <LoadingButton.default loading startIcon={<span>Host icon</span>}>
          Save trade
        </LoadingButton.default>
      </>,
    );

    const button = screen.getByRole('button', { name: 'Open trade' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Save trade' })).toBeDisabled();
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveStyle({
      width: '16px',
      height: '16px',
    });
    expect(screen.queryByText('Host icon')).not.toBeInTheDocument();

    rerender(
      <LoadingButton.default startIcon={<span>Host icon</span>}>Save trade</LoadingButton.default>,
    );
    expect(screen.getByRole('button', { name: 'Host icon Save trade' })).toBeEnabled();
  });

  it('preserves named Loader and string Time presentation', () => {
    render(
      <>
        <Loader.default />
        <Time.Time value={0} />
      </>,
    );

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('forces the legacy dialog portal, dimensions and close callbacks', () => {
    const close = vi.fn();
    render(
      <div data-testid="consumer-root">
        <Dialog.default
          titleComponents="Trade details"
          actionComponents={<button>Approve trade</button>}
          defaultWidth={720}
          defaultHeight="auto"
          disablePortal
          onClose={close}
          PaperProps={{ style: { color: 'red' } }}
        >
          Details ABC123
        </Dialog.default>
      </div>,
    );

    const dialog = screen.getByRole('dialog');
    expect(screen.getByTestId('consumer-root')).not.toContainElement(dialog);
    expect(dialog).toHaveStyle({
      color: 'red',
      width: 'min(720px, calc(100vw - 32px))',
      height: 'auto',
    });
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(close).toHaveBeenCalledTimes(2);
  });
});
