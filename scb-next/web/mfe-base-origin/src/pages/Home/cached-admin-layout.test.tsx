import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '.';
import Provider from '../../hooks/provider';
import ThemeProvider from '../../theme';
import type { Workspace } from '../../hooks/model/workspaces';
import { PREFIX } from './common/style';

const workspaces = [
  { container: '@fm/base', module: '/category' },
  { container: '@fm/base', module: '/tile' },
  { container: '@fm/base', module: '/importmap' },
  { container: '@fm/base', module: '/other' },
  { container: '@fm/ratan_container', module: '/category' },
  { container: '@fm/alpha_payments', module: '/importmap' },
].map((container, index) => ({
  id: `workspace-${index}`,
  label: `Workspace ${index}`,
  isActive: index === 0,
  containers: [container],
})) as Workspace[];

vi.mock('./common/useController', () => ({
  default: () => ({
    store: { workspaces, currentWorkspace: workspaces[0] },
    value: 1,
    handleChange: vi.fn(),
    add: vi.fn(),
    edit: () => vi.fn(),
    remove: () => vi.fn(),
    refreshTab: () => vi.fn(),
    focus: () => vi.fn(),
    ready: true,
    showTimeout: false,
    setShowTimeout: vi.fn(),
    mouseMove: vi.fn(),
    validateWorkspaceReady: true,
  }),
}));
vi.mock('./common/useOpenfin', () => ({
  default: () => ({ channelMessage: undefined, clearMessage: vi.fn() }),
}));
vi.mock('./common/Container', () => ({ default: () => null }));
vi.mock('../../components/AppBar', () => ({ default: () => null }));

it('preserves cached dimensions only for the three Base admin modules', () => {
  render(
    <Provider data={{ theme: 'dark' }}>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </Provider>,
  );

  const panels = screen.getAllByRole('tabpanel', { hidden: true });
  expect(panels).toHaveLength(workspaces.length);
  panels.forEach((panel, index) => {
    expect(panel.classList.contains(`${PREFIX}-cachedAdminPanel`)).toBe(index < 3);
    expect(panel.id).toBe(`workspaces-tabpanel-${index + 1}`);
  });
  expect(panels[0]).not.toHaveAttribute('hidden');
  panels.slice(1).forEach((panel) => expect(panel).toHaveAttribute('hidden'));
});
