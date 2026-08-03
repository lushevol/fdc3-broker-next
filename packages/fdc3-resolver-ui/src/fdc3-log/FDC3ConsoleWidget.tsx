/**
 * Floating FDC3 Console Widget
 *
 * An always-available floating debug console for monitoring FDC3 interop
 * across the entire MFE platform. Renders as a small toggle button that
 * expands into a full-featured console overlay.
 *
 * Features:
 * - Real-time FDC3 activity log (from broker, console, and external sources)
 * - Tile-source metadata showing which app/tile originated each event
 * - Intent listener inspector
 * - Manual intent raise / broadcast actions
 * - Filter by level, category, source, and tile
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearFDC3Logs,
  getFDC3LogEntries,
  pushFDC3Log,
  subscribeToFDC3Logs,
} from './fdc3LogService';
import { LOG_CATEGORY_ICONS, LOG_LEVEL_COLORS } from './types';
import type { FDC3LogEntry } from './types';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type TabId = 'activity' | 'listeners' | 'actions';

interface AppChannelInfo {
  id: string;
  displayName: string;
  type: string;
}

interface ListenerCount {
  intent: string;
  count: number;
}

interface BrokerInspector {
  intentListeners?: unknown;
  getUserChannels?: () => Promise<unknown>;
  getCurrentChannel?: () => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getBrokerInspector(): BrokerInspector | null {
  const globalState = (globalThis as Record<string, unknown>).__RATAN_FDC3__;
  if (!isRecord(globalState) || !isRecord(globalState.brokerInstance)) {
    return null;
  }

  const broker = globalState.brokerInstance;
  return {
    intentListeners: broker.intentListeners,
    getUserChannels:
      typeof broker.getUserChannels === 'function'
        ? (broker.getUserChannels as () => Promise<unknown>)
        : undefined,
    getCurrentChannel:
      typeof broker.getCurrentChannel === 'function'
        ? (broker.getCurrentChannel as () => Promise<unknown>)
        : undefined,
  };
}

function toAppChannelInfo(value: unknown): AppChannelInfo | null {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return null;
  }

  return {
    id: value.id,
    displayName: typeof value.displayName === 'string' ? value.displayName : value.id,
    type: typeof value.type === 'string' ? value.type : 'user',
  };
}

function isAppChannelInfo(value: AppChannelInfo | null): value is AppChannelInfo {
  return value !== null;
}

function getChannelId(value: unknown): string | null {
  return isRecord(value) && typeof value.id === 'string' ? value.id : null;
}

/* ------------------------------------------------------------------ */
/*  Styles (dark VS Code terminal theme)                              */
/* ------------------------------------------------------------------ */

