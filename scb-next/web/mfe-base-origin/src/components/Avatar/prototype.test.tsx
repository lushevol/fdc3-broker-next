import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Provider from '../../hooks/provider';
import Theme from '../../theme';
import Avatar from './index';

const analytics = vi.hoisted(() => ({ ButtonEvent: vi.fn() }));
vi.mock('../../analytics', () => ({ default: () => analytics }));

describe('prototype avatar production integration', () => {
  beforeEach(() => analytics.ButtonEvent.mockClear());

  it('uses live versions, opens the profile with real data, and returns focus to the avatar', async () => {
    render(<Provider data={{ newStyles: true, theme: 'light', token: 'test', rootVersion: 'root-live',
      user: { userId: 'real/id', fullName: 'Real User', oud: { title: 'Operations' },
        entitlements: { 'RATAN_DATA_ENTITLEMENT:Global': { REGION: ['VIEW_ENTITLEMENT'] } } },
      entities: [{ id: 1, roleId: 2, applicationName: 'RATAN', name: 'RATAN_DATA_ENTITLEMENT',
        roleName: 'Global', subjects: [{ id: 3, name: 'REGION', actions: [] }] }] }}>
      <Theme><Avatar setOpen={vi.fn()} /></Theme>
    </Provider>);
    const avatar = screen.getByRole('button', { name: 'User Profiles' });
    avatar.focus();
    fireEvent.click(avatar);
    expect(screen.getByTestId('portal-prototype-avatar-menu')).toBeVisible();
    expect(screen.getByText('Root Config Version: root-live')).toBeVisible();
    fireEvent.click(screen.getByRole('menuitem', { name: /Real User/ }));
    const dialog = await screen.findByRole('dialog', { name: 'User Profile' });
    expect(dialog).toBeVisible();
    expect(screen.getByText('Operations')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'RATAN::RATAN_DATA_ENTITLEMENT::Global' }));
    fireEvent.click(screen.getByRole('button', { name: 'REGION' }));
    expect(screen.getByText('VIEW_ENTITLEMENT')).toBeVisible();
    expect(analytics.ButtonEvent).toHaveBeenCalledWith('click', {
      name: 'RATAN :: RATAN_DATA_ENTITLEMENT :: Global', value: 'true', container: 'Base', tile: 'profile',
    });
    expect(analytics.ButtonEvent).toHaveBeenCalledWith('click', {
      name: 'REGION', value: 'true', container: 'Base', tile: 'profile',
    });
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(avatar).toHaveFocus();
  });

  it('opens existing logout confirmation and tracks the action from the prototype menu', () => {
    const setOpen = vi.fn();
    render(<Provider data={{ newStyles: true, token: 'test', theme: 'dark', user: { userId: 'real-user' } }}>
      <Theme><Avatar setOpen={setOpen} /></Theme>
    </Provider>);
    fireEvent.click(screen.getByRole('button', { name: 'User Profiles' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    expect(setOpen).toHaveBeenCalledWith(true);
    expect(analytics.ButtonEvent).toHaveBeenCalledWith('click', {
      name: 'logout confirmation', container: 'Base', tile: 'home',
    });
  });

  it('keeps legacy profile hydration usable when the backend omits entities', async () => {
    vi.useFakeTimers();
    const view = render(<Provider data={{ newStyles: false, token: 'test', theme: 'light',
      user: { fullName: 'Legacy User' }, entities: undefined }}>
      <Theme><Avatar setOpen={vi.fn()} /></Theme>
    </Provider>);
    fireEvent.click(screen.getByRole('button', { name: 'User Profiles' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Legacy User/ }));
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('Functional User Profile')).toBeVisible();
    expect(screen.queryByText('Entitlement User Profile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prototype-profile-paper')).not.toBeInTheDocument();
    view.unmount();
    vi.useRealTimers();
  });
});
