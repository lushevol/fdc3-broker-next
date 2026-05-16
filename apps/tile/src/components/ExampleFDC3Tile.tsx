/**
 * Example FDC3 Tile Component
 *
 * Demonstrates how to use FDC3 operations in a tile:
 * - Intent sending and receiving
 * - Context broadcasting and listening
 * - Channel management
 *
 * This component follows the patterns from quickstart.md and demonstrates
 * best practices for FDC3 integration in MFE tiles.
 *
 * @see quickstart.md#L563-L705
 */

import type { AppIdentifier, Channel, Context, Listener } from 'ratan-fdc3-agent';
import { useEffect, useState } from 'react';
import type { TileProps } from '../Root/routing/common/interface';
import { FDC3Agent } from '../Root/import';

const { AgentProvider, useAppIdentifier, useFDC3, useIntentListener, useUserChannels } = FDC3Agent;
/**
 * Example instrument data for FDC3 operations
 */
const EXAMPLE_INSTRUMENT: Context = {
  type: 'fdc3.instrument',
  id: {
    ticker: 'AAPL',
    ISIN: 'US0378331005',
  },
  name: 'Apple Inc.',
};

/**
 * Styles for the example tile
 */
const styles = {
  container: {
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  header: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px',
  },
  section: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '12px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#666',
    marginBottom: '8px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    padding: '8px 16px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
  channelBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    marginRight: '8px',
  },
  contextDisplay: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    overflow: 'auto' as const,
    maxHeight: '100px',
  },
  receivedContext: {
    backgroundColor: '#369de7ff',
    border: '1px solid #90caf9',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '12px',
    marginTop: '8px',
  },
  status: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
};

const useFDC3TileRegister = (appIdentifier: AppIdentifier) => {
  const fdc3 = useFDC3();

  useEffect(() => {
    try {
      fdc3.registerTile(appIdentifier.instanceId, appIdentifier.appId);
    } catch (error) {
      console.error('Failed to register tile:', error);
    }

    return () => {
      try {
        fdc3.unregisterTile(appIdentifier.instanceId, appIdentifier.appId);
      } catch (error) {
        console.error('Failed to unregister tile:', error);
      }
    };
  }, [fdc3, appIdentifier.instanceId, appIdentifier.appId]);
};

/**
 * FDC3 Operations Section
 * Demonstrates sending intents and broadcasting context
 */
