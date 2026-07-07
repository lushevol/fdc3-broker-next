/**
 * FDC3 Log Service
 *
 * Centralized log aggregator that captures FDC3 activity from all sources:
 * - Broker logger events (via subscribeToLogs)
 * - Console FDC3-prefixed messages (via console interception)
 * - External tiles (via global API and pushFDC3Log)
 *
 * Enriches log entries with tile identity metadata by polling the broker's
 * tile registry, so every operation can be traced back to its originating
 * application or tile.
 *
 * Exports a singleton service that the floating FDC3 Console widget consumes.
 */

import type { FDC3LogEntry, LogEntryCallback, TileIdentity } from './types';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const MAX_LOG_ENTRIES = 2000;

/* ------------------------------------------------------------------ */
/*  Service State (singleton)                                         */
/* ------------------------------------------------------------------ */

let nextId = 1;
let logEntries: FDC3LogEntry[] = [];
const subscribers = new Set<LogEntryCallback>();
let initialized = false;

// Timer handles for lifecycle cleanup
let checkTimerId: ReturnType<typeof setInterval> | null = null;
let timeoutTimerId: ReturnType<typeof setTimeout> | null = null;

// Original console methods for restore on destroy
const originalConsole: Partial<Record<
  'debug' | 'info' | 'warn' | 'error' | 'log',
  (...args: unknown[]) => void
>> = {};

// Broker subscription handle for cleanup
const brokerUnsubs: Array<() => void> = [];

// Tile identity cache — maps instanceId → TileIdentity
let tileCache: Map<string, TileIdentity> = new Map();
let tilePollTimer: ReturnType<typeof setInterval> | null = null;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatTimestamp(ts: number): string {
  return new Date(ts).toISOString().slice(11, 23);
}

/**
 * Try to extract tile identity from broker log event data.
 * The broker's Logger often includes { appId, instanceId, ... } in the data payload.
 */
