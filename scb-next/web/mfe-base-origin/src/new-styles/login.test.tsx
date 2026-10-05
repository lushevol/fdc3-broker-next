import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRatanTheme, ThemeProvider } from 'ratan-design-origin/theme';
import PrototypeLogin from './login';

const props = () => ({
  username: '',
  password: '',
  loading: false,
  showNormalLogin: true,
  setUsername: vi.fn(),
  setPassword: vi.fn(),
  onLoginUserNamePassword: vi.fn(),
  ssoLink: 'https://sso.example.test/authorize?redirect_uri=portal',
});

describe('prototype login', () => {
  it.each(['light', 'dark'] as const)('keeps compact form typography and 44px controls in %s mode', (mode) => {
    render(
      <ThemeProvider theme={createRatanTheme({ mode })}>
        <PrototypeLogin {...props()} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('form', { name: 'Sign In' })).toHaveStyle({ maxWidth: '360px' });
    expect(screen.getByRole('heading', { name: 'Sign In' })).toHaveStyle({
      fontSize: '32px', lineHeight: '40px',
    });
    const username = screen.getByLabelText('Username');
    expect(username.parentElement).toHaveStyle({ height: '44px' });
    expect(screen.getByText('Username')).toHaveStyle({ fontSize: '14px' });
    expect(screen.getByRole('button', { name: 'Sign In' })).toHaveStyle({
      height: '44px',
    });
    expect(screen.getByRole('link', { name: 'Sign In With SSO' })).toHaveStyle({
      height: '44px',
    });
  });
  it('uses the selected dark appearance and empty optional credentials', () => {
    render(
      <ThemeProvider theme={createRatanTheme({ mode: 'dark' })}>
        <PrototypeLogin {...props()} username={undefined} password={undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Username')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByRole('img', { name: 'Markets Operations One logo' })).toHaveAttribute(
      'src',
      expect.stringContaining('mo1_logo_dark.svg'),
    );
  });
  it('labels editable fields and preserves username/password normalization', () => {
    const handlers = props();
    render(<PrototypeLogin {...handlers} />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: ' user ' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: ' secret ' } });
    expect(handlers.setUsername).toHaveBeenCalledWith('user');
    expect(handlers.setPassword).toHaveBeenCalledWith(' secret ');
  });
  it('submits through the existing login action and keeps the continuation URL', () => {
    const handlers = props();
    render(<PrototypeLogin {...handlers} />);
    fireEvent.submit(screen.getByRole('form', { name: 'Sign In' }));
    expect(handlers.onLoginUserNamePassword).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Sign In With SSO' })).toHaveAttribute(
      'href',
      handlers.ssoLink,
    );
  });
  it('keeps SSO available without exposing normal credentials when disabled', () => {
    render(<PrototypeLogin {...props()} showNormalLogin={false} />);
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In With SSO' })).toBeVisible();
  });
  it('prevents repeat form submission while authentication is pending', () => {
    const handlers = props();
    render(<PrototypeLogin {...handlers} loading />);
    fireEvent.submit(screen.getByRole('form', { name: 'Sign In' }));
    expect(handlers.onLoginUserNamePassword).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled();
  });
});
