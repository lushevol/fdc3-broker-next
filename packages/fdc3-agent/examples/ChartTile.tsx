/**
 * Chart Tile Example - Complete FDC3 Agent Usage Demonstration
 *
 * This example demonstrates all common FDC3 operations that a tile would use:
 * - Raising intents (sending requests to other apps)
 * - Listening for intents (receiving requests from other apps)
 * - Broadcasting context (sharing data with all apps on channel)
 * - Listening for context (receiving shared data from other apps)
 * - Channel management (joining and displaying current channel)
 * - Displaying current state and status
 *
 * @packageDocumentation
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  type Context,
  useContextListener,
  useCurrentChannel,
  useFDC3,
  useIntentListener,
  useUserChannels,
} from '../src';

/**
 * Sample instrument data for demonstration purposes
 */
const SAMPLE_INSTRUMENTS: Context[] = [
  {
    type: 'fdc3.instrument',
    name: 'Apple Inc.',
    id: { ticker: 'AAPL' },
  },
  {
    type: 'fdc3.instrument',
    name: 'Microsoft Corporation',
    id: { ticker: 'MSFT' },
  },
  {
    type: 'fdc3.instrument',
    name: 'Google Inc.',
    id: { ticker: 'GOOGL' },
  },
  {
    type: 'fdc3.instrument',
    name: 'Amazon.com Inc.',
    id: { ticker: 'AMZN' },
  },
];

/**
 * ChartTile Component
 *
 * A comprehensive example tile that demonstrates all major FDC3 operations.
 * This component showcases how to use the FDC3 agent hooks in a real-world scenario.
 *
 * Features demonstrated:
 * 1. **Send Intent**: Button to raise ViewChart intent with instrument context
 * 2. **Listen for Intent**: useIntentListener to handle ViewChart requests
 * 3. **Broadcast Context**: Button to broadcast instrument context to all apps
 * 4. **Listen for Context**: useContextListener to receive instrument broadcasts
 * 5. **Channel Management**: Join user channels, display current channel
 * 6. **Display State**: Show current instrument, channel, listener status
 *
 * @example
 * ```tsx
 * import { AgentProvider } from '@fm/fdc3-agent';
 * import { ChartTile } from './ChartTile';
 *
 * function App() {
 *   return (
 *     <AgentProvider>
 *       <ChartTile />
 *     </AgentProvider>
 *   );
 * }
 * ```
 */