function extractTileFromData(data: unknown): { tileId?: string; tileName?: string } | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  const instanceId = (d.instanceId as string) || (d.instanceId as string);
  const appId = (d.appId as string) || (d.appId as string);

  if (instanceId && tileCache.has(instanceId)) {
    const cached = tileCache.get(instanceId)!;
    return { tileId: instanceId, tileName: cached.name || cached.appId };
  }

  if (appId && !instanceId) {
    // Try to find in cache by appId
    for (const [, t] of tileCache) {
      if (t.appId === appId) {
        return { tileId: t.instanceId, tileName: t.name || t.appId };
      }
    }
    return { tileId: appId, tileName: appId };
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Tile Registry Poller                                              */
/* ------------------------------------------------------------------ */

/**
 * Polls the broker's tile registry to build a tile identity lookup table.
 * This allows log entries to be enriched with tile name and metadata.
 */
function pollTileRegistry(): void {
  const ratanFdc3 = (globalThis as Record<string, unknown>).__RATAN_FDC3__ as
    | Record<string, unknown>
    | undefined;
  const broker = ratanFdc3?.brokerInstance as Record<string, unknown> | undefined;
  if (!broker) return;

  // Access tileRegistry — broker stores TileRegistryImpl at this.tileRegistry
  const registry = broker.tileRegistry as
    | { getAllTiles?: () => Array<Record<string, unknown>> }
    | undefined;
  if (!registry?.getAllTiles) return;

  try {
    const tiles = registry.getAllTiles();
    const newCache = new Map<string, TileIdentity>();

    for (const tile of tiles) {
      const instanceId = tile.instanceId as string;
      const appId = tile.appId as string;
      const metadata = tile.metadata as Record<string, unknown> | undefined;
      const name = (metadata?.name as string) || appId;
      const title = metadata?.title as string | undefined;

      if (instanceId && appId) {
        newCache.set(instanceId, { instanceId, appId, name, title });
      }
    }

    tileCache = newCache;
  } catch {
    // Silently ignore poll errors — registry might not be ready
  }
}

/**
 * Enrich a log entry with tile metadata from the tile cache
 */
function enrichWithTileInfo(entry: FDC3LogEntry): FDC3LogEntry {
  if (!entry.data) return entry;

  const tileInfo = extractTileFromData(entry.data);
  if (tileInfo) {
    entry.tileId = tileInfo.tileId || entry.tileId;
    entry.tileName = tileInfo.tileName || entry.tileName;
  }

  return entry;
}

/* ------------------------------------------------------------------ */
/*  Internal log emitter                                              */
/* ------------------------------------------------------------------ */

function addLog(
  level: FDC3LogEntry['level'],
  category: FDC3LogEntry['category'],
  message: string,
  data?: unknown,
  source: FDC3LogEntry['source'] = 'console',
  tileId?: string,
  tileName?: string,
): FDC3LogEntry {
  const id = nextId++;
  const timestamp = Date.now();
  const entry: FDC3LogEntry = {
    id,
    timestamp,
    ts: formatTimestamp(timestamp),
    level,
    category,
    message,
    data,
    source,
    tileId,
    tileName,
  };

  // Try to enrich with tile info from the tile cache
  enrichWithTileInfo(entry);

  // Sync to browser console so all FDC3 log API entries are visible
  // in the developer tools regardless of their source.
  const tag = entry.tileName ? ` [${entry.tileName}]` : '';
  switch (level) {
    case 'error':
      console.error(`[FDC3-API:ERROR]${tag} ${message}`, data ?? '');
      break;
    case 'warn':
      console.warn(`[FDC3-API:WARN]${tag} ${message}`, data ?? '');
      break;
    case 'debug':
      console.debug(`[FDC3-API:DEBUG]${tag} ${message}`, data ?? '');
      break;
    default:
      console.info(`[FDC3-API:${level.toUpperCase()}]${tag} ${message}`, data ?? '');
  }

  logEntries.push(entry);

  // Trim ring buffer
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries = logEntries.slice(-MAX_LOG_ENTRIES);
  }

  // Notify subscribers synchronously
  subscribers.forEach((cb) => {
    try {
      cb(entry);
    } catch {
      // Never let a subscriber crash the service
    }
  });

  return entry;
}

/* ------------------------------------------------------------------ */
/*  Console Interception                                              */
/* ------------------------------------------------------------------ */

function patchConsole(): void {
  if (typeof console === 'undefined') return;

  const FDC3_PREFIX_RE = /^\[FDC3:(DEBUG|INFO|WARN|ERROR|SECURITY|Perf)\]\s*(.*)/;
  const FMPTP_FDC3_RE = /^\[FMPTP FDC3\]\s*(.*)/;
  const CASHFLOW_FDC3_RE = /^\[Cashflow[^\]]*\]\s*(.*)/;
  const INTENTQUEUE_RE = /^\[IntentQueue\]\s*(.*)/;

  const methods: Array<'debug' | 'info' | 'warn' | 'error' | 'log'> = [
    'debug', 'info', 'warn', 'error', 'log',
  ];

  for (const method of methods) {
    originalConsole[method] = console[method].bind(console);

    console[method] = function (...args: unknown[]) {
      // Call original first — never break console
      originalConsole[method]?.(...args);

      const firstArg = typeof args[0] === 'string' ? args[0] : '';
      if (!firstArg) return;

      // [FDC3:LEVEL] pattern (from broker Logger)
      let match = firstArg.match(FDC3_PREFIX_RE);
      if (match) {
        let level: FDC3LogEntry['level'];
        switch (match[1]) {
          case 'DEBUG': level = 'debug'; break;
          case 'INFO': level = 'info'; break;
          case 'WARN': level = 'warn'; break;
          case 'ERROR': level = 'error'; break;
          case 'SECURITY': level = 'security'; break;
          case 'Perf': level = 'perf'; break;
          default: level = 'info';
        }
        addLog(level, level === 'perf' ? 'perf' : 'general', match[2], args[1], 'console');
        return;
      }

      // [FMPTP FDC3] pattern (legacy base broker)
      match = firstArg.match(FMPTP_FDC3_RE);
      if (match) {
        addLog('info', 'general', match[1], args[1], 'base');
        return;
      }

      // [Cashflow*] pattern (cashflow tiles)
      match = firstArg.match(CASHFLOW_FDC3_RE);
      if (match) {
        addLog('info', 'intent', `[Cashflow] ${match[1]}`, args[1], 'tile');
        return;
      }

      // [IntentQueue] pattern
      match = firstArg.match(INTENTQUEUE_RE);
      if (match) {
        addLog('info', 'lifecycle', `[Queue] ${match[1]}`, args[1], 'broker');
        return;
      }
    } as typeof console.log;
  }
}

