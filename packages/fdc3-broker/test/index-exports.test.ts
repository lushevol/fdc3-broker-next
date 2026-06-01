import { describe, expect, it } from 'vitest';
import * as broker from '../src/index';

describe('fdc3-broker public exports', () => {
  it('should expose core broker building blocks', () => {
    expect(broker.Broker).toBeTypeOf('function');
    expect(broker.ChannelImpl).toBeTypeOf('function');
    expect(broker.PrivateChannelImpl).toBeTypeOf('function');
    expect(broker.ChannelManager).toBeTypeOf('function');
    expect(broker.IntentResolver).toBeTypeOf('function');
    expect(broker.IntentQueueImpl).toBeTypeOf('function');
    expect(broker.TileRegistryImpl).toBeTypeOf('function');
  });

  it('should expose infrastructure utilities', () => {
    expect(broker.EntitlementValidator).toBeTypeOf('function');
    expect(broker.Logger).toBeTypeOf('function');
    expect(broker.LogLevel).toBeDefined();
    expect(broker.OpenFinBridge).toBeTypeOf('function');
    expect(broker.PostMessageBridge).toBeTypeOf('function');
    expect(broker.PerformanceTracker).toBeTypeOf('function');
    expect(broker.WorkflowExecutor).toBeTypeOf('function');
  });

  it('should expose environment, error, and channel constants', () => {
    expect(broker.isOpenFinAvailable).toBeTypeOf('function');
    expect(broker.getRuntimeEnvironment).toBeTypeOf('function');
    expect(broker.isPostMessageAvailable).toBeTypeOf('function');
    expect(broker.USER_CHANNEL_IDS).toContain('red');
    expect(broker.BrokerInitializationError).toBeTypeOf('function');
    expect(broker.EntitlementError).toBeTypeOf('function');
  });
});
