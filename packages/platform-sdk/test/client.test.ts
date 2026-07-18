import { describe, expect, it, vi } from 'vitest';
import {
  APPEARANCE_CONTRACT_VERSION,
  type AppearanceSnapshot,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createPlatformClient } from '../src';

const darkCompact: AppearanceSnapshot = {
  scheme: 'dark',
  preference: 'dark',
  density: 'compact',
  locale: 'en-SG',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

const createCapabilities = (): PlatformCapabilities => ({
  navigation: { navigate: vi.fn() },
  notifications: { show: vi.fn() },
  telemetry: { track: vi.fn() },
  workspace: { closeCurrent: vi.fn() },
  appearance: createAppearanceController(darkCompact).capability,
});

describe('production platform SDK', () => {
  it('delegates all host capabilities through the typed client', () => {
    const capabilities = createCapabilities();
    const client = createPlatformClient(capabilities);
    client.navigate('/cashflow');
    client.notify('selected');
    client.track('cashflow.selected', { id: 'CF-1' });
    client.closeCurrentWorkspace();
    expect(capabilities.navigation.navigate).toHaveBeenCalledWith('/cashflow');
    expect(capabilities.notifications.show).toHaveBeenCalledWith('selected');
    expect(capabilities.telemetry.track).toHaveBeenCalledWith('cashflow.selected', { id: 'CF-1' });
    expect(capabilities.workspace.closeCurrent).toHaveBeenCalledOnce();
    expect(client.getAppearance()).toEqual(darkCompact);
  });

  it('publishes validated immutable snapshots and supports unsubscription', () => {
    const controller = createAppearanceController(darkCompact);
    const listener = vi.fn();
    const unsubscribe = controller.capability.subscribe(listener);
    const lightComfortable = {
      ...darkCompact,
      scheme: 'light' as const,
      preference: 'light' as const,
      density: 'comfortable' as const,
    };
    controller.setSnapshot(lightComfortable);
    expect(listener).toHaveBeenCalledWith(lightComfortable);
    expect(controller.capability.getSnapshot()).toEqual(lightComfortable);
    expect(Object.isFrozen(controller.capability.getSnapshot())).toBe(true);
    unsubscribe();
    controller.setSnapshot(darkCompact);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('clones input so external mutation cannot change the current snapshot', () => {
    const mutable = { ...darkCompact };
    const controller = createAppearanceController(mutable);
    mutable.locale = 'changed';
    expect(controller.capability.getSnapshot().locale).toBe('en-SG');
  });

  it('rejects invalid initial and updated snapshots', () => {
    expect(() => createAppearanceController({ ...darkCompact, density: 'tiny' } as never)).toThrow();
    const controller = createAppearanceController(darkCompact);
    expect(() => controller.setSnapshot({ ...darkCompact, contractVersion: '2.0.0' } as never)).toThrow();
    expect(controller.capability.getSnapshot()).toEqual(darkCompact);
  });

  it('delegates appearance subscriptions through the client', () => {
    const capabilities = createCapabilities();
    const listener = vi.fn();
    const unsubscribe = createPlatformClient(capabilities).subscribeToAppearance(listener);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });
});
