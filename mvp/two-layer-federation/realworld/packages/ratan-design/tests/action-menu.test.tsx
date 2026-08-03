import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActionMenu, Button } from '../src';

describe('ActionMenu', () => {
  it('opens an accessible menu and returns the selected action', () => {
    const onAction = vi.fn();
    render(
      <ActionMenu
        ariaLabel="User actions"
        trigger={<Button aria-label="Open user menu">User</Button>}
        items={[{ id: 'profile', label: 'Profile' }, { id: 'logout', label: 'Logout', tone: 'danger' }]}
        onAction={onAction}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open user menu' }));
    expect(screen.getByRole('menu', { name: 'Open user menu' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    expect(onAction).toHaveBeenCalledWith('logout');
  });
});
