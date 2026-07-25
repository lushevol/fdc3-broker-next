import { describe, expect, it, vi } from 'vitest';

import {
  WorkflowOrchestrator,
  createWorkflowAgentToolkit,
  type AgentWorkflowTool,
  type WorkflowDefinition,
} from '../src';

const workflow: WorkflowDefinition = {
  workflowId: 'trade.insight',
  title: 'Trade insight',
  description: 'Discover and enrich a trade.',
  inputSchema: {
    type: 'object',
    properties: {
      desk: { type: 'string' },
    },
    required: ['desk'],
  },
  steps: [
    {
      id: 'discover',
      intent: 'DiscoverTrade',
      contextTemplate: { type: 'fdc3.trade.query', desk: '${input.desk}' },
    },
  ],
};

function createOrchestrator(...providedResults: [unknown?]): WorkflowOrchestrator {
  const result =
    providedResults.length === 0 ? { tradeId: 'TR-AI-1' } : providedResults[0];
  return new WorkflowOrchestrator({
    workflows: [workflow],
    client: {
      raiseIntent: vi.fn(async () => ({
        getResult: async () => result,
      })),
    },
    inspectCapability: vi.fn(async () => ({ state: 'ready', appId: 'trade-tile' })),
  });
}

function findTool(tools: AgentWorkflowTool[], name: string): AgentWorkflowTool {
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool) {
    throw new Error(`Missing tool ${name}`);
  }
  return tool;
}

