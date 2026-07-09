import { afterEach, describe, expect, it } from '@jest/globals';
import { getBrowserInteropBrokerOptions, getPostMessageBrokerOptions } from './postmessage';

describe('PostMessage broker options', () => {
  const originalEnv = process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS = originalEnv;
    delete (globalThis as typeof globalThis & { fin?: unknown }).fin;
  });

  it('enables the PostMessage bridge with configured allowed origins', () => {
    process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS =
      'http://localhost:8011, https://fmo-source.example';

    expect(getPostMessageBrokerOptions()).toEqual({
      enablePostMessageBridge: true,
      postMessageBridgeOptions: {
        allowedOrigins: ['http://localhost:8011', 'https://fmo-source.example'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
    });
  });

  it('keeps the PostMessage bridge disabled when no allowed origins are configured', () => {
    delete process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS;

    expect(getPostMessageBrokerOptions()).toEqual({
      enablePostMessageBridge: false,
      postMessageBridgeOptions: {
        allowedOrigins: [],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
    });
  });

  it('combines OpenFin and PostMessage options for browser interop broker setup', () => {
    process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS = 'http://localhost:8011';

    expect(getBrowserInteropBrokerOptions()).toEqual({
      enableOpenFinBridge: false,
      openFinBridgeOptions: {
        globalIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
      enablePostMessageBridge: true,
      postMessageBridgeOptions: {
        allowedOrigins: ['http://localhost:8011'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
    });
  });
});