function FDC3Operations() {
  const fdc3 = useFDC3();
  const [status, setStatus] = useState<string>('');

  const handleRaiseIntent = async () => {
    try {
      setStatus('Raising ViewChart intent...');
      const resolution = await fdc3.raiseIntent('ViewChart', EXAMPLE_INSTRUMENT);
      setStatus(`Intent raised successfully! Handled by: ${resolution.source.appId}`);
      const res = await resolution.getResult();
      setStatus((s) => `${s}\nResult: ${JSON.stringify(res)}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const handleBroadcast = async () => {
    try {
      setStatus('Broadcasting instrument context...');
      await fdc3.broadcast(EXAMPLE_INSTRUMENT);
      setStatus('Context broadcasted successfully!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Intent & Broadcast</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          style={styles.button}
          onClick={handleRaiseIntent}
          title="Send ViewChart intent to another app"
        >
          Raise ViewChart Intent
        </button>
        <button
          type="button"
          style={styles.button}
          onClick={handleBroadcast}
          title="Broadcast instrument to channel"
        >
          Broadcast Context
        </button>
      </div>
      {status && <div style={styles.status}>{status}</div>}
    </div>
  );
}

/**
 * Intent Listener Section
 * Demonstrates receiving intents with automatic cleanup
 */
function IntentListenerSection() {
  const [receivedIntents, setReceivedIntents] = useState<Context[]>([]);

  // Listen for ViewChart intent - automatically cleans up on unmount
  useIntentListener('ViewChart', async (context: Context) => {
    setReceivedIntents((prev) => [...prev, context]);
    return 'foo';
  });

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Intent Listener (ViewChart)</div>
      {receivedIntents.length === 0 ? (
        <div style={styles.status}>No intents received yet</div>
      ) : (
        receivedIntents.map((context, index) => (
          <div
            data-testid="fdc3-view-chart-received"
            key={`${context.type}-${index}`}
            style={styles.receivedContext}
          >
            Received ViewChart with: {JSON.stringify(context, null, 2)}
          </div>
        ))
      )}
    </div>
  );
}

/**
 * Channel Management Section
 * Demonstrates joining channels and receiving context broadcasts
 */
function ChannelSection() {
  const fdc3 = useFDC3();
  const me = useAppIdentifier();
  const channels = useUserChannels();
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [receivedContexts, setReceivedContexts] = useState<Context[]>([]);

  // Fetch current channel on mount
  useEffect(() => {
    const initialUserChannel = async () => {
      try {
        const channels = await fdc3.getUserChannels();
        if (channels.length > 0) {
          await fdc3.joinUserChannel(channels[0].id);
          const channel = await fdc3.getCurrentChannel();
          setCurrentChannel(channel);
        }
      } catch (error) {
        console.error('Failed to initialize user channel:', error);
      }
    };
    initialUserChannel();
  }, [fdc3]);

  useEffect(() => {
    let listener: Listener | null = null;
    const init = async () => {
      if (currentChannel) {
        listener = await fdc3.addContextListener(null, (context, metadata) => {
          if (metadata && me && metadata?.source.appId === me?.appId) {
            return;
          }
          setReceivedContexts((prev) => [...prev, context]);
        });
      }
    };
    init();
    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [currentChannel, fdc3, me]);

  const handleJoinChannel = async (channelId: string) => {
    try {
      await fdc3.joinUserChannel(channelId);
      // Update local state after successful join
      const channel = await fdc3.getCurrentChannel();
      setCurrentChannel(channel);
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const handleLeaveChannel = async () => {
    try {
      await fdc3.leaveCurrentChannel();
      // Update local state after successful leave
      setCurrentChannel(null);
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

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
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Channel Management</div>

      {/* Current Channel Display */}
      <div style={{ marginBottom: '12px' }}>
        <div style={styles.status}>
          Current Channel:{' '}
          {currentChannel ? (
            <span
              style={{
                ...styles.channelBadge,
                backgroundColor: getChannelColor(currentChannel.id),
              }}
            >
              {currentChannel.id}
            </span>
          ) : (
            <span>None</span>
          )}
        </div>
        {currentChannel && (
          <button type="button" style={styles.buttonSecondary} onClick={handleLeaveChannel}>
            Leave Channel
          </button>
        )}
      </div>

      {/* Available Channels */}
      <div style={{ marginBottom: '12px' }}>
        <div style={styles.status}>Available Channels:</div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: '4px',
          }}
        >
          {channels.map((ch) => (
            <button
              type="button"
              key={ch.id}
              style={{
                ...styles.channelBadge,
                backgroundColor: getChannelColor(ch.id),
                cursor: currentChannel?.id === ch.id ? 'default' : 'pointer',
                opacity: currentChannel?.id === ch.id ? 0.5 : 1,
              }}
              onClick={() => currentChannel?.id !== ch.id && handleJoinChannel(ch.id)}
              disabled={currentChannel?.id === ch.id}
            >
              {ch.id}
            </button>
          ))}
        </div>
      </div>

      {/* Received Contexts */}
      <div>
        <div style={styles.status}>Received Contexts:</div>
        {receivedContexts.length === 0 ? (
          <div style={styles.status}>No contexts received</div>
        ) : (
          receivedContexts.map((context, index) => (
            <div key={context.name} style={styles.receivedContext}>
              {JSON.stringify(context, null, 2)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Current Context Section
 * Demonstrates getting the current channel context
 */
function CurrentContextSection() {
  const fdc3 = useFDC3();
  const [currentContext, setCurrentContext] = useState<Context | null>(null);

  useEffect(() => {
    // Get current context when component mounts
    const getContext = async () => {
      try {
        const channel = await fdc3.getCurrentChannel();
        if (channel) {
          const context = await channel.getCurrentContext();
          setCurrentContext(context);
        }
      } catch (error) {
        console.error('Failed to get current context:', error);
      }
    };

    getContext();
  }, [fdc3]);

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Current Channel Context</div>
      {currentContext ? (
        <div style={styles.contextDisplay}>{JSON.stringify(currentContext, null, 2)}</div>
      ) : (
        <div style={styles.status}>No context on current channel</div>
      )}
    </div>
  );
}

/**
 * Example FDC3 Tile Component
 *
 * Wraps the tile content with AgentProvider and demonstrates all FDC3 operations.
 *
 * @example
 * ```tsx
 * import { ExampleFDC3Tile } from './components/ExampleFDC3Tile';
 *
 * function App() {
 *   return <ExampleFDC3Tile />;
 * }
 * ```
 */
export function ExampleFDC3Tile(props: TileProps) {
  const appIdentifier = {
    appId: props.tile.replace(/\//g, ''),
    instanceId: props.id,
  };
  useFDC3TileRegister(appIdentifier);
  return (
    <AgentProvider appIdentifier={appIdentifier}>
      <div style={styles.container}>
        <div style={styles.header}>FDC3 Example Tile</div>
        <FDC3Operations />
        <IntentListenerSection />
        <ChannelSection />
        <CurrentContextSection />
      </div>
    </AgentProvider>
  );
}

/**
 * Default export for the example tile
 */
export default ExampleFDC3Tile;