describe('createWorkflowAgentToolkit', () => {
  it('exposes deterministic JSON-schema discovery, inspection, and run tools', () => {
    const toolkit = createWorkflowAgentToolkit(createOrchestrator());

    expect(toolkit.tools.map((tool) => tool.name)).toEqual([
      'list_fdc3_workflows',
      'inspect_fdc3_workflow',
      'run_fdc3_workflow',
    ]);
    for (const tool of toolkit.tools) {
      expect(tool.description.length).toBeGreaterThan(10);
      expect(tool.inputSchema).toEqual(expect.objectContaining({ type: 'object' }));
      expect(() => JSON.stringify(tool.inputSchema)).not.toThrow();
    }
  });

  it('lists serializable workflow metadata for agent planning', async () => {
    const tool = findTool(createWorkflowAgentToolkit(createOrchestrator()).tools, 'list_fdc3_workflows');

    const response = await tool.execute({});

    expect(response).toEqual(
      expect.objectContaining({
        ok: true,
        kind: 'workflow-list',
        data: {
          workflows: [
            expect.objectContaining({
              workflowId: 'trade.insight',
              inputSchema: workflow.inputSchema,
            }),
          ],
        },
      }),
    );
    expect(() => JSON.stringify(response)).not.toThrow();
  });

  it('inspects workflow readiness before an agent selects it', async () => {
    const tool = findTool(
      createWorkflowAgentToolkit(createOrchestrator()).tools,
      'inspect_fdc3_workflow',
    );

    const response = await tool.execute({
      workflowId: 'trade.insight',
      input: { desk: 'FX' },
    });

    expect(response.ok).toBe(true);
    expect(response.data).toEqual(
      expect.objectContaining({
        workflow: expect.objectContaining({ workflowId: 'trade.insight' }),
        preflight: expect.objectContaining({ ready: true }),
      }),
    );
  });

  it('returns inspection validation, not-found, readiness, and adapter failures safely', async () => {
    const orchestrator = createOrchestrator();
    const tool = findTool(
      createWorkflowAgentToolkit(orchestrator).tools,
      'inspect_fdc3_workflow',
    );

    expect(await tool.execute(null)).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({ code: 'INVALID_TOOL_INPUT' }),
      }),
    );
    expect(await tool.execute({ workflowId: 'missing' })).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({ code: 'WORKFLOW_NOT_FOUND' }),
      }),
    );

    const unready = createWorkflowAgentToolkit({
      ...orchestrator,
      listWorkflows: () => orchestrator.listWorkflows(),
      inspectWorkflow: (workflowId) => orchestrator.inspectWorkflow(workflowId),
      preflight: async () => ({
        workflowId: 'trade.insight',
        ready: false,
        checks: [
          {
            stepId: 'discover',
            intent: 'DiscoverTrade',
            state: 'declared-only',
            failure: {
              code: 'HANDLER_NOT_REGISTERED',
              message: 'No handler.',
              recoverable: true,
              retryable: true,
              hint: 'Open the tile.',
              workflowId: 'trade.insight',
            },
          },
        ],
      }),
      execute: (workflowId, input, options) => orchestrator.execute(workflowId, input, options),
    });
    expect(
      await findTool(unready.tools, 'inspect_fdc3_workflow').execute({
        workflowId: 'trade.insight',
      }),
    ).toEqual(
      expect.objectContaining({
        ok: false,
        recoveryActions: ['Open the tile.'],
      }),
    );

    const unsafe = createWorkflowAgentToolkit({
      listWorkflows: vi.fn(),
      inspectWorkflow: () => workflow as ReturnType<WorkflowOrchestrator['inspectWorkflow']>,
      preflight: async () => {
        throw new Error('private registry detail');
      },
      execute: vi.fn(),
    });
    expect(
      await findTool(unsafe.tools, 'inspect_fdc3_workflow').execute({
        workflowId: 'trade.insight',
      }),
    ).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'TOOL_EXECUTION_FAILED' }),
      }),
    );
  });

  it('runs a workflow and forwards ordered progress to the agent host', async () => {
    const progress = vi.fn();
    const tool = findTool(createWorkflowAgentToolkit(createOrchestrator()).tools, 'run_fdc3_workflow');

    const response = await tool.execute(
      { workflowId: 'trade.insight', input: { desk: 'FX' } },
      { onProgress: progress },
    );

    expect(response.ok).toBe(true);
    expect(response.kind).toBe('workflow-run');
    expect(response.transcript).toEqual(
      expect.objectContaining({ status: 'success', workflowId: 'trade.insight' }),
    );
    expect(progress.mock.calls.map(([event]) => event.sequence)).toEqual([1, 2, 3, 4]);
  });

  it('returns structured non-throwing workflow and cancellation failures', async () => {
    const failedTool = findTool(
      createWorkflowAgentToolkit(createOrchestrator(undefined)).tools,
      'run_fdc3_workflow',
    );
    const failed = await failedTool.execute({
      workflowId: 'trade.insight',
      input: { desk: 'FX' },
    });
    const controller = new AbortController();
    controller.abort();
    const cancelled = await failedTool.execute(
      { workflowId: 'trade.insight', input: { desk: 'FX' } },
      { signal: controller.signal },
    );

    expect(failed).toEqual(
      expect.objectContaining({
        ok: false,
        failures: [expect.objectContaining({ code: 'HANDLER_NO_RESULT' })],
      }),
    );
    expect(cancelled).toEqual(
      expect.objectContaining({
        ok: false,
        transcript: expect.objectContaining({ status: 'cancelled' }),
        recoveryActions: expect.arrayContaining([expect.stringContaining('new run')]),
      }),
    );
  });

  it('rejects malformed tool input without invoking the orchestrator', async () => {
    const orchestrator = createOrchestrator();
    const execute = vi.spyOn(orchestrator, 'execute');
    const tool = findTool(createWorkflowAgentToolkit(orchestrator).tools, 'run_fdc3_workflow');

    const response = await tool.execute({ workflowId: 42 });

    expect(response).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({ code: 'INVALID_TOOL_INPUT' }),
      }),
    );
    expect(execute).not.toHaveBeenCalled();

    expect(
      await tool.execute({ workflowId: 'trade.insight', input: 'not-an-object' }),
    ).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_TOOL_INPUT' }),
      }),
    );
  });

  it('contains unexpected run adapter failures and resolves tools by name', async () => {
    const unsafe = {
      listWorkflows: vi.fn(),
      inspectWorkflow: vi.fn(),
      preflight: vi.fn(),
      execute: async () => {
        throw new Error('private run detail');
      },
    };
    const toolkit = createWorkflowAgentToolkit(unsafe);

    expect(toolkit.getTool('run_fdc3_workflow')?.name).toBe('run_fdc3_workflow');
    expect(
      await toolkit.getTool('run_fdc3_workflow')?.execute({
        workflowId: 'trade.insight',
      }),
    ).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'TOOL_EXECUTION_FAILED' }),
      }),
    );
  });

  it('contains unexpected adapter errors in a safe tool envelope', async () => {
    const unsafeOrchestrator = {
      listWorkflows: () => {
        throw new Error('sensitive adapter details');
      },
      inspectWorkflow: vi.fn(),
      preflight: vi.fn(),
      execute: vi.fn(),
    };
    const tool = findTool(
      createWorkflowAgentToolkit(unsafeOrchestrator).tools,
      'list_fdc3_workflows',
    );

    const response = await tool.execute({});

    expect(response).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({
          code: 'TOOL_EXECUTION_FAILED',
          message: 'The workflow tool could not complete its request.',
        }),
      }),
    );
    expect(JSON.stringify(response)).not.toContain('sensitive adapter details');
  });
});
