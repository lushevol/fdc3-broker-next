import { act, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';
import { loadApplicationRegistry } from './registry';
import { entry } from './test-fixtures';

jest.mock('./registry', () => ({ loadApplicationRegistry: jest.fn() }));
const mockedLoad = loadApplicationRegistry as jest.MockedFunction<typeof loadApplicationRegistry>;

describe('host bootstrap', () => {
  beforeEach(() => { mockedLoad.mockReset(); window.history.replaceState({}, '', '/'); });
  it('shows progress then a validated launcher', async () => {
    mockedLoad.mockResolvedValue({ applications: [entry] });
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
  });
  it('contains errors, normalizes failures, and retries', async () => {
    mockedLoad.mockRejectedValueOnce('offline').mockResolvedValueOnce({ applications: [entry] });
    render(<App />);
    expect(await screen.findByText('offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry registry' }));
    expect(await screen.findByRole('button', { name: 'Open Cashflow' })).toBeInTheDocument();
  });

  it('preserves native registry errors', async () => {
    mockedLoad.mockRejectedValue(new Error('registry exploded'));
    render(<App />);
    expect(await screen.findByText('registry exploded')).toBeInTheDocument();
  });

  it('ignores registry resolution and rejection after unmount', async () => {
    let resolveRegistry: ((value: { applications: Array<typeof entry> }) => void) | undefined;
    mockedLoad.mockImplementationOnce(() => new Promise((resolve) => { resolveRegistry = resolve; }));
    const resolved = render(<App />);
    resolved.unmount();
    await act(async () => resolveRegistry?.({ applications: [entry] }));

    let rejectRegistry: ((reason: Error) => void) | undefined;
    mockedLoad.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectRegistry = reject; }));
    const rejected = render(<App />);
    rejected.unmount();
    await act(async () => rejectRegistry?.(new Error('late failure')));
  });
});
