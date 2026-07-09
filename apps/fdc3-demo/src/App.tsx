import React, { useState, useCallback, useEffect } from 'react';
import type { Context } from 'ratan-fdc3-agent';
import {
  useFDC3,
  useIntentListener,
  useContextListener,
  useUserChannels,
  useCurrentChannel,
} from 'ratan-fdc3-agent';

const sampleInstrument: Context = {
  type: 'fdc3.instrument',
  name: 'Apple Inc.',
  id: {
    ticker: 'AAPL',
    ISIN: 'US0378331005',
  },
};

const sampleContact: Context = {
  type: 'fdc3.contact',
  name: 'John Doe',
  id: {
    email: 'john.doe@example.com',
  },
};

const sampleCashflow: Context = {
  type: 'scb.fmptp.cashflow',
  name: 'PostMessage Cashflow Launch',
  id: {
    tradeId: 'PM-DEMO-001',
  },
};

type PortalMessage = {
  type: 'fdc3-pm-event';
  correlationId: string;
  method: 'intentEvent';
  payload: {
    intent: string;
    context: Context;
  };
  meta: {
    timestamp: string;
    origin: string;
    source: {
      appId: string;
    };
  };
};

function ContextSelectionPanel({
  selectedContext,
  onSelectContext,
}: {
  selectedContext: Context;
  onSelectContext: (ctx: Context) => void;
}) {
  return (
    <div className="panel">
      <h2>Context Selection</h2>
      <div className="context-buttons">
        <button
          className={selectedContext.type === 'scb.fmptp.cashflow' ? 'active' : ''}
          onClick={() => onSelectContext(sampleCashflow)}
        >
          Cashflow (PM-DEMO-001)
        </button>
        <button
          className={selectedContext.type === 'fdc3.instrument' ? 'active' : ''}
          onClick={() => onSelectContext(sampleInstrument)}
        >
          Instrument (AAPL)
        </button>
        <button
          className={selectedContext.type === 'fdc3.contact' ? 'active' : ''}
          onClick={() => onSelectContext(sampleContact)}
        >
          Contact (John Doe)
        </button>
      </div>
      <div className="context-preview">
        <h3>Selected Context:</h3>
        <pre>{JSON.stringify(selectedContext, null, 2)}</pre>
      </div>
    </div>
  );
}

function PortalPostMessagePanel({
  selectedContext,
  onLog,
}: {
  selectedContext: Context;
  onLog: (message: string) => void;
}) {
  const portalWindowRef = React.useRef<Window | null>(null);
  const [portalUrl, setPortalUrl] = useState('http://localhost:8001');
  const [intent, setIntent] = useState('scb.ViewLaunch');

  const getPortalOrigin = useCallback(() => {
    try {
      return new URL(portalUrl).origin;
    } catch {
      return '';
    }
  }, [portalUrl]);

  const openPortal = useCallback(() => {
    const opened = window.open(portalUrl, 'fmo-postmessage-portal');
    if (!opened) {
      onLog('Portal popup was blocked by the browser');
      return null;
    }

    portalWindowRef.current = opened;
    onLog(`Portal opened: ${portalUrl}`);
    return opened;
  }, [onLog, portalUrl]);

  const buildMessage = useCallback((): PortalMessage => {
    const correlationId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
      type: 'fdc3-pm-event',
      correlationId,
      method: 'intentEvent',
      payload: {
        intent,
        context: selectedContext,
      },
      meta: {
        timestamp: new Date().toISOString(),
        origin: window.location.origin,
        source: {
          appId: 'standalone-postmessage-demo-console',
        },
      },
    };
  }, [intent, selectedContext]);

  const sendToPortal = useCallback(() => {
    const portalOrigin = getPortalOrigin();
    if (!portalOrigin) {
      onLog(`Invalid portal URL: ${portalUrl}`);
      return;
    }

    const target =
      portalWindowRef.current && !portalWindowRef.current.closed
        ? portalWindowRef.current
        : openPortal();

    if (!target) {
      return;
    }

    const message = buildMessage();
    window.setTimeout(() => {
      target.postMessage(message, portalOrigin);
      onLog(`Sent ${intent} to ${portalOrigin}: ${selectedContext.type}`);
    }, 750);
  }, [buildMessage, getPortalOrigin, intent, onLog, openPortal, portalUrl, selectedContext.type]);

  return (
    <div className="panel portal-panel">
      <h2>Portal PostMessage Console</h2>
      <div className="portal-controls">
        <label>
          Portal URL
          <input
            value={portalUrl}
            onChange={(event) => setPortalUrl(event.target.value)}
            aria-label="Portal URL"
          />
        </label>
        <label>
          Intent
          <select value={intent} onChange={(event) => setIntent(event.target.value)}>
            <option value="scb.ViewLaunch">scb.ViewLaunch</option>
            <option value="scb.ViewUpdate">scb.ViewUpdate</option>
            <option value="ViewChart">ViewChart</option>
            <option value="ViewInstrument">ViewInstrument</option>
          </select>
        </label>
        <div className="portal-actions">
          <button onClick={openPortal}>Open Portal</button>
          <button onClick={sendToPortal}>Send to Portal</button>
        </div>
      </div>
    </div>
  );
}

