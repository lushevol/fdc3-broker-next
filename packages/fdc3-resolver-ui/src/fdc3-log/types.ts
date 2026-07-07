/**
 * FDC3 Log Types
 *
 * Type definitions for the FDC3 logging system used across the entire
 * micro-frontend platform — broker, base, tiles, and external sources.
 */

/**
 * Structured log entry for FDC3 operations
 */
export interface FDC3LogEntry {
  /** Monotonically increasing entry ID */
  id: number;
  /** Unix timestamp (ms) when the event occurred */
  timestamp: number;
  /** Formatted time string (HH:mm:ss.SSS) */
  ts: string;
  /** Severity level */
  level: 'debug' | 'info' | 'warn' | 'error' | 'security' | 'perf';
  /** Event category for grouping/filtering */
  category: 'lifecycle' | 'intent' | 'context' | 'channel' | 'bridge' | 'entitlement' | 'general' | 'perf';
  /** Human-readable event description */
  message: string;
  /** Arbitrary structured data associated with the event */
  data?: unknown;
  /** Source of the log entry */
  source: 'broker' | 'base' | 'tile' | 'external' | 'console' | 'perf';
  /**
   * Tile identity — which tile/application this event relates to.
   * Populated when the broker logger includes app/instance ID in the event data,
   * or when explicitly provided via pushFDC3Log().
   */
  tileId?: string;
  tileName?: string;
}

/** Callback type for real-time log subscriptions */
export type LogEntryCallback = (entry: FDC3LogEntry) => void;

/** Mapped tile identity from the broker's tile registry */
export interface TileIdentity {
  instanceId: string;
  appId: string;
  name?: string;
  title?: string;
}

/**
 * Category display constants
 */
export const LOG_CATEGORY_ICONS: Record<string, string> = {
  lifecycle: '⚙',
  intent: '▲',
  context: '→',
  channel: '◉',
  bridge: '⇄',
  entitlement: '🔒',
  general: 'ℹ',
  perf: '⏱',
};

export const LOG_LEVEL_COLORS: Record<string, string> = {
  debug: '#808080',
  info: '#569cd6',
  warn: '#dcdcaa',
  error: '#f44747',
  security: '#f44747',
  perf: '#6a9955',
};
