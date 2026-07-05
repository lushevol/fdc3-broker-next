/**
 * Intent Queue Unit Tests
 * @see plan.md#T089
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IntentQueueImpl } from '../src/intent-queue';
import type { Context, QueuedIntent } from '../src/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('IntentQueueImpl', () => {
  let queue: IntentQueueImpl;
  let mockHandler: ReturnType<typeof vi.fn>;

  const mockContext1: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  const mockContext2: Context = {
    type: 'fdc3.quote',
    id: { ticker: 'MSFT' },
  };

  const mockSource = {
    appId: 'app1',
    instanceId: 'tile-1',
  };

  beforeEach(() => {
    queue = new IntentQueueImpl();
    mockHandler = vi.fn().mockResolvedValue(undefined);
    localStorage.clear();
  });

  describe('queueIntent()', () => {
    it('should queue intent for tile', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      const queued = queue.getQueuedIntents('tile-2');
      expect(queued.length).toBe(1);
      expect(queued[0]).toEqual(intent);
    });

    it('should queue multiple intents for same tile', () => {
      const intent1: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent2: QueuedIntent = {
        id: 'intent-2',
        intent: 'ViewQuote',
        context: mockContext2,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent1);
      queue.queueIntent('tile-2', intent2);

      const queued = queue.getQueuedIntents('tile-2');
      expect(queued.length).toBe(2);
      expect(queued[0]).toEqual(intent1);
      expect(queued[1]).toEqual(intent2);
    });

    it('should queue intents for different tiles separately', () => {
      const intent1: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent2: QueuedIntent = {
        id: 'intent-2',
        intent: 'ViewQuote',
        context: mockContext2,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent1);
      queue.queueIntent('tile-2', intent2);

      expect(queue.getQueuedIntents('tile-1').length).toBe(1);
      expect(queue.getQueuedIntents('tile-2').length).toBe(1);
      expect(queue.getQueueSize('tile-1')).toBe(1);
      expect(queue.getQueueSize('tile-2')).toBe(1);
    });

    it('should save to localStorage when queuing', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      const stored = localStorage.getItem('fdc3-intent-queue');
      expect(stored).toBeTruthy();
    });

    it('should warn when queue persistence fails during save', () => {
      const originalSetItem = localStorage.setItem;
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        value: () => {
          throw new Error('storage unavailable');
        },
      });

      queue.queueIntent('tile-2', {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      });

      expect(warnSpy).toHaveBeenCalledWith(
        '[IntentQueue] Failed to save to localStorage:',
        expect.any(Error),
      );

      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        value: originalSetItem,
      });
      warnSpy.mockRestore();
    });
  });

  describe('deliverQueued()', () => {
    it('should deliver all queued intents to handler', async () => {
      const intent1: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent2: QueuedIntent = {
        id: 'intent-2',
        intent: 'ViewQuote',
        context: mockContext2,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent1);
      queue.queueIntent('tile-2', intent2);

      await queue.deliverQueued('tile-2', mockHandler);

      expect(mockHandler).toHaveBeenCalledTimes(2);
      expect(mockHandler).toHaveBeenCalledWith(mockContext1);
      expect(mockHandler).toHaveBeenCalledWith(mockContext2);
    });

    it('should clear queue after delivery', async () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      await queue.deliverQueued('tile-2', mockHandler);

      expect(queue.getQueuedIntents('tile-2').length).toBe(0);
    });

    it('should handle delivery when no intents queued', async () => {
      await queue.deliverQueued('tile-2', mockHandler);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should continue delivery on handler error', async () => {
      const erroringHandler = vi
        .fn()
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce(new Error('Handler error'))
        .mockResolvedValueOnce('success');

      const intent1: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent2: QueuedIntent = {
        id: 'intent-2',
        intent: 'ViewQuote',
        context: mockContext2,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent3: QueuedIntent = {
        id: 'intent-3',
        intent: 'ViewOrders',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent1);
      queue.queueIntent('tile-2', intent2);
      queue.queueIntent('tile-2', intent3);

      await queue.deliverQueued('tile-2', erroringHandler);

      // Should call all 3 times despite error
      expect(erroringHandler).toHaveBeenCalledTimes(3);
    });

    it('should deliver intents in order', async () => {
      const orderTracker: string[] = [];

      const trackingHandler = vi.fn().mockImplementation(async (context) => {
        orderTracker.push(context.type);
      });

      const intent1: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      const intent2: QueuedIntent = {
        id: 'intent-2',
        intent: 'ViewQuote',
        context: mockContext2,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent1);
      queue.queueIntent('tile-2', intent2);

      await queue.deliverQueued('tile-2', trackingHandler);

      expect(orderTracker).toEqual(['fdc3.chart', 'fdc3.quote']);
    });
  });

  describe('getQueuedIntents()', () => {
    it('should return empty array for tile with no intents', () => {
      const intents = queue.getQueuedIntents('nonexistent');

      expect(intents).toEqual([]);
    });

    it('should return copy of queued intents', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      const intents = queue.getQueuedIntents('tile-2');
      intents.push({
        id: 'external-mutation',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      }); // Try to modify returned array

      // Original queue should not be modified
      expect(queue.getQueuedIntents('tile-2').length).toBe(1);
    });
  });

  describe('saveToPersistence() / loadFromPersistence()', () => {
    it('should save queue to localStorage', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      const stored = localStorage.getItem('fdc3-intent-queue');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it('should load queue from localStorage', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);

      // Create new queue instance
      const newQueue = new IntentQueueImpl();
      newQueue.loadFromPersistence();

      const intents = newQueue.getQueuedIntents('tile-2');
      expect(intents.length).toBe(1);
      expect(intents[0].id).toBe('intent-1');
    });

    it('should keep localStorage after loading until explicitly cleared', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-2', intent);
      queue.loadFromPersistence();

      expect(localStorage.getItem('fdc3-intent-queue')).toContain('intent-1');
    });

    it('should handle loading when localStorage is empty', () => {
      const newQueue = new IntentQueueImpl();

      expect(() => newQueue.loadFromPersistence()).not.toThrow();
      expect(newQueue.getTotalQueueSize()).toBe(0);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const newQueue = new IntentQueueImpl();
      expect(() => newQueue.loadFromPersistence()).not.toThrow();

      localStorage.getItem = originalGetItem;
    });
  });

  describe('clearQueue()', () => {
    it('should clear queue for specific tile', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.queueIntent('tile-2', intent);

      queue.clearQueue('tile-1');

      expect(queue.getQueuedIntents('tile-1').length).toBe(0);
      expect(queue.getQueuedIntents('tile-2').length).toBe(1);
    });

    it('should update localStorage when clearing', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.clearQueue('tile-1');

      const stored = localStorage.getItem('fdc3-intent-queue');
      const parsed = JSON.parse(stored!);
      // After clearing tile-1, the queue should be empty (no entries)
      expect(parsed).toHaveLength(0);
    });
  });

  describe('enqueue() - convenience method', () => {
    it('should create and queue intent', () => {
      const intentId = queue.enqueue('tile-2', 'ViewChart', mockContext1, mockSource);

      expect(intentId).toBeTruthy();
      expect(intentId).toMatch(/^intent_\d+_\d+$/);

      const intents = queue.getQueuedIntents('tile-2');
      expect(intents.length).toBe(1);
      expect(intents[0].intent).toBe('ViewChart');
      expect(intents[0].context).toEqual(mockContext1);
      expect(intents[0].source).toEqual(mockSource);
    });

    it('should generate unique intent IDs', () => {
      const id1 = queue.enqueue('tile-2', 'ViewChart', mockContext1, mockSource);
      const id2 = queue.enqueue('tile-2', 'ViewQuote', mockContext2, mockSource);

      expect(id1).not.toBe(id2);
    });

    it('should set timestamp on queued intent', () => {
      const beforeTimestamp = Date.now();
      queue.enqueue('tile-2', 'ViewChart', mockContext1, mockSource);
      const afterTimestamp = Date.now();

      const intents = queue.getQueuedIntents('tile-2');
      expect(intents[0].timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(intents[0].timestamp).toBeLessThanOrEqual(afterTimestamp);
    });
  });

  describe('getQueueSize() / getTotalQueueSize()', () => {
    it('should return queue size for specific tile', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      expect(queue.getQueueSize('tile-1')).toBe(0);

      queue.queueIntent('tile-1', intent);
      expect(queue.getQueueSize('tile-1')).toBe(1);

      queue.queueIntent('tile-1', intent);
      expect(queue.getQueueSize('tile-1')).toBe(2);
    });

    it('should return total queue size across all tiles', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.queueIntent('tile-1', intent);
      queue.queueIntent('tile-2', intent);

      expect(queue.getTotalQueueSize()).toBe(3);
    });

    it('should return 0 when no intents queued', () => {
      expect(queue.getTotalQueueSize()).toBe(0);
    });
  });

  describe('clear()', () => {
    it('should clear all queues', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.queueIntent('tile-2', intent);

      queue.clear();

      expect(queue.getTotalQueueSize()).toBe(0);
      expect(queue.getQueuedIntents('tile-1').length).toBe(0);
      expect(queue.getQueuedIntents('tile-2').length).toBe(0);
    });

    it('should clear localStorage', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.clear();

      const stored = localStorage.getItem('fdc3-intent-queue');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('getTilesWithQueuedIntents()', () => {
    it('should return tile IDs with queued intents', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.queueIntent('tile-2', intent);

      const tiles = queue.getTilesWithQueuedIntents();

      expect(tiles.length).toBe(2);
      expect(tiles).toContain('tile-1');
      expect(tiles).toContain('tile-2');
    });

    it('should return empty array when no intents queued', () => {
      const tiles = queue.getTilesWithQueuedIntents();

      expect(tiles).toEqual([]);
    });

    it('should not include tiles with empty queues', () => {
      const intent: QueuedIntent = {
        id: 'intent-1',
        intent: 'ViewChart',
        context: mockContext1,
        source: mockSource,
        timestamp: Date.now(),
      };

      queue.queueIntent('tile-1', intent);
      queue.deliverQueued('tile-1', mockHandler);

      const tiles = queue.getTilesWithQueuedIntents();

      expect(tiles).not.toContain('tile-1');
    });
  });
});
