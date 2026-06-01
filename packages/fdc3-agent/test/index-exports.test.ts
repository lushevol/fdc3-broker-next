import { describe, expect, it } from 'vitest';
import * as agent from '../src/index';

describe('fdc3-agent public exports', () => {
  it('should expose the agent lifecycle API', () => {
    expect(agent.setBroker).toBeTypeOf('function');
    expect(agent.getAgentApi).toBeTypeOf('function');
    expect(agent.clearBroker).toBeTypeOf('function');
  });

  it('should expose React integration utilities', () => {
    expect(agent.AgentProvider).toBeTypeOf('function');
    expect(agent.useFDC3).toBeTypeOf('function');
    expect(agent.useAppIdentifier).toBeTypeOf('function');
    expect(agent.useIntentListener).toBeTypeOf('function');
    expect(agent.useContextListener).toBeTypeOf('function');
    expect(agent.useCurrentChannel).toBeTypeOf('function');
    expect(agent.useUserChannels).toBeTypeOf('function');
  });

  it('should expose the package error boundary', () => {
    expect(agent.ErrorBoundary).toBeTypeOf('function');
  });
});
