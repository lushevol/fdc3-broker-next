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
 */
export class PerformanceTracker {
  private marks = new Map<string, number>();

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
  start(operation: string): void {
    this.marks.set(operation, performance.now());
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
  end(operation: string): number {
    const start = this.marks.get(operation);
    if (start === undefined) {
      console.warn(`[FDC3:Perf] No start mark found for operation: ${operation}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(operation);

    // Log if operation took too long (>100ms)
    if (duration > 100) {
      console.warn(`[FDC3:Perf] ${operation} took ${duration.toFixed(2)}ms`);
    }

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
  async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    this.start(operation);
    try {
      return await fn();
    } finally {
      this.end(operation);
    }
  }

  /**
   * Clears all operation marks
   *
   * Removes all tracked operations from the tracker.
   */
  clear(): void {
    this.marks.clear();
  }
}
