import { describe, expect, it, vi } from 'vitest';
import { createPlatformClient } from '../src';

describe('createPlatformClient', () => {
  it('forwards calls to the injected capabilities', () => {
    const capabilities = {
      navigation: { navigate: vi.fn() },
      notifications: { show: vi.fn() },
      telemetry: { track: vi.fn() },
      workspace: { closeCurrent: vi.fn() },
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
  });
});
