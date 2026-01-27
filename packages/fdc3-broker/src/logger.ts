/**
 * Structured Logger for FDC3 Broker
 *
 * Provides consistent logging with configurable log levels and debug mode.
 * Security events are always logged regardless of log level for audit trail.
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
 * Structured logger class
 */
export class Logger {
  private level: LogLevel;
  private enabled: boolean;

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
  debug(event: string, data?: unknown): void {
    if (this.enabled && this.level <= LogLevel.DEBUG) {
      console.debug(`[FDC3:DEBUG] ${event}`, data ?? '');
    }
  }

  /**
   * Logs an informational message
   *
   * @param event - Description of the event
   * @param data - Optional data to log
   */
  info(event: string, data?: unknown): void {
    if (this.enabled && this.level <= LogLevel.INFO) {
      console.info(`[FDC3:INFO] ${event}`, data ?? '');
    }
  }

  /**
   * Logs a warning message
   *
   * @param event - Description of the warning
   * @param data - Optional data to log
   */
  warn(event: string, data?: unknown): void {
    if (this.enabled && this.level <= LogLevel.WARN) {
      console.warn(`[FDC3:WARN] ${event}`, data ?? '');
    }
  }

  /**
   * Logs an error message
   *
   * @param event - Description of the error
   * @param error - Optional Error object
   * @param data - Optional additional data
   */
  error(event: string, error?: Error, data?: unknown): void {
    if (this.enabled && this.level <= LogLevel.ERROR) {
      console.error(`[FDC3:ERROR] ${event}`, error ?? '', data ?? '');
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
  security(event: string, data?: unknown): void {
    // Security events are always logged for audit trail
    console.warn(`[FDC3:SECURITY] ${event}`, data ?? '');
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
}
