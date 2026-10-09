import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '.';
import Provider from '../../hooks/provider';
import Theme from '../../theme';
import type { RootModel } from '../../hooks/model/root';

const callbacks = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn(),
  edit: vi.fn(),
  refresh: vi.fn(),
  change: vi.fn(),
}));
let state: RootModel;
let selectedValue = 1;
vi.mock('./common/useController', () => ({
  default: () => ({
    store: state,
    value: selectedValue,
    handleChange: callbacks.change,
    add: callbacks.add,
    edit: () => callbacks.edit,
    remove: () => callbacks.remove,
    refreshTab: () => callbacks.refresh,
    focus: () => vi.fn(),
    ready: true,
    validateWorkspaceReady: true,
    showTimeout: false,
    mouseMove: vi.fn(),
  }),
}));
vi.mock('./common/useOpenfin', () => ({ default: () => ({}) }));
vi.mock('./common/Container', () => ({ default: () => <div>Remote workspace</div> }));

beforeEach(() => {
  vi.clearAllMocks();
  selectedValue = 1;
  window.history.replaceState({}, '', '/');
  state = {
    newStyles: true,
    theme: 'dark',
    user: { id: 'user' },
    token: 'session',
    drawers: [],
    workspaces: [
      {
        id: 'first',
        label: 'Cashflow Blotter',
        isActive: true,
        containers: [{ container: '@fm/ratan_container', module: '/cashflow' }],
      },
      { id: 'second', label: 'Workspace 2', isActive: false, containers: [] },
    ],
    currentWorkspace: { id: 'first', label: 'Cashflow Blotter', isActive: true, containers: [] },
    refreshTab: { first: vi.fn() },
  } as RootModel;
});

it.each(['light', 'dark'] as const)(
  'renders the %s prototype shell from props and preserves workspace actions',
  (mode) => {
    state.theme = mode;
    render(
      <Provider data={state}>
        <Theme>
          <Home />
        </Theme>
      </Provider>,
    );
    expect(screen.getByRole('img', { name: 'Markets Operations One logo' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('tablist', { name: 'workspaces' })).queryByRole('button', {
        name: 'Add Workspace',
      }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add Workspace' }));
    expect(callbacks.add).toHaveBeenCalledOnce();
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Workspace Name' })[0], {
      target: { value: 'New name' },
    });
    expect(callbacks.edit).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));
    expect(callbacks.refresh).toHaveBeenCalledOnce();
    fireEvent.click(screen.getAllByRole('button', { name: 'delete' })[0]);
    expect(callbacks.remove).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Open new tile' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Theme Switch' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Time Switch' })).toBeInTheDocument();
  },
);

it('keeps workspace tab values aligned with the one-based panel controller', () => {
  render(
    <Provider data={state}>
      <Theme>
        <Home />
      </Theme>
    </Provider>,
  );
  const tabs = screen.getAllByRole('tab');
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  fireEvent.click(tabs[1]);
  expect(callbacks.change).toHaveBeenCalledWith(expect.anything(), 2);
});

it('keeps the remaining workspace selected while deletion updates the controller', () => {
  selectedValue = 3;
  render(
    <Provider data={state}>
      <Theme>
        <Home />
      </Theme>
    </Provider>,
  );
  expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
});

it('retains the historical preview when the complete appearance is disabled', () => {
  state.newStyles = false;
  window.history.replaceState({}, '', '/?new-layout=true');
  render(
    <Provider data={state}>
      <Theme>
        <Home />
      </Theme>
    </Provider>,
  );
  expect(screen.queryByRole('button', { name: 'Add Workspace' })).not.toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: 'Markets Operations One logo' }),
  ).not.toBeInTheDocument();
});
