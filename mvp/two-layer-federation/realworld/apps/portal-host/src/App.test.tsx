import {
  IDENTITY_CONTRACT_VERSION,
  type IdentityCapability,
} from '@fm/platform-contracts';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';
import { loadApplicationRegistry } from './registry';
import { entry } from './test-fixtures';
import { vi } from 'vitest';

vi.mock('./registry', () => ({ loadApplicationRegistry: vi.fn() }));
const mockedLoad = loadApplicationRegistry as jest.MockedFunction<typeof loadApplicationRegistry>;
const authenticatedIdentity: IdentityCapability = {
  getSnapshot: () => ({
    state: 'authenticated',
    userId: 'test',
    permissions: ['portal:access'],
    contractVersion: IDENTITY_CONTRACT_VERSION,
  }),
  subscribe: () => () => undefined,
};

describe('host bootstrap', () => {
  beforeEach(() => {
    mockedLoad.mockReset();
    window.history.replaceState({}, '', '/');
  });
  it('shows progress then a validated launcher', async () => {
    mockedLoad.mockResolvedValue({ applications: [entry] });
    render(<App identity={authenticatedIdentity} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
  });
  it('contains errors, normalizes failures, and retries', async () => {
    mockedLoad.mockRejectedValueOnce('offline').mockResolvedValueOnce({ applications: [entry] });
    render(<App identity={authenticatedIdentity} />);
    expect(await screen.findByText('offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry registry' }));
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
  });

  it('preserves native registry errors', async () => {
    mockedLoad.mockRejectedValue(new Error('registry exploded'));
    render(<App identity={authenticatedIdentity} />);
    expect(await screen.findByText('registry exploded')).toBeInTheDocument();
  });

  it('authenticates an anonymous session before loading the registry', async () => {
    mockedLoad.mockResolvedValue({ applications: [entry] });
    const authentication = {
      ssoHref: '/sso',
      authenticate: jest.fn().mockResolvedValue({
        state: 'authenticated',
        userId: 'test',
        permissions: ['portal:access'],
        contractVersion: IDENTITY_CONTRACT_VERSION,
      }),
    };
    render(<App authentication={authentication} />);
    expect(mockedLoad).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
    expect(authentication.authenticate).toHaveBeenCalledWith({
      username: 'test',
      password: 'test',
    });
  });

  it('rejects adapters that do not return an authenticated identity', async () => {
    const authentication = {
      ssoHref: '/sso',
      authenticate: jest.fn().mockResolvedValue({
        state: 'anonymous',
        contractVersion: IDENTITY_CONTRACT_VERSION,
      }),
    };
    render(<App authentication={authentication} />);
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Authentication did not create a signed-in session.',
    );
    expect(mockedLoad).not.toHaveBeenCalled();
  });

  it('ignores registry resolution and rejection after unmount', async () => {
    let resolveRegistry: ((value: { applications: Array<typeof entry> }) => void) | undefined;
    mockedLoad.mockImplementationOnce(() => new Promise((resolve) => { resolveRegistry = resolve; }));
    const resolved = render(<App identity={authenticatedIdentity} />);
    resolved.unmount();
    await act(async () => resolveRegistry?.({ applications: [entry] }));

    let rejectRegistry: ((reason: Error) => void) | undefined;
    mockedLoad.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectRegistry = reject; }));
    const rejected = render(<App identity={authenticatedIdentity} />);
    rejected.unmount();
    await act(async () => rejectRegistry?.(new Error('late failure')));
  });
});
