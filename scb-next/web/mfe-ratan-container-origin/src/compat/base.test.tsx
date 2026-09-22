import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from './base';

describe('Ratan platform compatibility bridge', () => {
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
});