const S = {
  toggleBtn: {
    position: 'fixed' as const,
    bottom: '40px',
    right: '16px',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#569cd6',
    color: '#fff',
    border: '2px solid #3c3c3c',
    cursor: 'pointer',
    zIndex: 2147483646,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 700,
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    fontFamily: "'Cascadia Code','Fira Code','Courier New',monospace",
    transition: 'transform .15s,box-shadow .15s',
  },
  toggleBtnActive: {
    transform: 'rotate(45deg)' as const,
    boxShadow: '0 2px 12px rgba(86,156,214,0.6)',
  },
  activityBadge: {
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: '#f44747',
    color: '#fff',
    fontSize: '9px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  container: {
    position: 'fixed' as const,
    right: '16px',
    bottom: '90px',
    width: '480px',
    maxWidth: 'calc(100vw - 32px)',
    height: '520px',
    maxHeight: 'calc(100vh - 120px)',
    fontFamily: "'Cascadia Code','Fira Code','JetBrains Mono','Courier New',monospace",
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontSize: '13px',
    zIndex: 2147483647,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    border: '1px solid #3c3c3c',
    borderRadius: '6px',
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
  titleIcon: { color: '#6a9955', marginRight: '6px' },
  headerBtns: { display: 'flex', gap: '4px' },
  headerBtn: {
    background: 'none',
    border: 'none',
    color: '#969696',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '2px 4px',
    lineHeight: 1,
  },
  tabs: { display: 'flex', gap: 0, flexShrink: 0 },
  tabBase: {
    padding: '6px 14px',
    fontSize: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#252526',
    color: '#969696',
    fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
    transition: 'color .15s,border-color .15s',
    flex: 1,
  },
  tabActive: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    borderBottom: '2px solid #569cd6',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #3c3c3c',
    flexShrink: 0,
    flexWrap: 'wrap' as const,
  },
  filterChip: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    border: '1px solid #3c3c3c',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color .15s',
  },
  filterChipActive: { backgroundColor: '#0e639c', color: '#fff', borderColor: '#0e639c' },
  filterChipInactive: { backgroundColor: 'transparent', color: '#808080' },
  filterInput: {
    flex: 1,
    minWidth: '60px',
    padding: '2px 6px',
    fontSize: '11px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    fontFamily: 'inherit',
    outline: 'none',
  },
  logContainer: { flex: 1, overflow: 'auto', padding: 0 },
  logEntry: {
    padding: '2px 8px',
    fontSize: '11px',
    lineHeight: '18px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
    cursor: 'default',
  },
  logEntryEven: { backgroundColor: '#1e1e1e' },
  logEntryOdd: { backgroundColor: '#252526' },
  logEntryHighlighted: { backgroundColor: '#2d2d2d' },
  logTs: {
    color: '#6a9955',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '10px',
    minWidth: '85px',
  },
  logIcon: { flexShrink: 0, width: '16px', textAlign: 'center', fontSize: '11px' },
  logMsg: { whiteSpace: 'pre-wrap', wordBreak: 'break-all', flex: 1 },
  logMeta: {
    fontSize: '9px',
    color: '#606060',
    flexShrink: 0,
    textAlign: 'right' as const,
    marginLeft: '4px',
  },
  tileTag: {
    flexShrink: 0,
    fontSize: '9px',
    padding: '0 4px',
    borderRadius: '3px',
    backgroundColor: '#2d2d2d',
    color: '#ce9178',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  logDetail: {
    fontSize: '10px',
    color: '#808080',
    padding: '2px 8px 4px 24px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    fontFamily: 'inherit',
    maxHeight: '120px',
    overflow: 'auto',
  },
  emptyLog: {
    padding: '24px 12px',
    color: '#808080',
    fontStyle: 'italic',
    fontSize: '12px',
    textAlign: 'center',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: '#252526',
    borderTop: '1px solid #3c3c3c',
    flexShrink: 0,
  },
  btn: {
    padding: '3px 8px',
    fontSize: '10px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#0e639c',
    color: '#fff',
    fontFamily: 'inherit',
  },
  btnDanger: { backgroundColor: '#a1260d', borderColor: '#5a1d0d' },
  btnSecondary: { backgroundColor: '#3c3c3c', color: '#ccc' },
  btnSuccess: { backgroundColor: '#1b6e3a', borderColor: '#154a28' },
  statusText: { color: '#808080', fontSize: '11px', marginLeft: 'auto' },
  panel: { flex: 1, overflow: 'auto', padding: '8px' },
  sectionTitle: {
    color: '#569cd6',
    fontSize: '12px',
    fontWeight: 600,
    margin: '0 0 6px 0',
    paddingBottom: '4px',
    borderBottom: '1px solid #3c3c3c',
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
  channelItem: { padding: '2px 8px', fontSize: '11px', lineHeight: '18px' },
  channelCurrent: { color: '#4ec9b0' },
  formGroup: { marginBottom: '8px' },
  label: { color: '#969696', fontSize: '10px', display: 'block', marginBottom: '2px' },
  input: {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    fontFamily: 'inherit',
    fontSize: '11px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    minHeight: '60px',
    padding: '4px 8px',
    border: '1px solid #3c3c3c',
    borderRadius: '3px',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    fontFamily: 'inherit',
    fontSize: '10px',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btnRow: { display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' },
  quickActions: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' },
  statusMsg: {
    color: '#6a9955',
    fontSize: '10px',
    marginTop: '6px',
    padding: '4px 6px',
    backgroundColor: '#1a1a1a',
    borderRadius: '3px',
  },
  errorMsg: { color: '#f44747' },
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch((err) => {
    console.warn('Failed to copy to clipboard:', err);
  });
}

function formatLogAsText(entry: FDC3LogEntry): string {
  const detail = entry.data
    ? typeof entry.data === 'string'
      ? entry.data
      : JSON.stringify(entry.data, null, 2)
    : '';
  const tag = entry.tileName ? ` [${entry.tileName}]` : '';
  const tile = entry.tileId ? ` tile:${entry.tileId}` : '';
  return `[${entry.ts}][${entry.level.toUpperCase()}]${tag} ${entry.message} (${entry.source}${tile})${detail ? '\n' + detail : ''}`;
}

/* ------------------------------------------------------------------ */
/*  Quick actions                                                     */
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
    label: 'SearchCashflows',
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

/* ------------------------------------------------------------------ */
/*  Activity Tab                                                      */
/* ------------------------------------------------------------------ */

interface ActivityTabProps {
  logs: FDC3LogEntry[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  logEndRef: React.Ref<HTMLDivElement>;
  levels: string[];
  activeLevels: Set<string>;
  categories: string[];
  activeCategories: Set<string>;
  searchFilter: string;
  onToggleLevel: (lvl: string) => void;
  onToggleCategory: (cat: string) => void;
  onSearchChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
}

function ActivityTab({
  logs, expandedId, onToggleExpand, logEndRef,
  levels, activeLevels, categories, activeCategories,
  searchFilter, onToggleLevel, onToggleCategory, onSearchChange, filteredCount, totalCount,
}: ActivityTabProps) {
  return (
    <>
      <div style={S.filterBar}>
        {levels.map((lvl) => (
          <button key={lvl} type="button" title={`${activeLevels.has(lvl) ? 'Hide' : 'Show'} ${lvl} level`} style={{
            ...S.filterChip,
            ...(activeLevels.has(lvl) ? S.filterChipActive : S.filterChipInactive),
          }} onClick={() => onToggleLevel(lvl)}>
            {lvl.toUpperCase()}
          </button>
        ))}
        <span style={{ color: '#3c3c3c' }}>|</span>
        {categories.map((cat) => (
          <button key={cat} type="button" title={`Filter: ${cat} events`} style={{
            ...S.filterChip,
            ...(activeCategories.has(cat) ? S.filterChipActive : S.filterChipInactive),
          }} onClick={() => onToggleCategory(cat)}>
            {LOG_CATEGORY_ICONS[cat] || '?'}
          </button>
        ))}
        <input type="text" placeholder="search…" style={S.filterInput}
          value={searchFilter} onChange={(e) => onSearchChange(e.target.value)} />
      </div>

      <div style={S.logContainer}>
        {logs.length === 0 ? (
          <div style={S.emptyLog}>
            Waiting for FDC3 activity…<br />
            <span style={{ fontSize: '10px', color: '#606060' }}>
              All FDC3 operations across the platform appear here
            </span>
          </div>
        ) : (
          logs.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const detailText = entry.data
              ? typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data, null, 2)
              : '';
            const showTile = entry.tileId || entry.tileName;

            return (
              <div key={entry.id}>
                <div style={{
                  ...S.logEntry,
                  ...(entry.id % 2 === 0 ? S.logEntryEven : S.logEntryOdd),
                  ...(isExpanded ? S.logEntryHighlighted : {}),
                }} onClick={() => onToggleExpand(entry.id)} title={detailText ? 'Click to expand' : ''}>
                  <span style={S.logTs}>{entry.ts}</span>
                  <span title={`${entry.level} / ${entry.category}`} style={{ ...S.logIcon, color: LOG_LEVEL_COLORS[entry.level] || '#808080' }}>
                    {LOG_CATEGORY_ICONS[entry.category] || '•'}
                  </span>
                  <span style={S.logMsg}>{entry.message}</span>
                  {showTile && (
                    <span style={S.tileTag} title={entry.tileId ? `ID: ${entry.tileId}` : ''}>
                      {entry.tileName || entry.tileId}
                    </span>
                  )}
                  <button type="button" title="Copy this entry"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(formatLogAsText(entry)); }}
                    style={{ background: 'none', border: 'none', color: '#606060', cursor: 'pointer', fontSize: '11px', padding: '0 2px', fontFamily: 'inherit' }}>
                    📋
                  </button>
                  <span title={`Source: ${entry.source}`} style={S.logMeta}>{entry.source}</span>
                </div>
                {isExpanded && detailText && (
                  <div style={S.logDetail}>
                    {detailText.slice(0, 2000)}
                    {detailText.length > 2000 ? '\n… (truncated)' : ''}
                  </div>
                )}
              </div>
            );
          })
        )}
        {filteredCount > 0 && filteredCount < totalCount && (
          <div style={{ padding: '4px 8px', fontSize: '10px', color: '#606060', textAlign: 'center' }}>
            Showing {filteredCount} of {totalCount} entries
          </div>
        )}
        <div ref={logEndRef} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Listeners Tab                                                     */
/* ------------------------------------------------------------------ */

interface ListenersTabProps {
  listeners: ListenerCount[];
  channels: AppChannelInfo[];
  currentChannelId: string | null;
}

function ListenersTab({ listeners, channels, currentChannelId }: ListenersTabProps) {
  return (
    <div style={S.panel}>
      <h3 style={S.sectionTitle}>
        Intent Listeners
        <span title="Total unique intent types" style={S.cntBadge}>{listeners.length}</span>
      </h3>
      {listeners.length === 0 ? (
        <div style={{ color: '#808080', fontSize: '11px', padding: '4px 0' }}>
          No intent listeners registered
        </div>
      ) : (
        [...listeners].sort((a, b) => a.intent.localeCompare(b.intent)).map(({ intent, count }) => (
          <div key={intent}>
            <div style={{ color: '#569cd6', fontSize: '12px', fontWeight: 600, padding: '3px 0' }}>
              {intent}
              <span title="Registered handlers" style={S.cntBadge}>{count}</span>
            </div>
            <div style={{ padding: '1px 8px', fontSize: '10px', color: '#ce9178', lineHeight: '16px' }}>
              {count} handler{count !== 1 ? 's' : ''}
            </div>
          </div>
        ))
      )}

      <h3 style={{ ...S.sectionTitle, marginTop: '16px' }}>
        Channels
        <span title="Total available channels" style={S.cntBadge}>{channels.length}</span>
      </h3>
      {channels.length === 0 ? (
        <div style={{ color: '#808080', fontSize: '11px', padding: '4px 0' }}>
          No channels available
        </div>
      ) : (
        channels.map((ch) => (
          <div key={ch.id} style={{
            ...S.channelItem,
            color: ch.id === currentChannelId ? '#4ec9b0' : '#808080',
          }}>
            {ch.id === currentChannelId ? '◉ ' : '○ '}
            {ch.displayName}
            {ch.id === currentChannelId && (
              <span style={{ color: '#4ec9b0', marginLeft: '4px', fontSize: '10px' }}>(current)</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Actions Tab                                                       */
/* ------------------------------------------------------------------ */

function ActionsTab() {
  const [intent, setIntent] = useState('ViewChart');
  const [contextJson, setContextJson] = useState(() => JSON.stringify(QUICK_ACTIONS[0].context, null, 2));
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const applyQuickAction = (qa: (typeof QUICK_ACTIONS)[number]) => {
    setContextJson(JSON.stringify(qa.context, null, 2));
    if (qa.intent) setIntent(qa.intent);
  };

  const getBroker = () => {
    const r = (globalThis as Record<string, unknown>).__RATAN_FDC3__ as Record<string, unknown> | undefined;
    return r?.brokerInstance as Record<string, unknown> | undefined;
  };

  const handleRaiseIntent = async () => {
    setStatus(''); setIsError(false);
    let parsed: unknown;
    try { parsed = JSON.parse(contextJson); } catch { setStatus('Invalid JSON'); setIsError(true); return; }
    try {
      pushFDC3Log('info', 'intent', `Manual: raiseIntent("${intent}")`, { intent }, 'base');
      const broker = getBroker();
      if (!broker || typeof broker.raiseIntent !== 'function') throw new Error('Broker not available');
      const resolution = await broker.raiseIntent(intent, parsed);
      const appId = resolution?.source?.appId ?? 'unknown';
      setStatus(`Intent "${intent}" → ${appId}`);
      pushFDC3Log('info', 'intent', `Manual: resolved to ${appId}`, { resolution }, 'base');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`); setIsError(true);
      pushFDC3Log('error', 'intent', `Manual: raiseIntent failed: ${msg}`, {}, 'base');
    }
  };

  const handleBroadcast = async () => {
    setStatus(''); setIsError(false);
    let parsed: unknown;
    try { parsed = JSON.parse(contextJson); } catch { setStatus('Invalid JSON'); setIsError(true); return; }
    try {
      pushFDC3Log('info', 'context', 'Manual: broadcast', {}, 'base');
      const broker = getBroker();
      if (!broker || typeof broker.broadcast !== 'function') throw new Error('Broker not available');
      await broker.broadcast(parsed);
      const ctxType = (parsed as Record<string, unknown>)?.type ?? 'unknown';
      setStatus(`Context "${ctxType}" broadcast`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`); setIsError(true);
    }
  };

  return (
    <div style={S.panel}>
      <div style={S.formGroup}>
        <label style={S.label}>Intent Name</label>
        <input style={S.input} value={intent} onChange={(e) => setIntent(e.target.value)} placeholder="e.g. ViewChart" />
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Context (JSON)</label>
        <textarea style={S.textarea} value={contextJson}
          onChange={(e) => setContextJson(e.target.value)}
          placeholder='{ "type": "fdc3.instrument", … }' spellCheck={false} />
      </div>
      <div style={S.btnRow}>
        <button type="button" style={S.btn} onClick={handleRaiseIntent}>Raise Intent</button>
        <button type="button" style={{ ...S.btn, ...S.btnSuccess }} onClick={handleBroadcast}>Broadcast</button>
      </div>
      <div style={{ marginTop: '14px' }}>
        <label style={S.label}>Quick Actions</label>
        <div style={S.quickActions}>
          {QUICK_ACTIONS.map((qa) => (
            <button key={qa.label} type="button" style={{ ...S.btn, ...S.btnSecondary, fontSize: '9px' }}
              onClick={() => applyQuickAction(qa)}>
              {qa.label}
            </button>
          ))}
        </div>
      </div>
      {status && <div style={{ ...S.statusMsg, ...(isError ? S.errorMsg : {}) }}>{isError ? '✖ ' : '✔ '}{status}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Widget Component                                             */
/* ------------------------------------------------------------------ */

export interface FDC3ConsoleWidgetProps {
  /** Initial visibility (default: false) */
  defaultVisible?: boolean;
  /** Max displayed entries (default: 500) */
  maxDisplayed?: number;
}

const FDC3ConsoleWidget: React.FC<FDC3ConsoleWidgetProps> = ({
  defaultVisible = false,
  maxDisplayed = 500,
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [activeTab, setActiveTab] = useState<TabId>('activity');
  const [logs, setLogs] = useState<FDC3LogEntry[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const levelList: string[] = ['debug', 'info', 'warn', 'error', 'security', 'perf'];
  const categoryList: string[] = ['lifecycle', 'intent', 'context', 'channel', 'bridge', 'entitlement', 'general', 'perf'];
  const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set(['info', 'warn', 'error', 'security']));
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(categoryList));
  const [searchFilter, setSearchFilter] = useState('');

  const [listeners, setListeners] = useState<ListenerCount[]>([]);
  const [channels, setChannels] = useState<AppChannelInfo[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);

  const [unseenCount, setUnseenCount] = useState(0);
  const lastSeenLength = useRef(0);

  // Subscribe to log stream
  useEffect(() => {
    const unsub = subscribeToFDC3Logs((entry) => {
      setLogs((prev) => [...prev.slice(-(maxDisplayed - 1)), entry]);
    });
    const existing = getFDC3LogEntries();
    if (existing.length > 0) setLogs(existing.slice(-maxDisplayed));
    return unsub;
  }, [maxDisplayed]);

  // Track unseen count
  useEffect(() => {
    if (!isVisible) setUnseenCount((c) => c + (logs.length - lastSeenLength.current));
    lastSeenLength.current = logs.length;
  }, [logs.length, isVisible]);

  // Poll broker state for listeners/channels.
  // Only runs when the listeners tab is active, at a 10 s interval,
  // to avoid noisy debug-level logging from getUserChannels/getCurrentChannel.
  useEffect(() => {
    if (activeTab !== 'listeners') return;

    const poll = () => {
      const broker = getBrokerInspector();
      if (!broker) return;

      if (broker.intentListeners instanceof Map) {
        const counts: ListenerCount[] = [];
        Array.from(broker.intentListeners.entries()).forEach(([intent, handlers]) => {
          if (Array.isArray(handlers) && handlers.length > 0) counts.push({ intent, count: handlers.length });
        });
        setListeners(counts);
      }
      if (broker.getUserChannels) {
        void broker.getUserChannels().then((channels) => {
          setChannels(
            Array.isArray(channels)
              ? channels.map(toAppChannelInfo).filter(isAppChannelInfo)
              : [],
          );
        }).catch(() => {});
      }
      if (broker.getCurrentChannel) {
        void broker.getCurrentChannel().then((channel) => {
          setCurrentChannelId(getChannelId(channel));
        }).catch(() => {});
      }
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Auto-scroll
  useEffect(() => {
    if (activeTab === 'activity') logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeTab]);

  const handleClear = useCallback(() => {
    clearFDC3Logs();
    setLogs([]);
    setExpandedId(null);
    pushFDC3Log('info', 'lifecycle', 'Activity log cleared', undefined, 'base');
  }, []);

  const toggleLevel = (level: string) =>
    setActiveLevels((current) => {
      const next = new Set(current);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  const toggleCategory = (category: string) =>
    setActiveCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });

  const filteredLogs = logs.filter((e) =>
    activeLevels.has(e.level) && activeCategories.has(e.category) &&
    (!searchFilter || e.message.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleCopyAll = useCallback(() => {
    const text = filteredLogs.map((e: FDC3LogEntry) => formatLogAsText(e)).join('\n---\n');
    copyToClipboard(text);
  }, [filteredLogs.length]);

  return (
    <>
      <button type="button" style={{ ...S.toggleBtn, ...(isVisible ? S.toggleBtnActive : {}) }}
        onClick={() => { setIsVisible(!isVisible); if (isVisible) setUnseenCount(0); }}
        title={isVisible ? 'Close FDC3 Console' : 'Open FDC3 Console'}>
        <span title="FDC3 Console">◈</span>
        {!isVisible && unseenCount > 0 && <span title="Unseen events" style={S.activityBadge}>{unseenCount > 99 ? '99+' : unseenCount}</span>}
      </button>

      {isVisible && (
        <div style={S.container}>
          <div style={S.header}>
            <div style={S.title}>
              <span style={S.titleIcon} title="FDC3 Console Debugger">■</span>
              FDC3 Console
            </div>
            <div style={S.headerBtns}>
              <button type="button" style={S.headerBtn} onClick={() => setIsVisible(false)} title="Minimize">_</button>
            </div>
          </div>

          <div style={S.tabs}>
            {(['activity', 'listeners', 'actions'] as TabId[]).map((tab) => (
              <button key={tab} type="button" style={{ ...S.tabBase, ...(activeTab === tab ? S.tabActive : {}) }}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'listeners' && listeners.length > 0 && <span title="Active intent types" style={S.cntBadge}>{listeners.length}</span>}
              </button>
            ))}
          </div>

          {activeTab === 'activity' && (
            <ActivityTab logs={filteredLogs} expandedId={expandedId}
              onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
              logEndRef={logEndRef} levels={levelList} activeLevels={activeLevels}
              categories={categoryList} activeCategories={activeCategories} searchFilter={searchFilter}
              onToggleLevel={toggleLevel} onToggleCategory={toggleCategory}
              onSearchChange={setSearchFilter} filteredCount={filteredLogs.length} totalCount={logs.length} />
          )}
          {activeTab === 'listeners' && <ListenersTab listeners={listeners} channels={channels} currentChannelId={currentChannelId} />}
          {activeTab === 'actions' && <ActionsTab />}

          <div style={S.toolbar}>
            <button type="button" style={{ ...S.btn, ...S.btnDanger }} onClick={handleClear}>Clear</button>
            <button type="button" style={S.btn} onClick={handleCopyAll}>Copy All</button>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setIsVisible(false)}>Close</button>
            <span style={S.statusText}>{logs.length} event{logs.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default FDC3ConsoleWidget;
