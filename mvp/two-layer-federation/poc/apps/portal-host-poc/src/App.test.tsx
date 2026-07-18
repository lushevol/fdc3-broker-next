import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  type ApplicationRegistry,
} from '@fm/platform-contracts-poc';
import { App } from './App';
import { loadApplicationRegistry } from './registry';

jest.mock('./registry', () => ({ loadApplicationRegistry: jest.fn() }));

const registry: ApplicationRegistry = {
  applications: [{
    id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow_poc',
    manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json', exposedModule: './application',
    basePath: '/cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
    appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
    capabilities: ['appearance'],
  }],
};

const mockedLoadRegistry = loadApplicationRegistry as jest.MockedFunction<typeof loadApplicationRegistry>;

describe('App bootstrap', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    mockedLoadRegistry.mockReset();
  });

  it('shows bootstrap progress and then the validated host', async () => {
    let resolveRegistry: (value: ApplicationRegistry) => void = () => undefined;
    mockedLoadRegistry.mockReturnValue(new Promise((resolve) => { resolveRegistry = resolve; }));
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading application registry');
    resolveRegistry(registry);
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
  });

  it('shows a registry error and retries', async () => {
    mockedLoadRegistry
      .mockRejectedValueOnce(new Error('Registry offline'))
      .mockResolvedValueOnce(registry);
    render(<App />);
    expect(await screen.findByText('Registry offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry registry' }));
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
    expect(mockedLoadRegistry).toHaveBeenCalledTimes(2);
  });

  it('normalizes non-Error failures and ignores results after unmount', async () => {
    mockedLoadRegistry.mockRejectedValueOnce('invalid response');
    const first = render(<App />);
    expect(await screen.findByText('invalid response')).toBeInTheDocument();
    first.unmount();

    let resolveRegistry: (value: ApplicationRegistry) => void = () => undefined;
    mockedLoadRegistry.mockReturnValueOnce(new Promise((resolve) => { resolveRegistry = resolve; }));
    const second = render(<App />);
    second.unmount();
    resolveRegistry(registry);
    await waitFor(() => expect(screen.queryByText('Operations Workspace')).not.toBeInTheDocument());
  });
});
