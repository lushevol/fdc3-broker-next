import { describe, expect, it, afterEach } from '@jest/globals';
import { getOpenFinBrokerOptions } from './openfin';

describe('OpenFin broker options', () => {
  afterEach(() => {
    delete (globalThis as typeof globalThis & { fin?: unknown }).fin;
  });

  it('enables the OpenFin bridge when running in an OpenFin environment', () => {
    (globalThis as typeof globalThis & { fin?: unknown }).fin = {
      desktop: {
        fdc3: {},
      },
    };

    expect(getOpenFinBrokerOptions()).toEqual({
      enableOpenFinBridge: true,
      openFinBridgeOptions: {
        globalIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
    });
  });

  it('keeps the OpenFin bridge disabled outside OpenFin', () => {
    expect(getOpenFinBrokerOptions()).toEqual({
      enableOpenFinBridge: false,
      openFinBridgeOptions: {
        globalIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
    });
  });
});
