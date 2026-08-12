import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Dialog } from './base';

describe('base compatibility dialog', () => {
  it('renders oversized legacy dialogs as closable, viewport-constrained modals', () => {
    const onClose = vi.fn();

    render(
      React.createElement(
        Dialog.default,
        {
          open: true,
          onClose,
          titleComponents: React.createElement('span', null, 'Cashflow details'),
          defaultWidth: 1920,
          defaultHeight: 950,
        },
        React.createElement('div', null, 'Details body'),
      ),
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
    expect(screen.getByText('Cashflow details')).toBeVisible();
    expect(dialog).toHaveStyle({
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 32px)',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render dialog content while closed', () => {
    render(
      React.createElement(
        Dialog.default,
        { open: false },
        React.createElement('div', null, 'Hidden details'),
      ),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();
  });
});