export const ChartTile: React.FC = () => {
  // ========================================================================
  // FDC3 Hooks Setup
  // ========================================================================

  /**
   * Get the FDC3 DesktopAgent API
   * This provides access to all FDC3 operations like broadcast, raiseIntent, etc.
   */
  const fdc3 = useFDC3();

  /**
   * Get the current FDC3 channel
   * Returns the channel this app has joined, or null if not in a channel
   */
  const currentChannel = useCurrentChannel();

  /**
   * Get list of available user channels
   * Returns predefined channels that users can join for communication
   */
  const userChannels = useUserChannels();

  // ========================================================================
  // Component State
  // ========================================================================

  const [currentInstrument, setCurrentInstrument] = useState<Context | null>(null);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [intentListenerActive, setIntentListenerActive] = useState(false);
  const [contextListenerActive, setContextListenerActive] = useState(false);

  // ========================================================================
  // Intent Listener Setup
  // ========================================================================

  /**
   * Listen for ViewChart intent from other applications
   *
   * This hook automatically:
   * - Registers the listener when component mounts
   * - Unregisters when component unmounts
   * - Handles the ViewChart intent when other apps call raiseIntent('ViewChart', context)
   *
   * Common use case: Another tile (e.g., Watchlist) raises ViewChart intent
   * to request this chart tile to display a specific instrument.
   */
  useIntentListener('ViewChart', (context: Context) => {
    addStatusMessage(`ViewChart intent received: ${JSON.stringify(context)}`);

    // Update current instrument to display in chart
    if (context.type === 'fdc3.instrument') {
      setCurrentInstrument(context);
    }
  });

  // Track intent listener status
  useEffect(() => {
    setIntentListenerActive(true);
    return () => {
      setIntentListenerActive(false);
    };
  }, []);

  // ========================================================================
  // Context Listener Setup
  // ========================================================================

  /**
   * Listen for instrument context broadcasts
   *
   * This hook automatically:
   * - Registers the listener when component mounts
   * - Unregisters when component unmounts
   * - Receives all instrument broadcasts on the current channel
   *
   * Common use case: Any app on the same channel broadcasts an instrument,
   * and this tile automatically updates to display it.
   */
  useContextListener('fdc3.instrument', (context: Context) => {
    addStatusMessage(`Context broadcast received: ${JSON.stringify(context)}`);

    // Update current instrument when any app broadcasts
    if (context.type === 'fdc3.instrument') {
      setCurrentInstrument(context);
    }
  });

  // Track context listener status
  useEffect(() => {
    setContextListenerActive(true);
    return () => {
      setContextListenerActive(false);
    };
  }, []);

  // ========================================================================
  // Helper Functions
  // ========================================================================

  /**
   * Add a timestamped status message to the log
   */
  const addStatusMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatusMessages((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  /**
   * Clear all status messages
   */
  const clearStatusMessages = () => {
    setStatusMessages([]);
  };

  // ========================================================================
  // FDC3 Operation Handlers
  // ========================================================================

  /**
   * Handle broadcasting an instrument to all apps on the current channel
   *
   * Broadcast shares context with ALL apps on the same channel.
   * Use this when you want to notify all apps about a context change.
   *
   * Error handling: Try-catch ensures the app doesn't crash if FDC3 fails.
   * Common errors: Not joined to a channel, invalid context.
   */
  const handleBroadcast = async (instrument: Context) => {
    try {
      await fdc3.broadcast(instrument);
      addStatusMessage(`Broadcast: ${instrument.id?.ticker || instrument.name}`);
    } catch (error) {
      addStatusMessage(
        `Broadcast failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  /**
   * Handle raising a ViewChart intent to other apps
   *
   * Raising an intent sends a targeted request to apps that handle that intent.
   * Unlike broadcast, intents are specifically handled by target apps.
   *
   * Error handling: Try-catch ensures graceful failure.
   * Common errors: No target app found, target app not available.
   */
  const handleRaiseIntent = async (instrument: Context) => {
    try {
      const resolution = await fdc3.raiseIntent('ViewChart', instrument);
      addStatusMessage(`Intent raised to: ${resolution.source?.appId || 'unknown app'}`);
    } catch (error) {
      addStatusMessage(
        `Intent failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  /**
   * Handle joining a user channel
   *
   * Channels are communication contexts. Apps must join the same channel
   * to share context via broadcast.
   *
   * Common channels: 'red', 'green', 'blue', 'global'
   */
  const handleJoinChannel = async (channelId: string) => {
    try {
      await fdc3.joinChannel(channelId);
      addStatusMessage(`Joined channel: ${channelId}`);
    } catch (error) {
      addStatusMessage(
        `Join channel failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  // ========================================================================
  // Render Methods
  // ========================================================================

  /**
   * Render the current instrument display
   */
  const renderInstrumentDisplay = () => {
    if (!currentInstrument) {
      return (
        <div style={styles.placeholder}>
          <p>No instrument selected</p>
          <p style={styles.hintText}>Select an instrument below or wait for intent/context</p>
        </div>
      );
    }

    return (
      <div style={styles.instrumentCard}>
        <h3 style={styles.instrumentName}>{currentInstrument.name || 'Unnamed Instrument'}</h3>
        <p style={styles.instrumentType}>Type: {currentInstrument.type}</p>
        {currentInstrument.id && (
          <div style={styles.instrumentId}>
            {Object.entries(currentInstrument.id).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render status message log
   */
  const renderStatusLog = () => {
    if (statusMessages.length === 0) {
      return null;
    }

    return (
      <div style={styles.statusLog}>
        <div style={styles.statusLogHeader}>
          <h4>Activity Log</h4>
          <button onClick={clearStatusMessages} style={styles.clearButton}>
            Clear
          </button>
        </div>
        <div style={styles.statusMessages}>
          {statusMessages.map((msg, index) => (
            <div key={index} style={styles.statusMessage}>
              {msg}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render channel information
   */
  const renderChannelInfo = () => {
    return (
      <div style={styles.channelInfo}>
        <h4>Channel Status</h4>
        <div style={styles.channelDetails}>
          <div>
            <strong>Current:</strong>{' '}
            {currentChannel?.displayMetadata?.name || currentChannel?.id || 'None'}
          </div>
          <div>
            <strong>Listener Status:</strong>
          </div>
          <ul style={styles.listenerStatus}>
            <li>
              ViewChart Intent:{' '}
              {intentListenerActive ? (
                <span style={styles.active}>Active</span>
              ) : (
                <span style={styles.inactive}>Inactive</span>
              )}
            </li>
            <li>
              Instrument Context:{' '}
              {contextListenerActive ? (
                <span style={styles.active}>Active</span>
              ) : (
                <span style={styles.inactive}>Inactive</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    );
  };

  /**
   * Render channel switcher
   */
  const renderChannelSwitcher = () => {
    if (userChannels.length === 0) {
      return (
        <div style={styles.noChannels}>
          <p>No user channels available</p>
        </div>
      );
    }

    return (
      <div style={styles.channelSwitcher}>
        <label htmlFor="channel-select" style={styles.label}>
          Join Channel:
        </label>
        <select
          id="channel-select"
          style={styles.select}
          onChange={(e) => handleJoinChannel(e.target.value)}
          value={currentChannel?.id || ''}
        >
          <option value="">Select a channel...</option>
          {userChannels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.displayMetadata?.name || channel.id}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // ========================================================================
  // Main Render
  // ========================================================================

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>FDC3 Chart Tile Example</h1>
        <p style={styles.subtitle}>Demonstrating all FDC3 agent operations in a single tile</p>
      </header>

      {/* Current Instrument Display */}
      <section style={styles.section}>
        <h2>Current Instrument</h2>
        {renderInstrumentDisplay()}
      </section>

      {/* FDC3 Operations */}
      <section style={styles.section}>
        <h2>FDC3 Operations</h2>

        {/* Broadcast Instrument */}
        <div style={styles.operationGroup}>
          <h3 style={styles.operationTitle}>Broadcast Context</h3>
          <p style={styles.operationDescription}>
            Share instrument with all apps on the current channel
          </p>
          <div style={styles.buttonGroup}>
            {SAMPLE_INSTRUMENTS.map((instrument) => (
              <button
                key={instrument.id?.ticker}
                onClick={() => handleBroadcast(instrument)}
                style={styles.button}
              >
                Broadcast {instrument.id?.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Raise ViewChart Intent */}
        <div style={styles.operationGroup}>
          <h3 style={styles.operationTitle}>Raise ViewChart Intent</h3>
          <p style={styles.operationDescription}>Send ViewChart request to apps that handle it</p>
          <div style={styles.buttonGroup}>
            {SAMPLE_INSTRUMENTS.map((instrument) => (
              <button
                key={instrument.id?.ticker}
                onClick={() => handleRaiseIntent(instrument)}
                style={styles.button}
              >
                ViewChart {instrument.id?.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Management */}
        <div style={styles.operationGroup}>
          <h3 style={styles.operationTitle}>Channel Management</h3>
          {renderChannelSwitcher()}
          {renderChannelInfo()}
        </div>
      </section>

      {/* Activity Log */}
      <section style={styles.section}>
        <h2>Activity</h2>
        {renderStatusLog()}
      </section>

      {/* Explanation */}
      <section style={styles.section}>
        <h2>About This Example</h2>
        <div style={styles.explanation}>
          <p>
            This example demonstrates how to use the FDC3 agent hooks in a production-ready tile
            component.
          </p>
          <h3>Features Demonstrated:</h3>
          <ul>
            <li>
              <strong>Send Intent:</strong> Buttons raise ViewChart intent with instrument context
            </li>
            <li>
              <strong>Listen for Intent:</strong> useIntentListener handles ViewChart requests from
              other apps
            </li>
            <li>
              <strong>Broadcast Context:</strong> Buttons broadcast instrument to all apps on
              current channel
            </li>
            <li>
              <strong>Listen for Context:</strong> useContextListener receives instrument broadcasts
            </li>
            <li>
              <strong>Channel Management:</strong> Join user channels and display current channel
            </li>
            <li>
              <strong>Error Handling:</strong> All FDC3 operations wrapped in try-catch
            </li>
            <li>
              <strong>State Display:</strong> Shows current instrument, channel, and listener status
            </li>
          </ul>
          <h3>Best Practices Shown:</h3>
          <ul>
            <li>Use hooks for automatic listener cleanup</li>
            <li>Handle errors gracefully with try-catch</li>
            <li>Display informative status messages</li>
            <li>Type-safe operations with TypeScript</li>
            <li>Semantic HTML structure</li>
            <li>Clear visual hierarchy</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ChartTile;

// ============================================================================
// Inline Styles
// ============================================================================

/**
 * Inline styles for the ChartTile component
 *
 * In production, consider using CSS modules, styled-components, or a design system.
 * Inline styles are used here for simplicity and portability of the example.
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginTop: '10px',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  placeholder: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '2px dashed #e0e0e0',
  },
  hintText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
  },
  instrumentCard: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  instrumentName: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    color: '#333',
  },
  instrumentType: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#666',
  },
  instrumentId: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
  },
  operationGroup: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  operationTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#333',
  },
  operationDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  channelSwitcher: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  select: {
    width: '100%',
    maxWidth: '300px',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  noChannels: {
    padding: '10px',
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
  channelInfo: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  channelDetails: {
    fontSize: '14px',
  },
  listenerStatus: {
    margin: '10px 0 0 20px',
    padding: 0,
  },
  active: {
    color: '#4caf50',
    fontWeight: 500,
  },
  inactive: {
    color: '#f44336',
    fontWeight: 500,
  },
  statusLog: {
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  statusLogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
  },
  statusLogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
  },
  clearButton: {
    padding: '5px 10px',
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  statusMessages: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '10px 15px',
  },
  statusMessage: {
    fontSize: '12px',
    fontFamily: 'monospace',
    padding: '5px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  explanation: {
    fontSize: '14px',
    lineHeight: '1.6',
  },
};
