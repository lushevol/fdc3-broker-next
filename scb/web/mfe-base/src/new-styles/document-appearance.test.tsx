import React from 'react';
import { render } from '@testing-library/react';
import { AppContext } from '../hooks/provider';
import { initialData } from '../hooks/model/root';
import Theme from './adapters/theme';

it('exposes package CSS scope for the selected mode and removes it on legacy fallback', () => {
  const data = {
    ...initialData,
    newStyles: true,
    theme: 'light',
    user: { id: 'user' },
    token: 'session',
  };
  const view = render(
    <AppContext.Provider value={[data, vi.fn()]}>
      <Theme />
    </AppContext.Provider>,
  );
  expect(document.documentElement).toHaveClass('ratan-design-root', 'sc-mode-light');
  expect(document.documentElement).toHaveAttribute('data-generation', 'webkit');
  expect(document.documentElement).toHaveAttribute('data-mode', 'light');
  view.rerender(
    <AppContext.Provider value={[{ ...data, theme: 'dark' }, vi.fn()]}>
      <Theme />
    </AppContext.Provider>,
  );
  expect(document.documentElement).toHaveAttribute('data-mode', 'dark');
  view.rerender(
    <AppContext.Provider value={[{ ...data, newStyles: false }, vi.fn()]}>
      <Theme />
    </AppContext.Provider>,
  );
  expect(document.documentElement).not.toHaveClass('ratan-design-root');
  expect(document.documentElement).not.toHaveAttribute('data-generation');
  expect(document.documentElement).not.toHaveAttribute('data-mode');
});
