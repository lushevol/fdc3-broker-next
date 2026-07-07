/**
 * Structured Logger for FDC3 Broker
 *
 * Provides consistent logging with configurable log levels and debug mode.
 * Security events are always logged regardless of log level for audit trail.
 * Supports event-based subscriptions for real-time log streaming.
 *
 * @see research.md#L790-L833
 */

/**
 * Log levels in order of verbosity
 */
export enum LogLevel {
  /** Detailed debugging information */
  DEBUG = 0,
  /** General informational messages */
  INFO = 1,
  /** Warning messages for potentially harmful situations */
  WARN = 2,
  /** Error messages for critical issues */
  ERROR = 3,
  /** Security events that must always be logged */
  SECURITY = 4,
}

/**
 * A structured log event emitted by the Logger.
 * Used for streaming logs to external consumers (e.g., FDC3 Console widget).
 */
export interface LogEvent {
  /** Log severity level */
  level: LogLevel;
  /** Human-readable event description */
  message: string;
  /** Optional structured data associated with the event */
  data?: unknown;
  /** Unix timestamp (ms) when the event was emitted */
  timestamp: number;
  /** Category name for grouping related events */
  category?: string;
}

/**
 * Callback type for log event subscriptions
 */
export type LogEventCallback = (event: LogEvent) => void;

/**
 * Structured logger class with event subscription support
 */
export class Logger {
  private level: LogLevel;
  private enabled: boolean;
  private subscribers = new Set<LogEventCallback>();

  /**
   * Creates a new Logger instance
   *
   * @param enabled - Whether logging is enabled
   * @param level - Minimum log level to output
   */
  constructor(enabled: boolean = false, level: LogLevel = LogLevel.INFO) {
    this.enabled = enabled;
    this.level = level;
  }

  /**
   * Subscribes to all log events emitted by this logger.
   * Returns an unsubscribe function.
   *
   * @param callback - Function called for each log event
   * @returns Unsubscribe function to remove the listener
   *
   * @example
   * ```typescript
   * const unsub = logger.subscribe((event) => {
   *   console.log(`[${event.level}] ${event.message}`, event.data);
   * });
   * // Later: unsub();
   * ```
   */
  subscribe(callback: LogEventCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Internal: emit a log event to all subscribers
   */
  private emit(level: LogLevel, message: string, data?: unknown, category?: string): void {
    const event: LogEvent = {
      level,
      message,
      data,
      timestamp: Date.now(),
      category,
    };
    this.subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch {
        // Silently ignore subscriber errors — never let a logger crash the app
      }
    });
  }

  /**
   * Logs a debug message
   *
   * @param event - Description of the event
   * @param data - Optional data to log
   *
   * @example
   * ```typescript
   * logger.debug('Intent received', { intent: 'ViewChart', context });
   * ```
   */
  debug(event: string, data?: unknown, category?: string): void {
    if (this.enabled && this.level <= LogLevel.DEBUG) {
      console.debug(`[FDC3:DEBUG] ${event}`, data ?? '');
      this.emit(LogLevel.DEBUG, event, data, category);
    }
  }

  /**
   * Logs an informational message
   *
   * @param event - Description of the event
   * @param data - Optional data to log
   */
  info(event: string, data?: unknown, category?: string): void {
    if (this.enabled && this.level <= LogLevel.INFO) {
      console.info(`[FDC3:INFO] ${event}`, data ?? '');
      this.emit(LogLevel.INFO, event, data, category);
    }
  }

  /**
   * Logs a warning message
   *
   * @param event - Description of the warning
   * @param data - Optional data to log
   */
  warn(event: string, data?: unknown, category?: string): void {
    if (this.enabled && this.level <= LogLevel.WARN) {
      console.warn(`[FDC3:WARN] ${event}`, data ?? '');
      this.emit(LogLevel.WARN, event, data, category);
    }
  }

  /**
   * Logs an error message
   *
   * @param event - Description of the error
   * @param error - Optional Error object
   * @param data - Optional additional data
   */
  error(event: string, error?: Error, data?: unknown, category?: string): void {
    if (this.enabled && this.level <= LogLevel.ERROR) {
      console.error(`[FDC3:ERROR] ${event}`, error ?? '', data ?? '');
      this.emit(LogLevel.ERROR, event, { error: error?.message, data }, category);
    }
  }

  /**
   * Logs a security event
   *
   * Security events are always logged regardless of log level for audit trail.
   *
   * @param event - Description of the security event
   * @param data - Optional data to log
   */
  security(event: string, data?: unknown, category?: string): void {
    // Security events are always logged for audit trail
    console.warn(`[FDC3:SECURITY] ${event}`, data ?? '');
    this.emit(LogLevel.SECURITY, event, data, category);
  }

  /**
   * Sets the minimum log level
   *
   * @param level - Minimum log level to output
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enables or disables logging
   *
   * @param enabled - Whether to enable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Returns the number of active subscribers
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }
}
