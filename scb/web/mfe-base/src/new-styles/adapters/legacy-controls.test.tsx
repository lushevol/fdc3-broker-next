import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'ratan-design-origin/theme';
import { Config, getPortalTheme } from 'ratan-design-origin/portal-theme';
import Provider from '../../hooks/provider';
import ThemeSwitch from './theme-switch';
import TimeSwitch from './time-switch';
import NewTile from './new-tile';

vi.mock('../../analytics', () => ({ default: () => ({ SwitchEvent: vi.fn() }) }));

beforeEach(() => window.history.replaceState({}, '', '/'));

it.each(['light', 'dark'] as const)(
  'keeps the explicit Legacy %s header and its existing theme/time actions',
  (mode) => {
    const openDrawer = vi.fn();
    const toggleDrawer = vi.fn(() => openDrawer);
    render(
      <Provider data={{ newStyles: false, theme: mode, timeType: 'utc', drawer: false }}>
        <ThemeProvider theme={Config(getPortalTheme(mode)).config}>
          <ThemeSwitch /><TimeSwitch /><NewTile toggleDrawer={toggleDrawer} />
        </ThemeProvider>
      </Provider>,
    );
    const theme = screen.getByRole('checkbox', { name: 'Theme Switch' });
    const time = screen.getByRole('checkbox', { name: 'Time Switch' });
    expect(theme).toHaveProperty('checked', mode === 'light');
    expect(time).toBeChecked();
    expect(screen.queryByRole('button', { name: 'Open new tile' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('New Tile'));
    expect(toggleDrawer).toHaveBeenCalledWith(true);
    expect(openDrawer).toHaveBeenCalledOnce();
    fireEvent.click(theme);
    expect(theme).toHaveProperty('checked', mode !== 'light');
    fireEvent.click(time);
    expect(time).not.toBeChecked();
  },
);
