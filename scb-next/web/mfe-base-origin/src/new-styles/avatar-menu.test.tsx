import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRatanTheme, ThemeProvider } from 'ratan-design-origin/theme';
import PrototypeAvatarMenu from './avatar-menu';

describe('prototype avatar menu', () => {
  it.each(['light', 'dark'] as const)('keeps profile/logout and real versions in %s mode', (mode) => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const onProfile = vi.fn(); const onLogout = vi.fn(); const onClose = vi.fn();
    const view = render(<ThemeProvider theme={createRatanTheme({ mode })}>
      <PrototypeAvatarMenu anchorEl={anchor} name="Yating, Yang" rootVersion="root-test" baseVersion="base-test" onProfile={onProfile} onLogout={onLogout} onClose={onClose} />
    </ThemeProvider>);
    expect(screen.getByTestId('portal-prototype-avatar-menu')).toHaveStyle({ width: '320px', marginTop: '8px' });
    expect(screen.getByRole('menuitem', { name: /Yating, Yang/ })).toHaveStyle({
      minHeight: '72px', paddingInline: '16px', paddingBlock: '12px', gap: '4px',
    });
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toHaveStyle({ minHeight: '44px' });
    expect(screen.getByText('Root Config Version: root-test').parentElement).toHaveStyle({ minHeight: '60px' });
    expect(screen.getByText('Yating, Yang')).toHaveStyle({ fontSize: '14px', lineHeight: '20px' });
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toHaveStyle({ fontSize: '14px', lineHeight: '20px' });
    expect(screen.getByText('Click to view user profile')).toHaveStyle({ fontSize: '12px', lineHeight: '18px' });
    expect(screen.getByText('Root Config Version: root-test').parentElement).toHaveStyle({ fontSize: '12px', lineHeight: '18px' });
    fireEvent.click(screen.getByRole('menuitem', { name: /Yating, Yang/ }));
    expect(onProfile).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    expect(onLogout).toHaveBeenCalledOnce();
    expect(screen.getByText('Root Config Version: root-test')).toBeVisible();
    expect(screen.getByText('Base Container Version: base-test')).toBeVisible();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    view.unmount(); anchor.remove();
  });
  it('does not expose a menu before opening the avatar', () => {
    render(<PrototypeAvatarMenu anchorEl={null} name="User" onProfile={vi.fn()} onLogout={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disables open/close motion for the host preference and returns keyboard focus', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const Host = () => {
      const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
      return <><button onClick={(event) => setAnchor(event.currentTarget)}>User Profiles</button>
        <PrototypeAvatarMenu anchorEl={anchor} name="User" onProfile={vi.fn()} onLogout={vi.fn()}
          onClose={() => setAnchor(null)} /></>;
    };
    render(<Host />);
    const anchor = screen.getByRole('button', { name: 'User Profiles' });
    anchor.focus();
    fireEvent.click(anchor);
    expect(screen.getByTestId('portal-prototype-avatar-menu').style.transition).toContain('0ms');
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(anchor).toHaveFocus();
    vi.unstubAllGlobals();
  });
});
