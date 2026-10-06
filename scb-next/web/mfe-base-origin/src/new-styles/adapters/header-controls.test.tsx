import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from 'ratan-design-origin/theme';
import Provider from '../../hooks/provider';
import ThemeSwitch from '../../components/Switch';
import TimeSwitch from '../../components/SwitchTime';
import NewTile from '../../components/NewTile';
import { createPortalPresentationTheme } from '../theme';

const legacySwitch = vi.hoisted(() => vi.fn(() => null));
vi.mock('../../analytics', () => ({ default: () => ({ SwitchEvent: vi.fn() }) }));
vi.mock('../../components/Switch/common/style', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return { ...original, SwitchStyled: legacySwitch };
});

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
});

for (const mode of ['light', 'dark'] as const) {
  it(`renders the ${mode} Portal switches independently of legacy presentation and preserves actions`, () => {
    render(
      <Provider data={{ newStyles: true, theme: mode, timeType: 'utc' }}>
        <ThemeProvider theme={createPortalPresentationTheme(mode)}>
          <ThemeSwitch />
          <TimeSwitch />
        </ThemeProvider>
      </Provider>,
    );
    expect(legacySwitch).not.toHaveBeenCalled();
    const theme = screen.getByRole('checkbox', { name: 'Theme Switch' });
    const time = screen.getByRole('checkbox', { name: 'Time Switch' });
    expect(theme).toHaveProperty('checked', mode === 'light');
    expect(time).toBeChecked();
    for (const input of [theme, time]) {
      const root = input.closest('.MuiSwitch-root')!;
      expect(root.closest('section')).toHaveAttribute('data-testid');
      expect(root).toHaveStyle({ width: '32px', height: '14px', padding: '0px' });
    }
    fireEvent.click(theme);
    expect(theme).toHaveProperty('checked', mode !== 'light');
    fireEvent.click(time);
    expect(time).not.toBeChecked();
  });

  it(`renders the ${mode} Portal New Tile command through the package icon button`, () => {
    const closeDrawer = vi.fn();
    const toggleDrawer = vi.fn(() => closeDrawer);
    render(
      <Provider data={{ newStyles: true, theme: mode, drawer: true }}>
        <ThemeProvider theme={createPortalPresentationTheme(mode)}>
          <NewTile toggleDrawer={toggleDrawer} />
        </ThemeProvider>
      </Provider>,
    );
    const command = screen.getByRole('button', { name: 'Open new tile' });
    expect(command).toHaveClass('MuiIconButton-root');
    expect(command).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(command);
    expect(toggleDrawer).toHaveBeenCalledWith(false);
    expect(closeDrawer).toHaveBeenCalledOnce();
  });
}
