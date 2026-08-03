/** @vitest-environment node */

import { describe, expect, it, vi } from 'vitest';
import { clearBroker, getAgentApi, setBroker } from '../src/agent';
import type { DesktopAgent } from '../src/types';

describe('agent API outside a browser', () => {
  it('does not create global broker state when window is unavailable', () => {
    const broker = { broadcast: vi.fn() } as unknown as DesktopAgent;

    expect(() => setBroker(broker)).not.toThrow();
    expect(() => clearBroker()).not.toThrow();
    expect(() => getAgentApi()).toThrow('FDC3 Agent not initialized');
  });
});
