import React from 'react';
import { render, screen } from '@testing-library/react';
import Provider from '../../hooks/provider';
import type { RootModel } from '../../hooks/model/root';
import Theme from '../../theme';
import Drawer from './index';

function renderDrawer(data: Partial<RootModel>) {
  return render(<Provider data={{ user: { id: '123' }, token: 'token', ...data }}><Theme>
    <Drawer anchor toggleDrawer={() => vi.fn()} addTile={vi.fn()} drawers={[]} />
  </Theme></Provider>);
}

afterEach(() => { window.history.replaceState(null, '', '/'); });

describe('Base drawer appearance composition', () => {
  it.each(['light', 'dark'] as const)('uses props-only prototype selection and the real %s preference', (theme) => {
    renderDrawer({ newStyles: true, theme });
    expect(screen.getByRole('dialog', { name: 'Tile Option' })).toHaveAttribute('data-theme', theme);
  });

  it('keeps the standalone new-layout query in the retained preview', () => {
    window.history.replaceState(null, '', '/?new-layout=true');
    renderDrawer({ newStyles: false, theme: 'dark' });
    expect(screen.getByText('Tile Options')).toBeVisible();
    expect(screen.queryByTestId('portal-prototype-drawer')).not.toBeInTheDocument();
  });

  it('keeps default callers on the legacy drawer', () => {
    renderDrawer({ theme: 'light' });
    expect(screen.getByText('Tile Options')).toBeVisible();
    expect(screen.queryByTestId('portal-prototype-drawer')).not.toBeInTheDocument();
  });
});
