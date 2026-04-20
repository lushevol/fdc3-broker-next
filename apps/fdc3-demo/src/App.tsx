import React, { useState, useCallback, useEffect } from 'react';
import type { AppIdentifier, Context, IntentResolution } from '@fm/fdc3-agent';
import {
  useFDC3,
  useIntentListener,
  useContextListener,
  useUserChannels,
  useCurrentChannel,
  useAppIdentifier,
} from '@fm/fdc3-agent';

// Sample instrument context
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

/**
 * FDC3 Tile Register Hook
 * Registers and unregisters the tile with the FDC3 broker
 */
const useFDC3TileRegister = (appIdentifier: AppIdentifier) => {
  const fdc3 = useFDC3();

  useEffect(() => {
    try {
      fdc3.registerTile(appIdentifier.instanceId!, appIdentifier.appId);
    } catch (error) {
      console.error('Failed to register tile:', error);
    }

    return () => {
      try {
        fdc3.unregisterTile(appIdentifier.instanceId!, appIdentifier.appId);
      } catch (error) {
        console.error('Failed to unregister tile:', error);
      }
    };
  }, [fdc3, appIdentifier.instanceId, appIdentifier.appId]);
};

/**
 * Context Selection Panel
 * Allows selecting between different context types
 */
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

/**
 * Actions Panel
 * Provides FDC3 action buttons
 */
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

/**
 * Activity Log Panel
 * Displays FDC3 operation logs
 */
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

/**
 * Main App Component
 */
function App(): React.ReactElement {
  const fdc3 = useFDC3();
  const channels = useUserChannels();
  const currentChannel = useCurrentChannel();
  const appIdentifier = useAppIdentifier();

  const [logs, setLogs] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<Context>(sampleInstrument);

  // Register tile with FDC3 broker
  useFDC3TileRegister(appIdentifier);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(0, 50));
  }, []);

  // Listen for ViewChart intent
  useIntentListener(
    'ViewChart',
    useCallback(
      (context: Context) => {
        addLog(`Received ViewChart intent with context: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  // Listen for ViewInstrument intent
  useIntentListener(
    'ViewInstrument',
    useCallback(
      (context: Context) => {
        addLog(`Received ViewInstrument intent with context: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  // Listen for all context broadcasts
  useContextListener(
    null,
    useCallback(
      (context: Context) => {
        addLog(`Received context broadcast: ${JSON.stringify(context)}`);
      },
      [addLog],
    ),
  );

  const handleBroadcast = async () => {
    try {
      await fdc3.broadcast(selectedContext);
      addLog(`Broadcasted context: ${selectedContext.type}`);
    } catch (error) {
      addLog(`Error broadcasting: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleRaiseIntent = async (intent: string) => {
    try {
      const resolution: IntentResolution = await fdc3.raiseIntent(intent, selectedContext);
      addLog(`Intent ${intent} raised successfully. Source: ${resolution.source.appId}`);
    } catch (error) {
      addLog(`Error raising intent: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleJoinChannel = async (channelId: string) => {
    try {
      await fdc3.joinChannel(channelId);
      addLog(`Joined channel: ${channelId}`);
    } catch (error) {
      addLog(`Error joining channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleGetInfo = async () => {
    try {
      const info = await fdc3.getInfo();
      addLog(`FDC3 Info: ${JSON.stringify(info)}`);
    } catch (error) {
      addLog(`Error getting info: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FDC3 Demo Application</h1>
        <p>Demonstrating FDC3 Agent and Broker capabilities</p>
      </header>

      <main className="app-main">
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
