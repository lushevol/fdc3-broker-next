import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from './base';

describe('Ratan platform compatibility bridge', () => {
  afterEach(() => {
    document.documentElement.className = '';
  });

  it('inherits host theme changes across the federation boundary', async () => {
    document.documentElement.className = 'dark';

    const ThemeProbe = () => {
      const [store] = Provider.useContext();
      return React.createElement('span', null, store.theme);
    };

    render(
      React.createElement(
        Provider.default,
        null,
        React.createElement(ThemeProbe),
      ),
    );

    expect(screen.getByText('dark')).toBeVisible();

    document.documentElement.className = 'light';
    await waitFor(() => expect(screen.getByText('light')).toBeVisible());
  });
});
