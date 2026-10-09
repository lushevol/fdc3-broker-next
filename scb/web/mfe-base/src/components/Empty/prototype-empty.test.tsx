import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Provider from '../../hooks/provider';
import Theme from '../../theme';
import Empty from '.';

const api = vi.hoisted(() => ({ post: vi.fn().mockResolvedValue({ data: {} }) }));
vi.mock('../../hooks/service', () => ({ postService: api.post, getService: vi.fn() }));

it('selects the complete empty workspace through Base props and retains Find Tile analytics', () => {
  render(
    <Provider data={{ newStyles: true, theme: 'dark', token: 'fixture-session', user: { id: 'fixture-user' } }}>
      <Theme><Empty /></Theme>
    </Provider>,
  );
  expect(screen.getByRole('heading', { name: 'Start customizing your workspace' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Find Tile', exact: true }));
  expect(api.post).toHaveBeenCalledWith('/analytics/v1/fmo/print', {
    singleUIAuthorization: 'fixture-session', key: 'button', event: 'click',
    name: 'find tile', value: 'true', container: 'Base', tile: 'home',
  });
});
