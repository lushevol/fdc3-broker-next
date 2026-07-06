/**
 * FDC3 Console Debugger Tile
 *
 * A developer tool for monitoring and testing FDC3 interop in real time.
 * Features:
 * - Activity log: intercepts and displays all FDC3 events (intents, broadcasts,
 *   listener registrations)
 * - Listener inspector: shows all registered intent listeners grouped by intent
 * - Actions panel: manually raise intents, broadcast contexts with JSON editor
 * - Quick-action buttons for common scenarios (ViewChart, SearchTrades, etc.)
 *
 * This tile hooks into the FDC3 broker via window.__RATAN_FDC3__ to intercept
 * all FDC3 activity across the entire micro-frontend platform, not just events
 * originating from this tile.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { FDC3Agent } from '../Root/import';
import type { TileProps } from '../Root/routing/common/interface';

const { useFDC3, useAppIdentifier } = FDC3Agent;

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type LogEntryType =
  | 'intent_raised'
  | 'context_broadcast'
  | 'context_received'
  | 'listener_registered'
  | 'channel_joined'
  | 'channel_left'
  | 'info';

interface LogEntry {
  id: number;
  ts: string;
  type: LogEntryType;
  message: string;
}

interface AppChannel {
  id: string;
  displayName?: string;
  type?: 'user' | 'app';
}

type TabId = 'activity' | 'listeners' | 'actions';

/* ------------------------------------------------------------------ */
/*  Styles (dark VS Code–inspired terminal theme)                     */
/* ------------------------------------------------------------------ */

