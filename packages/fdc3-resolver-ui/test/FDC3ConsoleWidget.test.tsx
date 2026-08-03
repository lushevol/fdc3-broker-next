import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FDC3ConsoleWidget from '../src/fdc3-log/FDC3ConsoleWidget';
import { clearFDC3Logs, pushFDC3Log } from '../src/fdc3-log/fdc3LogService';

interface TestBroker {
  intentListeners: Map<string, unknown[]>;
  getUserChannels: ReturnType<typeof vi.fn>;
  getCurrentChannel: ReturnType<typeof vi.fn>;
  raiseIntent: ReturnType<typeof vi.fn>;
  broadcast: ReturnType<typeof vi.fn>;
}

function installBroker(overrides: Partial<TestBroker> = {}): TestBroker {
  const broker: TestBroker = {
    intentListeners: new Map([
      ['ViewChart', [{}, {}]],
      ['EmptyIntent', []],
    ]),
    getUserChannels: vi.fn().mockResolvedValue([
      { id: 'red', displayName: 'Red Channel', type: 'user' },
      { id: 'blue' },
      { displayName: 'invalid' },
    ]),
    getCurrentChannel: vi.fn().mockResolvedValue({ id: 'red' }),
    raiseIntent: vi.fn().mockResolvedValue({ source: { appId: 'chart-app' } }),
    broadcast: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  (globalThis as Record<string, unknown>).__RATAN_FDC3__ = { brokerInstance: broker };
  return broker;
}

describe('FDC3ConsoleWidget', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    clearFDC3Logs();
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    clearFDC3Logs();
    delete (globalThis as Record<string, unknown>).__RATAN_FDC3__;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('opens, streams, filters, expands, copies, clears, and closes activity', async () => {
    render(<FDC3ConsoleWidget maxDisplayed={2} />);

    act(() => {
      pushFDC3Log('info', 'intent', 'first event', { value: 1 }, 'broker', 'tile-1', 'Chart');
      pushFDC3Log('error', 'context', 'second event', 'details', 'tile');
      pushFDC3Log('warn', 'general', 'third event', undefined, 'external');
    });

    fireEvent.click(screen.getByTitle('Open FDC3 Console'));

    expect(screen.queryByText('first event')).not.toBeInTheDocument();
    expect(screen.getByText('second event')).toBeInTheDocument();
    expect(screen.getByText('third event')).toBeInTheDocument();

    fireEvent.click(screen.getByText('second event'));
    expect(screen.getByText('details')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Copy this entry')[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('second event'));

    fireEvent.change(screen.getByPlaceholderText('search…'), { target: { value: 'third' } });
    expect(screen.queryByText('second event')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 2 entries')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'WARN' }));
    expect(screen.getByText(/Waiting for FDC3 activity/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'WARN' }));
    fireEvent.click(screen.getByTitle('Filter: general events'));
    expect(screen.getByText(/Waiting for FDC3 activity/)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Filter: general events'));

    fireEvent.click(screen.getByRole('button', { name: 'Copy All' }));
    expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining('third event'));
    fireEvent.change(screen.getByPlaceholderText('search…'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('Activity log cleared')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('FDC3 Console')).not.toBeInTheDocument();
  });

  it('inspects listeners and channels and tolerates failed broker polling', async () => {
    installBroker();
    render(<FDC3ConsoleWidget defaultVisible />);
    fireEvent.click(screen.getByRole('button', { name: /^Listeners/ }));

    await waitFor(() => expect(screen.getByText('ViewChart')).toBeInTheDocument());
    expect(screen.getByText('2 handlers')).toBeInTheDocument();
    expect(screen.getByText(/Red Channel/)).toBeInTheDocument();
    expect(screen.getByText(/blue/)).toBeInTheDocument();
    expect(screen.getByText('(current)')).toBeInTheDocument();

    delete (globalThis as Record<string, unknown>).__RATAN_FDC3__;
    fireEvent.click(screen.getByRole('button', { name: 'Activity' }));
    fireEvent.click(screen.getByRole('button', { name: /^Listeners/ }));
    expect(screen.getByText('ViewChart')).toBeInTheDocument();
  });

  it('supports quick actions, raise intent, broadcast, validation, and broker errors', async () => {
    const broker = installBroker();
    render(<FDC3ConsoleWidget defaultVisible />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.click(screen.getByRole('button', { name: 'SearchTrades (Pending)' }));
    expect(screen.getByDisplayValue('SearchTrades')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Raise Intent' }));
    await screen.findByText(/Intent "SearchTrades" → chart-app/);
    expect(broker.raiseIntent).toHaveBeenCalledWith(
      'SearchTrades',
      expect.objectContaining({ type: 'fdc3.trade.query' }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Broadcast Instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Broadcast' }));
    await screen.findByText(/Context "fdc3.instrument" broadcast/);
    expect(broker.broadcast).toHaveBeenCalled();

    const textarea = screen.getByPlaceholderText('{ "type": "fdc3.instrument", … }');
    fireEvent.change(textarea, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Raise Intent' }));
    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: '{"type":"fdc3.instrument"}' } });
    broker.raiseIntent.mockRejectedValueOnce('denied');
    fireEvent.click(screen.getByRole('button', { name: 'Raise Intent' }));
    await screen.findByText(/Error: denied/);

    delete (globalThis as Record<string, unknown>).__RATAN_FDC3__;
    fireEvent.click(screen.getByRole('button', { name: 'Broadcast' }));
    await screen.findByText(/Broker not available/);
  });

  it('shows empty listener/channel states for malformed broker data', async () => {
    installBroker({
      intentListeners: new Map(),
      getUserChannels: vi.fn().mockResolvedValue('invalid'),
      getCurrentChannel: vi.fn().mockResolvedValue(null),
    });
    render(<FDC3ConsoleWidget defaultVisible />);
    fireEvent.click(screen.getByRole('button', { name: 'Listeners' }));

    await waitFor(() => expect(screen.getByText('No intent listeners registered')).toBeInTheDocument());
    expect(screen.getByText('No channels available')).toBeInTheDocument();
  });

  it('covers optional inspector methods, singular listeners, and minimize', async () => {
    (globalThis as Record<string, unknown>).__RATAN_FDC3__ = {
      brokerInstance: { intentListeners: new Map([['ViewNews', [{}]]]) },
    };
    render(<FDC3ConsoleWidget defaultVisible />);
    fireEvent.click(screen.getByRole('button', { name: 'Listeners' }));

    expect(await screen.findByText('1 handler')).toBeInTheDocument();
    expect(screen.getByText('No channels available')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Minimize'));
    expect(screen.queryByText('Intent Listeners')).not.toBeInTheDocument();
  });

  it('handles fallback action results and Error failures', async () => {
    const broker = installBroker({
      raiseIntent: vi.fn().mockResolvedValue({}),
      broadcast: vi.fn().mockRejectedValue(new Error('broadcast denied')),
    });
    render(<FDC3ConsoleWidget defaultVisible />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.change(screen.getByPlaceholderText('e.g. ViewChart'), { target: { value: 'CustomIntent' } });
    fireEvent.click(screen.getByRole('button', { name: 'Raise Intent' }));
    await screen.findByText(/CustomIntent" → unknown/);
    expect(broker.raiseIntent).toHaveBeenCalledWith('CustomIntent', expect.any(Object));

    const textarea = screen.getByPlaceholderText('{ "type": "fdc3.instrument", … }');
    fireEvent.change(textarea, { target: { value: '{}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Broadcast' }));
    await screen.findByText(/Error: broadcast denied/);

    fireEvent.change(textarea, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Broadcast' }));
    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();

    delete (globalThis as Record<string, unknown>).__RATAN_FDC3__;
    fireEvent.change(textarea, { target: { value: '{}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Raise Intent' }));
    await screen.findByText(/Broker not available/);
  });

  it('formats object/tile details and truncates long data', async () => {
    render(<FDC3ConsoleWidget maxDisplayed={150} />);
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      pushFDC3Log('info', 'intent', 'long event', { detail: 'x'.repeat(2100) }, 'broker', 'tile-only');
    });

    fireEvent.click(screen.getByTitle('Open FDC3 Console'));
    fireEvent.click(screen.getByText('long event'));
    expect(screen.getByText(/truncated/)).toBeInTheDocument();
    expect(screen.getByTitle('ID: tile-only')).toHaveTextContent('tile-only');
  });
});
