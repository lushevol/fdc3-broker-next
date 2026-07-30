import { describe, expect, it } from 'vitest';
import { FDC3ChildProvider, FDC3RootProvider, getAgentApi } from '../src';
import { AgentProvider } from '../src/agent';
import { AppDirectoryClientImpl } from '../src/app-directory';
import { Broker } from '../src/broker';
import * as FinosFDC3 from '../src/finos';
import * as OpenFinFDC3 from '../src/openfin';
import { ResolverDialog } from '../src/resolver-ui';
import { WorkflowOrchestrator } from '../src/workflow-orchestrator';

describe('ratan-fdc3 facade', () => {
  it('ships the root convenience API and every focused capability', () => {
    expect(FDC3RootProvider).toBeTypeOf('function');
    expect(FDC3ChildProvider).toBeTypeOf('function');
    expect(getAgentApi).toBeTypeOf('function');
    expect(AgentProvider).toBeTypeOf('function');
    expect(AppDirectoryClientImpl).toBeTypeOf('function');
    expect(Broker).toBeTypeOf('function');
    expect(FinosFDC3).toBeTypeOf('object');
    expect(OpenFinFDC3).toBeTypeOf('object');
    expect(ResolverDialog).toBeTypeOf('function');
    expect(WorkflowOrchestrator).toBeTypeOf('function');
  });
});
