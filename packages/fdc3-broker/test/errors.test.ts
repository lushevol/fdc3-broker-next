import { describe, expect, it } from 'vitest';
import {
  AppDirectoryError,
  BrokerInitializationError,
  EntitlementError,
  IntentQueueError,
  OpenFinBridgeError,
} from '../src/errors';

describe('broker error classes', () => {
  it.each([
    [
      BrokerInitializationError,
      'BrokerInitializationError',
      '[Broker] Initialization failed: missing callbacks',
    ],
    [EntitlementError, 'EntitlementError', '[Broker] Entitlement check failed: denied'],
    [IntentQueueError, 'IntentQueueError', '[Broker] Intent queue error: persistence failed'],
    [AppDirectoryError, 'AppDirectoryError', '[Broker] App Directory error: unavailable'],
    [OpenFinBridgeError, 'OpenFinBridgeError', '[Broker] OpenFin bridge error: fin not ready'],
  ])('should preserve name and broker-prefixed message for %s', (ErrorClass, name, message) => {
    const reason = message.split(': ').at(-1) ?? '';
    const error = new ErrorClass(reason);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe(name);
    expect(error.message).toBe(message);
  });
});
