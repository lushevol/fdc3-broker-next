import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Dialog, Provider, ThemeConfig, ThemeUtil } from './base';

describe('base compatibility dialog', () => {
  afterEach(() => {
    document.documentElement.className = '';
  });

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

  it('inherits explicit host appearance changes across the federation boundary', () => {
    const ThemeProbe = () => {
      const [store] = Provider.useContext();
      return React.createElement('span', null, `${store.theme}/${store.designGeneration}`);
    };

    const { rerender } = render(
      React.createElement(
        Provider.default,
        { appearance: { mode: 'dark', designGeneration: 'webkit' } },
        React.createElement(ThemeProbe),
      ),
    );

    expect(screen.getByText('dark/webkit')).toBeVisible();

    rerender(
      React.createElement(
        Provider.default,
        { appearance: { mode: 'light', designGeneration: 'legacy' } },
        React.createElement(ThemeProbe),
      ),
    );
    expect(screen.getByText('light/legacy')).toBeVisible();
  });

  it('preserves the production MUI theme contract inside the Cashflow remote', () => {
    const { config } = ThemeConfig.default(ThemeUtil.getTheme('dark'));

    expect(config.typography).toMatchObject({
      fontFamily: '"Poppins", Helvetica',
      fontSize: 12,
      button: { textTransform: 'none' },
    });
    expect(config.shape.borderRadius).toBe(5);
    expect(config.components?.MuiButton).toMatchObject({
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 600,
        },
      },
    });
    expect(config.components?.MuiIconButton?.defaultProps).toMatchObject({
      size: 'small',
    });
  });
});
