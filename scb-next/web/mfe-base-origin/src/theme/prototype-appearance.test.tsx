import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'ratan-design-origin/theme';
import { AppContext } from '../hooks/provider';
import { initialData, useIsNewLayout } from '../hooks/model/root';
import Theme from '.';

const Appearance = () => {
  const theme = useTheme();
  const layout = useIsNewLayout();
  return <output>{`${theme.palette.mode}:${theme.ratan?.designGeneration}:${layout}`}</output>;
};

it('uses light prototype login without overwriting the stored workspace theme', () => {
  const data = {
    ...initialData,
    newStyles: true,
    theme: 'dark',
    user: undefined,
    token: undefined,
  };
  const view = render(
    <AppContext.Provider value={[data, vi.fn()]}>
      <Theme>
        <Appearance />
      </Theme>
    </AppContext.Provider>,
  );
  expect(screen.getByText('light:webkit:true')).toBeInTheDocument();
  expect(data.theme).toBe('dark');
  view.rerender(
    <AppContext.Provider value={[{ ...data, user: { id: 'user' }, token: 'session' }, vi.fn()]}>
      <Theme>
        <Appearance />
      </Theme>
    </AppContext.Provider>,
  );
  expect(screen.getByText('dark:webkit:true')).toBeInTheDocument();
});

it('honors an explicit dark prototype login appearance', () => {
  render(
    <AppContext.Provider
      value={[
        {
          ...initialData,
          newStyles: true,
          theme: 'light',
          loginAppearance: 'dark',
          user: undefined,
          token: undefined,
        },
        vi.fn(),
      ]}
    >
      <Theme>
        <Appearance />
      </Theme>
    </AppContext.Provider>,
  );
  expect(screen.getByText('dark:webkit:true')).toBeInTheDocument();
});

it('retains the legacy unauthenticated dark appearance and layout preview', () => {
  window.history.replaceState({}, '', '/?new-layout=true');
  render(
    <AppContext.Provider
      value={[{ ...initialData, theme: 'light', user: undefined, token: undefined }, vi.fn()]}
    >
      <Theme>
        <Appearance />
      </Theme>
    </AppContext.Provider>,
  );
  expect(screen.getByText('dark:undefined:true')).toBeInTheDocument();
  window.history.replaceState({}, '', '/');
});
