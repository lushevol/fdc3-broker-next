import { getAgentApi } from 'ratan-fdc3-agent';

export type Fdc3WorkflowExecutorInput = {
  workflowId: string;
  input?: Record<string, unknown>;
};

export type Fdc3WorkflowExecutor = {
  execute(input: Fdc3WorkflowExecutorInput): Promise<unknown>;
};

export function createFdc3WorkflowExecutor(deps: {
  getAgentApi?: typeof getAgentApi;
} = {}): Fdc3WorkflowExecutor {
  const getFdc3Api = deps.getAgentApi ?? getAgentApi;

  return {
    async execute(input) {
      const resolution = await getFdc3Api().raiseWorkflow(
        input.workflowId,
        input.input ?? {},
      );
      return resolution.getResult();
    },
  };
}