function ActionsPanel({
  selectedContext,
  currentChannel,
  channels,
  onBroadcast,
  onRaiseIntent,
  onJoinChannel,
  onGetInfo,
}: {
  selectedContext: Context;
  currentChannel: { id: string } | null;
  channels: Array<{ id: string }>;
  onBroadcast: () => void;
  onRaiseIntent: (intent: string) => void;
  onJoinChannel: (channelId: string) => void;
  onGetInfo: () => void;
}) {
  const getChannelColor = (channelId: string): string => {
    const colors: Record<string, string> = {
      red: '#ffebee',
      green: '#e8f5e9',
      blue: '#e3f2fd',
      orange: '#fff3e0',
      yellow: '#fffde7',
      cyan: '#e0f7fa',
      magenta: '#fce4ec',
      purple: '#f3e5f5',
    };
    return colors[channelId] || '#f5f5f5';
  };

  return (
    <div className="panel">
      <h2>Actions</h2>
      <div className="action-grid">
        <div className="action-group">
          <h3>Broadcast</h3>
          <button onClick={onBroadcast}>Broadcast Context</button>
        </div>

        <div className="action-group">
          <h3>Intents</h3>
          <button onClick={() => onRaiseIntent('ViewChart')}>Raise ViewChart</button>
          <button onClick={() => onRaiseIntent('ViewInstrument')}>Raise ViewInstrument</button>
        </div>

        <div className="action-group">
          <h3>Channels</h3>
          <p>
            Current:{' '}
            {currentChannel?.id ? (
              <span
                className="channel-badge"
                style={{ backgroundColor: getChannelColor(currentChannel.id) }}
              >
                {currentChannel.id}
              </span>
            ) : (
              'None'
            )}
          </p>
          <div className="channel-buttons">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onJoinChannel(ch.id)}
                style={{ backgroundColor: getChannelColor(ch.id) }}
              >
                Join {ch.id}
              </button>
            ))}
          </div>
        </div>

        <div className="action-group">
          <h3>Info</h3>
          <button onClick={onGetInfo}>Get FDC3 Info</button>
        </div>
      </div>
    </div>
  );
}

function ActivityLogPanel({ logs }: { logs: string[] }) {
  return (
    <div className="panel">
      <h2>Activity Log</h2>
      <div className="log-container">
        {logs.length === 0 ? (
          <p className="no-logs">No activity yet. Try an action above!</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App(): React.ReactElement {
  const fdc3 = useFDC3();
  const channels = useUserChannels();
  const currentChannel = useCurrentChannel();

  const [logs, setLogs] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<Context>(sampleCashflow);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    addLog('FDC3 Agent connected');
  }, [addLog]);

  useIntentListener(
    'ViewChart',
    useCallback(
      (context: Context) => {
        addLog(`Received ViewChart intent: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  useIntentListener(
    'ViewInstrument',
    useCallback(
      (context: Context) => {
        addLog(`Received ViewInstrument intent: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  useContextListener(
    null,
    useCallback(
      (context: Context) => {
        addLog(`Received context: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  const handleBroadcast = async () => {
    try {
      await fdc3.broadcast(selectedContext);
      addLog(`Broadcasted context: ${selectedContext.type}`);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleRaiseIntent = async (intent: string) => {
    try {
      const resolution = await fdc3.raiseIntent(intent, selectedContext);
      addLog(`Intent ${intent} raised. Source: ${resolution.source?.appId || 'unknown'}`);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleJoinChannel = async (channelId: string) => {
    try {
      await fdc3.joinUserChannel(channelId);
      addLog(`Joined channel: ${channelId}`);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleGetInfo = async () => {
    try {
      const info = await fdc3.getInfo();
      addLog(`FDC3 Version: ${info.fdc3Version}`);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FDC3 PostMessage Console</h1>
        <p>Open the FMO portal and send intent/context messages through browser postMessage.</p>
      </header>

      <main className="app-main">
        <PortalPostMessagePanel selectedContext={selectedContext} onLog={addLog} />

        <ContextSelectionPanel
          selectedContext={selectedContext}
          onSelectContext={setSelectedContext}
        />

        <ActionsPanel
          selectedContext={selectedContext}
          currentChannel={currentChannel}
          channels={channels}
          onBroadcast={handleBroadcast}
          onRaiseIntent={handleRaiseIntent}
          onJoinChannel={handleJoinChannel}
          onGetInfo={handleGetInfo}
        />

        <ActivityLogPanel logs={logs} />
      </main>
    </div>
  );
}

export default App;
