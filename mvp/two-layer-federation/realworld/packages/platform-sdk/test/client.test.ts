import { describe, expect, it, vi } from 'vitest';
import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type AppearanceSnapshot,
  type IdentitySnapshot,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController, createPlatformClient } from '../src';

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

  it('returns no identity when the optional capability is unavailable', () => {
    const client = createPlatformClient(createCapabilities());
    expect(client.getIdentity()).toBeUndefined();
    expect(client.subscribeToIdentity(vi.fn())).toBeUndefined();
  });

  it('publishes validated immutable identity snapshots through the client', () => {
    const anonymous: IdentitySnapshot = { state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION };
    const controller = createIdentityController(anonymous);
    const capabilities = { ...createCapabilities(), identity: controller.capability };
    const listener = vi.fn();
    const unsubscribe = createPlatformClient(capabilities).subscribeToIdentity(listener);
    const mutable = {
      state: 'authenticated' as const,
      userId: 'operator-7',
      permissions: ['authorization-limits:write'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    };
    controller.setSnapshot(mutable);
    mutable.userId = 'changed';
    mutable.permissions.push('changed');
    expect(listener).toHaveBeenCalledWith({
      state: 'authenticated', userId: 'operator-7', permissions: ['authorization-limits:write'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    expect(controller.capability.getSnapshot()).toEqual(listener.mock.calls[0][0]);
    expect(Object.isFrozen(controller.capability.getSnapshot())).toBe(true);
    expect(Object.isFrozen((controller.capability.getSnapshot() as { permissions: string[] }).permissions)).toBe(true);
    unsubscribe?.();
    controller.setSnapshot(anonymous);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('rejects malformed identity without changing the current snapshot', () => {
    const anonymous: IdentitySnapshot = { state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION };
    expect(() => createIdentityController({ ...anonymous, userId: 'invalid' } as never)).toThrow();
    const controller = createIdentityController(anonymous);
    expect(() => controller.setSnapshot({
      state: 'authenticated', userId: '', permissions: [], contractVersion: IDENTITY_CONTRACT_VERSION,
    } as never)).toThrow();
    expect(controller.capability.getSnapshot()).toEqual(anonymous);
  });
});
