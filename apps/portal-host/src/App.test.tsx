import { fireEvent, render, screen } from '@testing-library/react';
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
});
