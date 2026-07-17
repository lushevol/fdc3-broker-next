import { describe, expect, it, vi } from 'vitest';
import { APPEARANCE_CONTRACT_VERSION, type AppearanceSnapshot } from '@fm/platform-contracts-poc';
import { createAppearanceController, createPlatformClient } from '../src';

const initialAppearance: AppearanceSnapshot = {
  scheme: 'dark',
  preference: 'system',
  density: 'compact',
  locale: 'en-US',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

describe('createPlatformClient', () => {
  it('forwards calls to the injected capabilities', () => {
    const capabilities = {
      navigation: { navigate: vi.fn() },
      notifications: { show: vi.fn() },
      telemetry: { track: vi.fn() },
      workspace: { closeCurrent: vi.fn() },
      appearance: {
        getSnapshot: vi.fn(() => initialAppearance),
        subscribe: vi.fn(() => vi.fn()),
      },
    };
    const client = createPlatformClient(capabilities);
    client.navigate('/cashflow/details');
    client.notify('Selected CF-1001');
    client.track('cashflow.selected', { id: 'CF-1001' });
    client.closeCurrentWorkspace();
    expect(capabilities.navigation.navigate).toHaveBeenCalledWith('/cashflow/details');
    expect(capabilities.notifications.show).toHaveBeenCalledWith('Selected CF-1001');
    expect(capabilities.telemetry.track).toHaveBeenCalledWith('cashflow.selected', { id: 'CF-1001' });
    expect(capabilities.workspace.closeCurrent).toHaveBeenCalledOnce();
    expect(client.getAppearance()).toEqual(initialAppearance);
  });
});

describe('createAppearanceController', () => {
  it('publishes complete snapshots and stops after unsubscribe', () => {
    const controller = createAppearanceController(initialAppearance);
    const listener = vi.fn();
    const unsubscribe = controller.capability.subscribe(listener);
    const next = { ...initialAppearance, scheme: 'light' as const };

    controller.setSnapshot(next);
    expect(controller.capability.getSnapshot()).toEqual(next);
    expect(listener).toHaveBeenCalledWith(next);

    unsubscribe();
    controller.setSnapshot({ ...next, density: 'comfortable' });
    expect(listener).toHaveBeenCalledOnce();
  });

  it('keeps a stable capability identity while snapshots change', () => {
    const controller = createAppearanceController(initialAppearance);
    const capability = controller.capability;
    controller.setSnapshot({ ...initialAppearance, preference: 'dark' });
    expect(controller.capability).toBe(capability);
  });
});