function unpatchedConsole(): void {
  for (const method of Object.keys(originalConsole) as Array<'debug' | 'info' | 'warn' | 'error' | 'log'>) {
    if (originalConsole[method]) {
      console[method] = originalConsole[method]!;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Broker Logger Subscription                                        */
/* ------------------------------------------------------------------ */

function patchBrokerInstance(): void {
  const ratanFdc3 = (globalThis as Record<string, unknown>).__RATAN_FDC3__ as
    | Record<string, unknown>
    | undefined;
  const broker = ratanFdc3?.brokerInstance as Record<string, unknown> | undefined;
  if (!broker) return;

  // Subscribe to the broker's logger for structured log events
  if (typeof broker.subscribeToLogs === 'function') {
    const unsub = (broker.subscribeToLogs as (cb: (event: unknown) => void) => () => void)(
      (event: any) => {
        let level: FDC3LogEntry['level'];
        switch (event.level) {
          case 0: level = 'debug'; break;
          case 1: level = 'info'; break;
          case 2: level = 'warn'; break;
          case 3: level = 'error'; break;
          case 4: level = 'security'; break;
          default: level = 'info';
        }
        addLog(
          level,
          (event.category as FDC3LogEntry['category']) || 'general',
          event.message,
          event.data,
          'broker',
        );
      },
    );
    brokerUnsubs.push(unsub);
  }

  // Start tile registry polling (every 3 seconds) for metadata enrichment
  pollTileRegistry();
  tilePollTimer = setInterval(pollTileRegistry, 3000);
}

function unpatchedBrokerInstance(): void {
  brokerUnsubs.forEach((fn) => fn());
  brokerUnsubs.length = 0;
  if (tilePollTimer !== null) {
    clearInterval(tilePollTimer);
    tilePollTimer = null;
  }
}

/* ------------------------------------------------------------------ */
/*  Global External Log API                                           */
/* ------------------------------------------------------------------ */

function setupGlobalLogAPI(): void {
  const globalThisAny = globalThis as Record<string, unknown>;

  const logAPI = {
    /** Current log entries buffer (direct reference — for debugging) */
    entries: logEntries,

    /** Push a log entry from an external source */
    log: (entry: {
      level: FDC3LogEntry['level'];
      category: string;
      message: string;
      data?: unknown;
      source?: string;
      tileId?: string;
      tileName?: string;
    }) => {
      addLog(
        entry.level,
        entry.category as FDC3LogEntry['category'],
        entry.message,
        entry.data,
        (entry.source as FDC3LogEntry['source']) || 'tile',
        entry.tileId,
        entry.tileName,
      );
    },

    /** Subscribe to real-time log events */
    subscribe: (callback: LogEntryCallback): (() => void) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    /** Get all current log entries (copy) */
    getEntries: (): FDC3LogEntry[] => [...logEntries],

    /** Clear all log entries */
    clear: () => {
      logEntries = [];
      nextId = 1;
    },
  };

  globalThisAny.__RATAN_FDC3_LOGS__ = logAPI;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Initializes the FDC3 Log Service.
 * Safe to call multiple times — only the first call activates.
 *
 * Sets up:
 * - Console interception for FDC3-prefixed messages
 * - Broker log subscription for structured events
 * - Tile registry polling for metadata enrichment
 * - Global __RATAN_FDC3_LOGS__ API for external tiles
 */
export function initFDC3LogService(): void {
  if (initialized) return;
  initialized = true;

  addLog('info', 'lifecycle', 'FDC3 Log Service initializing...', undefined, 'base');

  patchConsole();
  addLog('info', 'lifecycle', 'Console FDC3 interception active', undefined, 'base');

  setupGlobalLogAPI();
  addLog('info', 'lifecycle', 'Global __RATAN_FDC3_LOGS__ API ready', undefined, 'base');

  // Try to attach to broker immediately
  patchBrokerInstance();
  addLog('info', 'lifecycle', 'Broker log subscription active', undefined, 'base');

  // Poll for broker if not yet available (e.g., broker initializes later)
  checkTimerId = setInterval(() => {
    const ratanFdc3 = (globalThis as Record<string, unknown>).__RATAN_FDC3__ as
      | Record<string, unknown>
      | undefined;
    if (ratanFdc3?.brokerInstance && brokerUnsubs.length === 0) {
      patchBrokerInstance();
      addLog('info', 'lifecycle', 'Broker subscribed (late attach)', undefined, 'base');
      if (checkTimerId !== null) {
        clearInterval(checkTimerId);
        checkTimerId = null;
      }
    }
  }, 500);

  // Safety timeout — stop polling after 30 s
  timeoutTimerId = setTimeout(() => {
    if (checkTimerId !== null) {
      clearInterval(checkTimerId);
      checkTimerId = null;
    }
  }, 30000);

  addLog('info', 'lifecycle', 'FDC3 Log Service initialized', undefined, 'base');
}

/**
 * Tears down the FDC3 Log Service and restores original functions.
 */
export function destroyFDC3LogService(): void {
  unpatchedConsole();
  unpatchedBrokerInstance();

  if (checkTimerId !== null) {
    clearInterval(checkTimerId);
    checkTimerId = null;
  }
  if (timeoutTimerId !== null) {
    clearTimeout(timeoutTimerId);
    timeoutTimerId = null;
  }

  logEntries = [];
  subscribers.clear();
  nextId = 1;
  initialized = false;

  delete (globalThis as Record<string, unknown>).__RATAN_FDC3_LOGS__;
}

/**
 * Subscribes to FDC3 log entries in real time.
 *
 * @param callback - Called synchronously for each new log entry
 * @returns Unsubscribe function
 *
 * @example
 * ```ts
 * const unsub = subscribeToFDC3Logs((entry) =>
 *   console.log(`[${entry.level}] ${entry.message}`)
 * );
 * // later: unsub();
 * ```
 */
export function subscribeToFDC3Logs(callback: LogEntryCallback): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Returns a copy of all buffered log entries.
 */
export function getFDC3LogEntries(): FDC3LogEntry[] {
  return [...logEntries];
}

/**
 * Clears all buffered log entries.
 */
export function clearFDC3Logs(): void {
  logEntries = [];
  nextId = 1;
}

/**
 * Push a log entry from any source.
 * Use this from tiles or external code to contribute their FDC3 events.
 *
 * @param level    - Severity level
 * @param category - Event category
 * @param message  - Log message
 * @param data     - Optional structured data
 * @param source   - Source identifier
 * @param tileId   - Optional originating tile/app instance ID
 * @param tileName - Optional originating tile/app display name
 *
 * @example
 * ```ts
 * // From a tile that knows its identity:
 * pushFDC3Log('info', 'intent', 'SearchCashflows raised', { ... }, 'tile', instanceId, 'Cashflow Blotter');
 * ```
 */
export function pushFDC3Log(
  level: FDC3LogEntry['level'],
  category: FDC3LogEntry['category'],
  message: string,
  data?: unknown,
  source: FDC3LogEntry['source'] = 'tile',
  tileId?: string,
  tileName?: string,
): void {
  addLog(level, category, message, data, source, tileId, tileName);
}
