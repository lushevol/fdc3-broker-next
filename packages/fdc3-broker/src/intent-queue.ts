/**
 * Intent Queue
 *
 * Queues intents for tiles that are not yet mounted.
 * @see data-model.md#L585-L635
 * @see research.md#L676-L712
 */

import type {
  AppIdentifier,
  Context,
  IntentHandler,
  IntentQueue as IntentQueueInterface,
  QueuedIntent,
} from './types';

/**
 * Intent Queue Implementation
 */
export class IntentQueueImpl implements IntentQueueInterface {
  private queue = new Map<string, QueuedIntent[]>();
  private nextIntentId = 0;

  /**
   * Queue intent for tile
   * @param tileId Tile identifier
   * @param intent Queued intent
   */
  queueIntent(tileId: string, intent: QueuedIntent): void {
    if (!this.queue.has(tileId)) {
      this.queue.set(tileId, []);
    }
    this.queue.get(tileId)!.push(intent);
    this.saveToPersistence();
  }

  /**
   * Deliver queued intents to tile
   * @param tileId Tile identifier
   * @param handler Intent handler function
   */
  async deliverQueued(tileId: string, handler: IntentHandler): Promise<void> {
    const queued = this.queue.get(tileId);
    if (!queued || queued.length === 0) {
      return;
    }

    // Get and clear queue for this tile
    const intents = this.queue.get(tileId)!;
    this.queue.delete(tileId);
    this.saveToPersistence();

    // Deliver each intent in order
    for (const intent of intents) {
      try {
        await handler(intent.context);
      } catch (error) {
        console.error(
          `[IntentQueue] Error delivering queued intent ${intent.id} to tile ${tileId}:`,
          error,
        );
      }
    }
  }

  /**
   * Get queued intents for tile
   * @param tileId Tile identifier
   * @returns Array of queued intents (copy to prevent mutation)
   */
  getQueuedIntents(tileId: string): QueuedIntent[] {
    return [...(this.queue.get(tileId) || [])];
  }

  /**
   * Save queue to persistent storage (localStorage/sessionStorage)
   */
  saveToPersistence(): void {
    try {
      const data = JSON.stringify(Array.from(this.queue.entries()));
      localStorage.setItem('fdc3-intent-queue', data);
    } catch (error) {
      console.warn('[IntentQueue] Failed to save to localStorage:', error);
    }
  }

  /**
   * Load queue from persistent storage
   */
  loadFromPersistence(): void {
    try {
      const data = localStorage.getItem('fdc3-intent-queue');
      if (data) {
        this.queue = new Map(JSON.parse(data));
        localStorage.removeItem('fdc3-intent-queue');
      }
    } catch (error) {
      console.warn('[IntentQueue] Failed to load from localStorage:', error);
    }
  }

  /**
   * Clear queue for tile
   * @param tileId Tile identifier
   */
  clearQueue(tileId: string): void {
    this.queue.delete(tileId);
    this.saveToPersistence();
  }

  /**
   * Generate unique intent ID
   * @returns Intent ID
   */
  private generateIntentId(): string {
    return `intent_${Date.now()}_${this.nextIntentId++}`;
  }

  /**
   * Create and queue an intent
   * @param tileId Tile identifier
   * @param intentType Intent type
   * @param context Context data
   * @param source Source app
   */
  enqueue(tileId: string, intentType: string, context: Context, source: AppIdentifier): string {
    const intent: QueuedIntent = {
      id: this.generateIntentId(),
      intent: intentType,
      context,
      source,
      timestamp: Date.now(),
    };

    this.queueIntent(tileId, intent);
    return intent.id;
  }

  /**
   * Get queue size for tile
   * @param tileId Tile identifier
   * @returns Number of queued intents
   */
  getQueueSize(tileId: string): number {
    return this.queue.get(tileId)?.length || 0;
  }

  /**
   * Get total queue size across all tiles
   * @returns Total number of queued intents
   */
  getTotalQueueSize(): number {
    let total = 0;
    for (const intents of this.queue.values()) {
      total += intents.length;
    }
    return total;
  }

  /**
   * Clear all queues
   */
  clear(): void {
    this.queue.clear();
    this.saveToPersistence();
  }

  /**
   * Get all tile IDs with queued intents
   * @returns Array of tile IDs
   */
  getTilesWithQueuedIntents(): string[] {
    return Array.from(this.queue.keys());
  }
}
