import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import Provider from '../../hooks/provider';
import Theme from '../../theme';
import Login from '.';

const api = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('../../hooks/service', () => ({ postService: api.post, getService: vi.fn() }));

beforeEach(() => {
  api.post.mockReset().mockResolvedValue({ data: {} });
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  sessionStorage.clear();
});

it('selects the complete login through Base props and submits normalized credentials once', async () => {
  render(
    <Provider data={{ newStyles: true, loginAppearance: 'light' }}>
      <Theme><Login /></Theme>
    </Provider>,
  );
  expect(screen.getByRole('img', { name: 'Markets Operations One logo' })).toBeVisible();
  expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: ' portal.user ' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: ' secret ' } });
  fireEvent.submit(screen.getByRole('form', { name: 'Sign In' }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/v2/sso/login', {
    username: 'portal.user', password: ' secret ',
  }));
  expect(api.post).toHaveBeenCalledOnce();
});

it('preserves the legacy preview login when only new-layout is enabled', () => {
  window.history.replaceState({}, '', '/?new-layout=true');
  render(<Provider data={{ newStyles: false }}><Theme><Login /></Theme></Provider>);
  expect(screen.getByPlaceholderText('Enter Username')).toBeVisible();
  expect(screen.getByRole('tablist', { name: 'login tabs' })).toBeInTheDocument();
});
