import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginScreen } from './LoginScreen';
import type { AuthenticationAdapter } from './authentication';

const authentication: AuthenticationAdapter = {
  ssoHref: '/test-sso',
  authenticate: jest.fn(),
};

describe('portal login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keeps submission disabled until both credentials are present', () => {
    render(<LoginScreen authentication={authentication} onAuthenticated={jest.fn()} />);

    const submit = screen.getByRole('button', { name: 'Sign in' });
    expect(document.querySelector('sc-divider')).toHaveAttribute('data-ratan-component', 'divider');
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'test' },
    });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test' },
    });
    expect(submit).toBeEnabled();
  });

  it('submits trimmed credentials from the keyboard and reports progress', async () => {
    let finish: (() => void) | undefined;
    const onAuthenticated = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(<LoginScreen authentication={authentication} onAuthenticated={onAuthenticated} />);
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: '  test  ' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form')!);

    expect(onAuthenticated).toHaveBeenCalledWith({
      username: 'test',
      password: 'test',
    });
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
    finish?.();
    await waitFor(() => expect(screen.queryByText('Signing in…')).not.toBeInTheDocument());
  });

  it('shows an authentication error and exposes the SSO destination', async () => {
    const onAuthenticated = jest
      .fn()
      .mockRejectedValue(new Error('The username or password is incorrect.'));
    render(<LoginScreen authentication={authentication} onAuthenticated={onAuthenticated} />);
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The username or password is incorrect.',
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Single sign-on' }));
    expect(screen.getByRole('link', { name: 'Sign in with SSO' })).toHaveAttribute(
      'href',
      '/test-sso',
    );
  });

  it('normalizes non-Error failures and ignores empty form submission', async () => {
    const onAuthenticated = jest.fn().mockRejectedValue('offline');
    render(<LoginScreen authentication={authentication} onAuthenticated={onAuthenticated} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form')!);
    expect(onAuthenticated).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Sign in failed. Try again.');
  });
});
