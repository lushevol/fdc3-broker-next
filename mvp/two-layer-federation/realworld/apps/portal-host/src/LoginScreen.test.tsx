import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginScreen } from './LoginScreen';
import type { AuthenticationAdapter } from './authentication';

const authentication: AuthenticationAdapter = {
  ssoHref: '/test-sso',
  authenticate: jest.fn(),
};

function enter(label: string, value: string) {
  fireEvent(
    screen.getByLabelText(label),
    new CustomEvent('sc-input', { detail: { value } }),
  );
}

describe('portal login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keeps submission disabled until both credentials are present', () => {
    render(<LoginScreen authentication={authentication} onAuthenticated={jest.fn()} />);

    const submit = screen.getByRole('button', { name: 'Sign in' });
    expect(document.querySelector('sc-divider')).toBeInstanceOf(
      customElements.get('sc-divider')!,
    );
    expect(submit).toHaveProperty('disabled', true);
    enter('Username', 'test');
    expect(submit).toHaveProperty('disabled', true);
    enter('Password', 'test');
    expect(submit).toHaveProperty('disabled', false);
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
    enter('Username', '  test  ');
    enter('Password', 'test');
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form')!);

    expect(onAuthenticated).toHaveBeenCalledWith({
      username: 'test',
      password: 'test',
    });
    expect(screen.getByRole('button', { name: 'Signing in…' })).toHaveProperty(
      'disabled',
      true,
    );
    finish?.();
    await waitFor(() => expect(screen.queryByText('Signing in…')).not.toBeInTheDocument());
  });

  it('shows an authentication error and exposes the SSO destination', async () => {
    const onAuthenticated = jest
      .fn()
      .mockRejectedValue(new Error('The username or password is incorrect.'));
    render(<LoginScreen authentication={authentication} onAuthenticated={onAuthenticated} />);
    enter('Username', 'wrong');
    enter('Password', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The username or password is incorrect.',
    );

    expect(screen.getByLabelText('Sign in with SSO')).toHaveProperty(
      'href',
      '/test-sso',
    );
  });

  it('normalizes non-Error failures and ignores empty form submission', async () => {
    const onAuthenticated = jest.fn().mockRejectedValue('offline');
    render(<LoginScreen authentication={authentication} onAuthenticated={onAuthenticated} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form')!);
    expect(onAuthenticated).not.toHaveBeenCalled();
    enter('Username', 'test');
    enter('Password', 'test');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Sign in failed. Try again.');
  });
});
