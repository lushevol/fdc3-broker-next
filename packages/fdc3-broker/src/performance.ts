/**
 * Performance Tracking Utilities
 *
 * Tracks operation performance and logs warnings for slow operations.
 * Provides automatic tracking of async function execution time.
 *
 * @see research.md#L838-L863
 */

/**
 * Performance tracker class
 *
 * Tracks execution time of operations and logs warnings for slow operations (>100ms).
 * Supports both manual start/end tracking and automatic async function measurement.
 * Emits performance events that can be subscribed to via the broker logger.
 */
export interface PerformanceAttributes {
  /** The tile that initiated the FDC3 operation. */
  sourceAppId?: string;
  sourceInstanceId?: string;
  /** The requested target, if one was supplied by the caller. */
  targetAppId?: string;
  targetInstanceId?: string;
  /** Safe FDC3 metadata. Never attach the full context payload here. */
  intent?: string;
  contextType?: string;
  channelId?: string;
}

export interface PerformanceMetric {
  id: string;
  operation: string;
  duration: number;
  timestamp: number;
  outcome: 'success' | 'error';
  attributes?: PerformanceAttributes;
}

type ActiveMark = {
  operation: string;
  startedAt: number;
  attributes?: PerformanceAttributes;
};

/**
 * The names below are deliberately stable so Chrome DevTools' Performance panel
 * can filter an FDC3 transaction without needing the application's log console.
 */
const USER_TIMING_PREFIX = 'fdc3';

export class PerformanceTracker {
  private marks = new Map<string, ActiveMark>();
  private perfLogs: PerformanceMetric[] = [];
  private subscribers = new Set<(metric: PerformanceMetric) => void>();
  private nextId = 0;

  /**
   * Subscribes to performance completions
   *
   * @param callback - Called with the completed, attributed metric
   * @returns Unsubscribe function
   */
  subscribe(callback: (metric: PerformanceMetric) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Starts tracking an operation
   *
   * @param operation - Name of the operation to track
   *
   * @example
   * ```typescript
   * tracker.start('myOperation');
   * // ... do work ...
   * const duration = tracker.end('myOperation');
   * ```
   */
  start(operation: string, attributes?: PerformanceAttributes): string {
    const id = `${operation}:${++this.nextId}`;
    const markName = this.getMarkName(id);
    const startedAt = performance.now();

    this.marks.set(id, { operation, startedAt, attributes });
    performance.mark?.(markName);
    return id;
  }

  /**
   * Ends tracking an operation and returns the duration
   *
   * @param operation - Name of the operation to end
   * @returns Duration in milliseconds
   *
   * @example
   * ```typescript
   * tracker.start('myOperation');
   * // ... do work ...
   * const duration = tracker.end('myOperation'); // returns e.g., 45.2
   * ```
   */
  end(operationOrId: string, outcome: PerformanceMetric['outcome'] = 'success'): number {
    const id = this.marks.has(operationOrId)
      ? operationOrId
      : [...this.marks.keys()].find((markId) => this.marks.get(markId)?.operation === operationOrId);
    const mark = id ? this.marks.get(id) : undefined;
    if (!id || !mark) {
      console.warn(`[FDC3:Perf] No start mark found for operation: ${operationOrId}`);
      return 0;
    }

    const duration = performance.now() - mark.startedAt;
    this.marks.delete(id);

    const metric: PerformanceMetric = {
      id,
      operation: mark.operation,
      duration,
      timestamp: Date.now(),
      outcome,
      attributes: mark.attributes,
    };
    const measureName = this.getMeasureName(id, outcome);
    this.recordUserTiming(id, measureName);

    // Store perf log
    this.perfLogs.push(metric);
    if (this.perfLogs.length > 100) {
      this.perfLogs.shift();
    }

    // Log if operation took too long (>100ms)
    if (duration > 100) {
      console.warn(`[FDC3:Perf] ${mark.operation} took ${duration.toFixed(2)}ms`);
    } else if (duration > 50) {
      console.info(`[FDC3:Perf] ${mark.operation} took ${duration.toFixed(2)}ms`);
    }

    // Notify subscribers
    this.subscribers.forEach((cb) => {
      try {
        cb(metric);
      } catch {
        // Silently ignore subscriber errors
      }
    });

    return duration;
  }

  /**
   * Measures an async function's execution time
   *
   * Automatically tracks the execution time of an async function.
   * Logs a warning if the operation takes longer than 100ms.
   *
   * @param operation - Name of the operation to measure
   * @param fn - Async function to measure
   * @returns Promise resolving to the result of the function
   *
   * @example
   * ```typescript
   * const result = await tracker.measure('fetchData', async () => {
   *   return await fetchDataFromAPI();
   * });
   * ```
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    attributes?: PerformanceAttributes,
  ): Promise<T> {
    const markId = this.start(operation, attributes);
    let outcome: PerformanceMetric['outcome'] = 'success';
    try {
      return await fn();
    } catch (error) {
      outcome = 'error';
      throw error;
    } finally {
      this.end(markId, outcome);
    }
  }

  /**
   * Gets recent performance logs
   *
   * @returns Array of recent performance entries
   */
  getPerfLogs(): PerformanceMetric[] {
    return [...this.perfLogs];
  }

  /**
   * Clears all operation marks and performance logs
   */
  clear(): void {
    this.marks.clear();
    this.perfLogs = [];
  }

  private getMarkName(id: string): string {
    return `${USER_TIMING_PREFIX}:${id}:start`;
  }

  private getEndMarkName(id: string): string {
    return `${USER_TIMING_PREFIX}:${id}:end`;
  }

  private getMeasureName(id: string, outcome: PerformanceMetric['outcome']): string {
    return `${USER_TIMING_PREFIX}:${id}:${outcome}`;
  }

  /** User Timing must never interfere with delivery on older or embedded browsers. */
  private recordUserTiming(id: string, measureName: string): void {
    if (!performance.mark || !performance.measure) {
      return;
    }

    try {
      performance.mark(this.getEndMarkName(id));
      performance.measure(measureName, this.getMarkName(id), this.getEndMarkName(id));
    } catch {
      // The in-memory metric remains available even if User Timing is unavailable.
    }
  }
}