const S = {
  container: {
    padding: 0,
    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontSize: '13px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #3c3c3c',
    flexShrink: 0,
    userSelect: 'none' as const,
  },
  title: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#569cd6',
    letterSpacing: '0.5px',
  },
  titleIcon: {
    color: '#6a9955',
    marginRight: '6px',
  },
  tabs: {
    display: 'flex',
    gap: 0,
  },
  tabBase: {
    padding: '6px 14px',
    fontSize: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#252526',
    color: '#969696',
    fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    borderBottom: '2px solid #569cd6',
  },
  tabHover: {
    color: '#e0e0e0',
  },
  logContainer: {
    flex: 1,
    overflow: 'auto',
    padding: 0,
  },
  logEntry: {
    padding: '3px 12px',
    fontSize: '12px',
    lineHeight: '20px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
  },
  logEntryEven: {
    backgroundColor: '#1e1e1e',
  },
  logEntryOdd: {
    backgroundColor: '#252526',
  },
  logTs: {
    color: '#6a9955',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  logIcon: {
    flexShrink: 0,
    width: '16px',
    textAlign: 'center' as const,
  },
  logMsg: {
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
  },
  emptyLog: {
    padding: '24px 12px',
    color: '#808080',
    fontStyle: 'italic',
    fontSize: '12px',
    textAlign: 'center' as const,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    backgroundColor: '#252526',
    borderTop: '1px solid #3c3c3c',
    flexShrink: 0,
  },
  btn: {
    padding: '4px 10px',
    fontSize: '11px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#0e639c',
    color: '#fff',
    fontFamily: 'inherit',
  },
  btnDanger: {
    backgroundColor: '#a1260d',
    borderColor: '#5a1d0d',
  },
  btnSecondary: {
    backgroundColor: '#3c3c3c',
    color: '#cccccc',
  },
  btnSuccess: {
    backgroundColor: '#1b6e3a',
    borderColor: '#154a28',
  },
  panel: {
    flex: 1,
    overflow: 'auto',
    padding: '12px',
  },
  sectionTitle: {
    color: '#569cd6',
    fontSize: '13px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    paddingBottom: '4px',
    borderBottom: '1px solid #3c3c3c',
  },
  listenerIntent: {
    color: '#569cd6',
    fontSize: '13px',
    fontWeight: 600,
    padding: '4px 0',
  },
  listenerItem: {
    padding: '2px 12px',
    fontSize: '11px',
    color: '#ce9178',
    lineHeight: '18px',
  },
  channelItem: {
    padding: '2px 12px',
    fontSize: '11px',
    lineHeight: '18px',
  },
  channelCurrent: {
    color: '#4ec9b0',
  },
  channelInactive: {
    color: '#808080',
  },
  appIdBlock: {
    fontSize: '11px',
    color: '#ce9178',
    padding: '6px 12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    whiteSpace: 'pre-wrap' as const,
    fontFamily: 'inherit',
    marginTop: '4px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  label: {
    color: '#969696',
    fontSize: '11px',
    display: 'block',
    marginBottom: '3px',
  },
  input: {
    width: '100%',
    padding: '5px 8px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    fontFamily: 'inherit',
    fontSize: '12px',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  textarea: {
    width: '100%',
    minHeight: '72px',
    padding: '5px 8px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    fontFamily: 'inherit',
    fontSize: '11px',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  btnRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
    flexWrap: 'wrap' as const,
  },
  statusMsg: {
    color: '#6a9955',
    fontSize: '11px',
    marginTop: '8px',
    padding: '6px 8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '3px',
  },
  errorMsg: {
    color: '#f44747',
  },
  quickActions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginTop: '4px',
  },
  cntBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: '8px',
    backgroundColor: '#2d2d2d',
    color: '#969696',
    fontSize: '10px',
    marginLeft: '6px',
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                    */
/* ------------------------------------------------------------------ */

const LOG_COLORS: Record<LogEntryType, string> = {
  intent_raised: '#569cd6',
  context_broadcast: '#6a9955',
  context_received: '#4ec9b0',
  listener_registered: '#c586c0',
  channel_joined: '#dcdcaa',
  channel_left: '#f44747',
  info: '#808080',
};

const LOG_ICONS: Record<LogEntryType, string> = {
  intent_raised: '▲',
  context_broadcast: '→',
  context_received: '←',
  listener_registered: '●',
  channel_joined: '◉',
  channel_left: '◎',
  info: 'ℹ',
};

/* ------------------------------------------------------------------ */
/*  Broker interceptor hook                                           */
/* ------------------------------------------------------------------ */

interface BrokerState {
  listenerCounts: Map<string, number>;
  channels: AppChannel[];
  currentChannelId: string | null;
}

function useBrokerInterceptor(
  addLog: (type: LogEntryType, message: string) => void,
  brokerAvailable: boolean,
): BrokerState & { refresh: () => void } {
  const [listenerCounts, setListenerCounts] = useState<Map<string, number>>(new Map());
  const [channels, setChannels] = useState<AppChannel[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
    if (!broker) return;

    // Read intent listener counts
    if (broker.intentListeners instanceof Map) {
      const counts = new Map<string, number>();
      for (const [intent, handlers] of broker.intentListeners.entries()) {
        if (Array.isArray(handlers) && handlers.length > 0) {
          counts.set(intent, handlers.length);
        }
      }
      setListenerCounts(counts);
    }

    // Read channel info
    broker.getUserChannels?.().then((chs: any[]) => {
      setChannels(
        (chs ?? []).map((ch: any) => ({
          id: ch.id,
          displayName: ch.displayName ?? ch.id,
          type: ch.type ?? 'user',
        })),
      );
    }).catch(() => {});

    broker.getCurrentChannel?.().then((ch: any) => {
      setCurrentChannelId(ch?.id ?? null);
    }).catch(() => {});
  }, []);

  // Periodic polling
  useEffect(() => {
    if (!brokerAvailable) return;
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [brokerAvailable, refresh]);

  // On broker availability, log current state
  useEffect(() => {
    if (!brokerAvailable) return;
    const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
    if (!broker) return;

    const count = broker.intentListeners instanceof Map ? broker.intentListeners.size : 0;
    addLog('info', `Attached to FDC3 broker (${count} listener group(s) found)`);
  }, [brokerAvailable, addLog]);

  return { listenerCounts, channels, currentChannelId, refresh };
}

/* ------------------------------------------------------------------ */
/*  Activity tab                                                      */
/* ------------------------------------------------------------------ */

interface ActivityTabProps {
  logs: LogEntry[];
  logEndRef: React.RefObject<HTMLDivElement | null>;
}

function ActivityTab({ logs, logEndRef }: ActivityTabProps) {
  if (logs.length === 0) {
    return (
      <div style={S.logContainer}>
        <div style={S.emptyLog}>
          Waiting for FDC3 activity&hellip;
          <br />
          Try raising an intent or broadcasting context from another tile.
        </div>
        <div ref={logEndRef} />
      </div>
    );
  }

  return (
    <div style={S.logContainer}>
      {logs.map((entry, idx) => (
        <div
          key={entry.id}
          style={{
            ...S.logEntry,
            ...(idx % 2 === 0 ? S.logEntryEven : S.logEntryOdd),
          }}
        >
          <span style={S.logTs}>{entry.ts}</span>
          <span style={{ ...S.logIcon, color: LOG_COLORS[entry.type] }}>
            {LOG_ICONS[entry.type]}
          </span>
          <span style={S.logMsg}>{entry.message}</span>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Listeners tab                                                     */
/* ------------------------------------------------------------------ */

interface ListenersTabProps {
  listenerCounts: Map<string, number>;
  channels: AppChannel[];
  currentChannelId: string | null;
  appIdentity: Record<string, unknown> | null;
}

function ListenersTab({ listenerCounts, channels, currentChannelId, appIdentity }: ListenersTabProps) {
  return (
    <div style={S.panel}>
      {/* Intent listeners */}
      <h3 style={S.sectionTitle}>
        Intent Listeners
        <span style={S.cntBadge}>{listenerCounts.size}</span>
      </h3>
      {listenerCounts.size === 0 ? (
        <div style={{ color: '#808080', fontSize: '12px', padding: '4px 0' }}>
          No intent listeners registered
        </div>
      ) : (
        Array.from(listenerCounts.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([intent, count]) => (
            <div key={intent}>
              <div style={S.listenerIntent}>
                {intent}
                <span style={S.cntBadge}>{count}</span>
              </div>
              <div style={S.listenerItem}>
                {count} handler{count !== 1 ? 's' : ''} registered
                {count === 1 ? '' : ` (listening from ${count} source${count !== 1 ? 's' : ''})`}
              </div>
            </div>
          ))
      )}

      {/* User channels */}
      <h3 style={{ ...S.sectionTitle, marginTop: '20px' }}>
        User Channels
        <span style={S.cntBadge}>{channels.length}</span>
      </h3>
      {channels.length === 0 ? (
        <div style={{ color: '#808080', fontSize: '12px', padding: '4px 0' }}>
          No user channels available
        </div>
      ) : (
        channels.map((ch) => (
          <div
            key={ch.id}
            style={{
              ...S.channelItem,
              color: ch.id === currentChannelId ? '#4ec9b0' : '#808080',
            }}
          >
            {ch.id === currentChannelId ? '◉ ' : '○ '}
            {ch.displayName ?? ch.id}
            {ch.id === currentChannelId ? (
              <span style={{ color: '#4ec9b0', marginLeft: '6px' }}>(current)</span>
            ) : null}
          </div>
        ))
      )}

      {/* App identity */}
      <h3 style={{ ...S.sectionTitle, marginTop: '20px' }}>App Identity</h3>
      <div style={S.appIdBlock}>
        {appIdentity
          ? JSON.stringify(appIdentity, null, 2)
          : '(not scoped — using unscoped agent)'}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Actions tab                                                       */
/* ------------------------------------------------------------------ */

const QUICK_ACTIONS = [
  {
    label: 'ViewChart (AAPL)',
    intent: 'ViewChart',
    context: { type: 'fdc3.instrument', id: { ticker: 'AAPL' }, name: 'Apple Inc.' },
  },
  {
    label: 'SearchTrades (Pending)',
    intent: 'SearchTrades',
    context: { type: 'fdc3.trade.query', filters: { status: 'PENDING_VALIDATION' } },
  },
  {
    label: 'SearchCashflows (Waiting)',
    intent: 'SearchCashflows',
    context: {
      type: 'scb.fmptp.cashflow.query',
      target: 'cashflow_cn',
      filters: [{ field: 'Cashflow.Cashflow_State', operator: 'IN', values: ['WAITING'] }],
    },
  },
  {
    label: 'Broadcast Instrument',
    intent: '',
    context: { type: 'fdc3.instrument', id: { ticker: 'MSFT' }, name: 'Microsoft Corp.' },
  },
];

interface ActionsTabProps {
  fdc3: ReturnType<typeof useFDC3>;
  addLog: (type: LogEntryType, message: string) => void;
}

function ActionsTab({ fdc3, addLog }: ActionsTabProps) {
  const [intent, setIntent] = useState('ViewChart');
  const [contextJson, setContextJson] = useState(
    () => JSON.stringify(QUICK_ACTIONS[0].context, null, 2),
  );
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const applyQuickAction = (qa: (typeof QUICK_ACTIONS)[number]) => {
    setContextJson(JSON.stringify(qa.context, null, 2));
    if (qa.intent) {
      setIntent(qa.intent);
    }
  };

  const handleRaiseIntent = async () => {
    setStatus('');
    setIsError(false);
    let parsed: unknown;
    try {
      parsed = JSON.parse(contextJson);
    } catch {
      setStatus('Invalid JSON in context editor');
      setIsError(true);
      return;
    }

    try {
      addLog('info', `Manual: raising intent "${intent}"`);
      const resolution = await fdc3.raiseIntent(intent, parsed as any);
      const appId = resolution?.source?.appId ?? 'unknown';
      setStatus(`Intent "${intent}" raised → handled by: ${appId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setIsError(true);
      addLog('info', `Manual: raiseIntent("${intent}") failed: ${msg}`);
    }
  };

  const handleBroadcast = async () => {
    setStatus('');
    setIsError(false);
    let parsed: unknown;
    try {
      parsed = JSON.parse(contextJson);
    } catch {
      setStatus('Invalid JSON in context editor');
      setIsError(true);
      return;
    }

    try {
      addLog('info', `Manual: broadcasting context`);
      await fdc3.broadcast(parsed as any);
      const ctxType = (parsed as any)?.type ?? 'unknown';
      setStatus(`Context "${ctxType}" broadcast successfully`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setIsError(true);
    }
  };

  return (
    <div style={S.panel}>
      {/* Intent name */}
      <div style={S.formGroup}>
        <label style={S.label}>Intent Name</label>
        <input
          style={S.input}
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="e.g. ViewChart"
        />
      </div>

      {/* Context JSON */}
      <div style={S.formGroup}>
        <label style={S.label}>Context (JSON)</label>
        <textarea
          style={S.textarea}
          value={contextJson}
          onChange={(e) => setContextJson(e.target.value)}
          placeholder='{ "type": "fdc3.instrument", ... }'
          spellCheck={false}
        />
      </div>

      {/* Action buttons */}
      <div style={S.btnRow}>
        <button type="button" style={S.btn} onClick={handleRaiseIntent}>
          Raise Intent
        </button>
        <button type="button" style={{ ...S.btn, ...S.btnSuccess }} onClick={handleBroadcast}>
          Broadcast Context
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: '16px' }}>
        <label style={S.label}>Quick Actions</label>
        <div style={S.quickActions}>
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.label}
              type="button"
              style={{ ...S.btn, ...S.btnSecondary, fontSize: '10px' }}
              onClick={() => applyQuickAction(qa)}
            >
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status message */}
      {status && (
        <div style={{ ...S.statusMsg, ...(isError ? S.errorMsg : {}) }}>
          {isError ? '✖ ' : '✔ '}
          {status}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

const FDC3ConsoleTile: React.FC<TileProps> = () => {
  const fdc3 = useFDC3();
  const appIdentity = useAppIdentifier();

  const [activeTab, setActiveTab] = useState<TabId>('activity');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [brokerAvailable, setBrokerAvailable] = useState(false);
  const nextId = useRef(1);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  // Add log entry
  const addLog = useCallback((type: LogEntryType, message: string) => {
    const id = nextId.current++;
    const ts = new Date().toISOString().slice(11, 23);
    setLogs((prev) => [...prev.slice(-999), { id, ts, type, message }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (activeTab === 'activity') {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Check broker availability
  useEffect(() => {
    const check = () => {
      const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
      if (broker?.addIntentListener) {
        setBrokerAvailable(true);
        return true;
      }
      return false;
    };

    // Try immediately and retry up to 10 times (5s)
    if (!check()) {
      const interval = setInterval(() => {
        if (check() || nextId.current > 20) {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // Wrap broker methods for event interception
  useEffect(() => {
    if (!brokerAvailable) return;

    const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
    if (!broker) return;

    const origRaiseIntent = broker.raiseIntent.bind(broker);
    const origBroadcast = broker.broadcast.bind(broker);
    const origAddIntentListener = broker.addIntentListener.bind(broker);

    // Wrap raiseIntent
    broker.raiseIntent = async function interceptedRaiseIntent(
      intent: string,
      context: any,
      target?: any,
      source?: any,
    ) {
      const ctxType = context?.type ?? 'unknown';
      const targetStr = target ? ` → ${typeof target === 'string' ? target : target.appId ?? '?'}` : '';
      addLog('intent_raised', `raiseIntent("${intent}", "${ctxType}"${targetStr})`);
      return origRaiseIntent(intent, context, target, source);
    };

    // Wrap broadcast
    broker.broadcast = async function interceptedBroadcast(context: any, source?: any) {
      const ctxType = context?.type ?? 'unknown';
      addLog('context_broadcast', `broadcast("${ctxType}")`);
      return origBroadcast(context, source);
    };

    // Wrap addIntentListener (to track new registrations)
    broker.addIntentListener = async function interceptedAddIntentListener(
      intent: string,
      handler: any,
      source?: any,
    ) {
      addLog('listener_registered', `Listener: "${intent}"`);
      return origAddIntentListener(intent, handler, source);
    };

    // Restore originals on unmount
    return () => {
      broker.raiseIntent = origRaiseIntent;
      broker.broadcast = origBroadcast;
      broker.addIntentListener = origAddIntentListener;
    };
  }, [brokerAvailable, addLog]);

  // Context listener for the debugger to see all broadcasts
  useEffect(() => {
    if (!brokerAvailable) return;

    let unsub: () => void;

    (async () => {
      try {
        const listener = await fdc3.addContextListener(null, (context: any) => {
          const ctxType = context?.type ?? 'unknown';
          addLog('context_received', `Received: "${ctxType}"`);
        });
        unsub = () => { listener.unsubscribe(); };
      } catch {
        // FDC3 agent not scoped – fall back to the raw broker
        try {
          const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
          if (broker?.addContextListener) {
            const listener = await broker.addContextListener(null, (context: any) => {
              const ctxType = context?.type ?? 'unknown';
              addLog('context_received', `Received: "${ctxType}"`);
            });
            unsub = () => { listener.unsubscribe(); };
          }
        } catch {
          // silent
        }
      }
    })();

    return () => { unsub?.(); };
  }, [brokerAvailable, fdc3, addLog]);

  // Broker state (listeners, channels)
  const { listenerCounts, channels, currentChannelId } = useBrokerInterceptor(addLog, brokerAvailable);

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    nextId.current = 1;
    addLog('info', 'Activity log cleared');
  };

  // Derive AppIdentifier as a plain object for display
  const appIdForDisplay: Record<string, unknown> | null = appIdentity
    ? Object.fromEntries(
        Object.entries(appIdentity as Record<string, unknown>).filter(
          ([, v]) => v !== undefined,
        ),
      )
    : null;

  return (
    <div style={S.container}>
      {/* Header with tabs */}
      <div style={S.header}>
        <div style={S.title}>
          <span style={S.titleIcon}>{'■'}</span>
          FDC3 Console
        </div>
        <div style={S.tabs}>
          {(['activity', 'listeners', 'actions'] as TabId[]).map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...S.tabBase,
                ...(activeTab === tab ? S.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'activity' && <ActivityTab logs={logs} logEndRef={logEndRef} />}
      {activeTab === 'listeners' && (
        <ListenersTab
          listenerCounts={listenerCounts}
          channels={channels}
          currentChannelId={currentChannelId}
          appIdentity={appIdForDisplay}
        />
      )}
      {activeTab === 'actions' && <ActionsTab fdc3={fdc3} addLog={addLog} />}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <button type="button" style={{ ...S.btn, ...S.btnDanger }} onClick={clearLogs}>
          Clear
        </button>
        <span style={{ color: '#808080', fontSize: '11px' }}>
          {logs.length} event{logs.length !== 1 ? 's' : ''}
          {brokerAvailable ? '' : ' — connecting to broker...'}
        </span>
      </div>
    </div>
  );
};

export default FDC3ConsoleTile;
