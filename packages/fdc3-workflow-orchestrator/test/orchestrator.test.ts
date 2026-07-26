import { describe, expect, it, vi } from 'vitest';

import {
  WorkflowOrchestrator,
  type Fdc3IntentClient,
  type WorkflowDefinition,
  type WorkflowEvent,
} from '../src';

const baseWorkflow: WorkflowDefinition = {
  workflowId: 'trade.insight',
  title: 'Trade insight',
  inputSchema: { type: 'object' },
  steps: [
    {
      id: 'discover',
      intent: 'DiscoverTrade',
      targetAppId: 'trade-tile',
      contextTemplate: {
        type: 'fdc3.trade.query',
        desk: '${input.desk}',
      },
    },
  ],
};

function clientReturning(...results: unknown[]): Fdc3IntentClient {
  let index = 0;
  return {
    raiseIntent: vi.fn(async () => ({
      getResult: async () => results[index++],
    })),
  };
}

describe('WorkflowOrchestrator', () => {
  it.each([
    [{ ...baseWorkflow, steps: [] }, 'must contain at least one step'],
    [
      { ...baseWorkflow, steps: [baseWorkflow.steps[0], baseWorkflow.steps[0]] },
      'duplicate step id',
    ],
    [
      {
        ...baseWorkflow,
        steps: [
          {
            ...baseWorkflow.steps[0],
            inputBindings: [
              {
                fromStepId: 'missing',
                resultPath: 'trade',
                contextPath: 'trade',
                required: true,
              },
            ],
          },
        ],
      },
      'references unknown or later step',
    ],
    [
      { ...baseWorkflow, workflowId: '' },
      'requires non-empty workflowId and title',
    ],
    [
      { ...baseWorkflow, steps: [{ ...baseWorkflow.steps[0], id: '' }] },
      'require non-empty id and intent',
    ],
    [
      { ...baseWorkflow, steps: [{ ...baseWorkflow.steps[0], timeoutMs: 0 }] },
      'timeout must be positive',
    ],
    [
      {
        ...baseWorkflow,
        steps: [
          {
            ...baseWorkflow.steps[0],
            retry: { maxAttempts: 0, retryOn: [] },
          },
        ],
      },
      'maxAttempts must be at least one',
    ],
  ])('rejects invalid workflow definitions', (workflow, message) => {
    expect(
      () =>
        new WorkflowOrchestrator({
          workflows: [workflow],
          client: clientReturning({}),
        }),
    ).toThrow(message);
  });

  it('rejects duplicate workflow identifiers', () => {
    expect(
      () =>
        new WorkflowOrchestrator({
          workflows: [baseWorkflow, baseWorkflow],
          client: clientReturning({}),
        }),
    ).toThrow('Duplicate workflow id');
  });

  it('lists, inspects, and executes a workflow with ordered events', async () => {
    const events: WorkflowEvent[] = [];
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-1' }),
    });
    orchestrator.subscribe((event) => events.push(event));

    expect(orchestrator.listWorkflows()).toEqual([
      expect.objectContaining({ workflowId: 'trade.insight', stepCount: 1 }),
    ]);
    expect(orchestrator.inspectWorkflow('trade.insight')).toEqual(
      expect.objectContaining({ workflowId: 'trade.insight' }),
    );

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.status).toBe('success');
    expect(transcript.completedSteps[0]?.result).toEqual({ tradeId: 'TR-1' });
    expect(events.map((event) => event.type)).toEqual([
      'workflow.started',
      'node.started',
      'node.completed',
      'workflow.completed',
    ]);
    expect(events.map((event) => event.sequence)).toEqual([1, 2, 3, 4]);
  });

  it('renders nested, embedded, array, and primitive workflow input values', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        {
          ...baseWorkflow.steps[0],
          targetAppId: undefined,
          contextTemplate: {
            type: 'fdc3.trade.query',
            exact: '${input.filters}',
            label: 'Desk ${input.desk}',
            values: ['${input.desk}', 7, null],
          },
        },
      ],
    };
    const client = clientReturning({ tradeId: 'TR-1' });
    const orchestrator = new WorkflowOrchestrator({ workflows: [workflow], client });

    const transcript = await orchestrator.execute('trade.insight', {
      desk: 'FX',
      filters: { status: 'PENDING' },
    });

    expect(transcript.completedSteps[0]?.context).toEqual({
      type: 'fdc3.trade.query',
      exact: { status: 'PENDING' },
      label: 'Desk FX',
      values: ['FX', 7, null],
    });
    expect(client.raiseIntent).toHaveBeenCalledWith(
      'DiscoverTrade',
      expect.any(Object),
      undefined,
    );
  });

  it('reports missing template input during preflight and execution', async () => {
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({}),
    });

    expect((await orchestrator.preflight('missing')).ready).toBe(false);
    expect((await orchestrator.preflight('trade.insight')).checks[0]?.failure?.code).toBe(
      'BINDING_FAILED',
    );
    expect((await orchestrator.execute('trade.insight')).failures[0]?.code).toBe(
      'BINDING_FAILED',
    );
  });

  it('fails preflight when an intent is declared without a registered handler', async () => {
    const client = clientReturning({ tradeId: 'TR-1' });
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client,
      inspectCapability: vi.fn(async () => ({
        state: 'declared-only',
        appId: 'trade-tile',
      })),
    });

    const report = await orchestrator.preflight('trade.insight', { desk: 'FX' });
    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(report.ready).toBe(false);
    expect(report.checks[0]?.failure?.code).toBe('HANDLER_NOT_REGISTERED');
    expect(transcript.failures[0]?.code).toBe('HANDLER_NOT_REGISTERED');
    expect(client.raiseIntent).not.toHaveBeenCalled();
  });

  it('handles unavailable, disabled, and failing capability inspectors', async () => {
    const unavailable = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({}),
      inspectCapability: vi.fn(async () => ({ state: 'unavailable' })),
    });
    const disabledInspector = vi.fn(async () => ({ state: 'unavailable' as const }));
    const disabled = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-1' }),
      inspectCapability: disabledInspector,
      preflightMode: 'disabled',
    });
    const bestEffortDiagnostic = vi.fn();
    const bestEffort = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-1' }),
      inspectCapability: vi.fn(async () => {
        throw new Error('registry offline');
      }),
      onDiagnostic: bestEffortDiagnostic,
    });
    const required = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({}),
      inspectCapability: vi.fn(async () => {
        throw new Error('registry offline');
      }),
      preflightMode: 'required',
    });

    expect((await unavailable.preflight('trade.insight', { desk: 'FX' })).checks[0]?.failure?.code)
      .toBe('CAPABILITY_UNAVAILABLE');
    expect((await disabled.execute('trade.insight', { desk: 'FX' })).status).toBe('success');
    expect(disabledInspector).not.toHaveBeenCalled();
    expect((await bestEffort.execute('trade.insight', { desk: 'FX' })).status).toBe('success');
    expect(bestEffortDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'CAPABILITY_INSPECTOR_FAILED' }),
    );
    expect((await required.execute('trade.insight', { desk: 'FX' })).failures[0]?.code).toBe(
      'CAPABILITY_INSPECTION_FAILED',
    );
  });

  it('classifies an empty portable FDC3 result as an unhandled intent', async () => {
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning(undefined),
    });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.status).toBe('failed');
    expect(transcript.failures[0]).toEqual(
      expect.objectContaining({
        code: 'HANDLER_NO_RESULT',
        recoverable: true,
        stepId: 'discover',
      }),
    );
  });

  it('classifies raise and handler failures separately', async () => {
    const raiseFailure = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: {
        raiseIntent: vi.fn(async () => {
          throw new Error('resolver exploded');
        }),
      },
    });
    const handlerFailure = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: {
        raiseIntent: vi.fn(async () => ({
          getResult: async () => {
            throw new Error('secret stack');
          },
        })),
      },
    });

    expect((await raiseFailure.execute('trade.insight', { desk: 'FX' })).failures[0]?.code).toBe(
      'INTENT_RAISE_FAILED',
    );
    const handlerTranscript = await handlerFailure.execute('trade.insight', { desk: 'FX' });
    expect(handlerTranscript.failures[0]?.code).toBe('INTENT_EXECUTION_FAILED');
    expect(JSON.stringify(handlerTranscript)).not.toContain('secret stack');
  });

  it('times out a handler that never resolves', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [{ ...baseWorkflow.steps[0], timeoutMs: 5 }],
    };
    const orchestrator = new WorkflowOrchestrator({
      workflows: [workflow],
      client: {
        raiseIntent: vi.fn(async () => ({
          getResult: () => new Promise(() => undefined),
        })),
      },
    });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.failures[0]?.code).toBe('RESULT_TIMEOUT');
  });

  it('retries only explicitly configured failures', async () => {
    const events: WorkflowEvent[] = [];
    const raiseIntent = vi
      .fn<Fdc3IntentClient['raiseIntent']>()
      .mockRejectedValueOnce(new Error('temporarily unavailable'))
      .mockResolvedValueOnce({ getResult: async () => ({ tradeId: 'TR-2' }) });
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        {
          ...baseWorkflow.steps[0],
          retry: {
            maxAttempts: 2,
            delayMs: 0,
            retryOn: ['INTENT_RAISE_FAILED'],
          },
        },
      ],
    };
    const orchestrator = new WorkflowOrchestrator({ workflows: [workflow], client: { raiseIntent } });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' }, {
      onEvent: (event) => events.push(event),
    });

    expect(transcript.status).toBe('success');
    expect(raiseIntent).toHaveBeenCalledTimes(2);
    expect(events.some((event) => event.type === 'node.retrying')).toBe(true);
  });

  it('supports delayed retry and cancellation during retry backoff', async () => {
    const retryWorkflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        {
          ...baseWorkflow.steps[0],
          retry: {
            maxAttempts: 2,
            delayMs: 2,
            retryOn: ['INTENT_RAISE_FAILED'],
          },
        },
      ],
    };
    const delayedClient = {
      raiseIntent: vi
        .fn<Fdc3IntentClient['raiseIntent']>()
        .mockRejectedValueOnce(new Error('temporary'))
        .mockResolvedValueOnce({ getResult: async () => ({ tradeId: 'TR-4' }) }),
    };
    const delayed = new WorkflowOrchestrator({
      workflows: [retryWorkflow],
      client: delayedClient,
    });
    const controller = new AbortController();
    const cancelled = new WorkflowOrchestrator({
      workflows: [retryWorkflow],
      client: {
        raiseIntent: vi.fn(async () => {
          throw new Error('temporary');
        }),
      },
    });

    expect((await delayed.execute('trade.insight', { desk: 'FX' })).status).toBe('success');
    const cancelledTranscript = await cancelled.execute(
      'trade.insight',
      { desk: 'FX' },
      {
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === 'node.retrying') {
            controller.abort();
          }
        },
      },
    );
    expect(cancelledTranscript.status).toBe('cancelled');
  });

  it('returns a cancelled transcript without starting a node', async () => {
    const controller = new AbortController();
    controller.abort();
    const client = clientReturning({ tradeId: 'TR-1' });
    const orchestrator = new WorkflowOrchestrator({ workflows: [baseWorkflow], client });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' }, {
      signal: controller.signal,
    });

    expect(transcript.status).toBe('cancelled');
    expect(transcript.failures[0]?.code).toBe('CANCELLED');
    expect(client.raiseIntent).not.toHaveBeenCalled();
  });

  it('cancels a pending handler and enforces a run-level deadline', async () => {
    const pendingClient: Fdc3IntentClient = {
      raiseIntent: vi.fn(async () => ({
        getResult: () => new Promise(() => undefined),
      })),
    };
    const controller = new AbortController();
    const cancelled = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: pendingClient,
    });
    setTimeout(() => controller.abort(), 1);

    const cancelledTranscript = await cancelled.execute(
      'trade.insight',
      { desk: 'FX' },
      { signal: controller.signal },
    );
    const timedOut = await new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: pendingClient,
    }).execute('trade.insight', { desk: 'FX' }, { timeoutMs: 5 });

    expect(cancelledTranscript.status).toBe('cancelled');
    expect(timedOut.failures[0]?.code).toBe('RESULT_TIMEOUT');
  });

  it('enforces the run-level deadline while capability preflight is pending', async () => {
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-1' }),
      inspectCapability: () => new Promise(() => undefined),
      preflightMode: 'required',
    });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' }, { timeoutMs: 5 });

    expect(transcript.status).toBe('failed');
    expect(transcript.failures[0]?.code).toBe('RESULT_TIMEOUT');
  });

  it('continues after an explicitly continuable failure and binds prior results', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        { ...baseWorkflow.steps[0], continueOnError: true },
        {
          id: 'risk',
          intent: 'AssessRisk',
          contextTemplate: { type: 'fdc3.risk' },
          inputBindings: [
            {
              fromStepId: 'discover',
              resultPath: 'trade',
              contextPath: 'trade',
              required: false,
            },
          ],
        },
      ],
    };
    const client = clientReturning(undefined, { classification: 'LOW' });
    const orchestrator = new WorkflowOrchestrator({ workflows: [workflow], client });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.status).toBe('success');
    expect(transcript.completedSteps.map((step) => step.status)).toEqual(['error', 'success']);
    expect(client.raiseIntent).toHaveBeenCalledTimes(2);
  });

  it('binds required results into downstream contexts', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        baseWorkflow.steps[0],
        {
          id: 'price',
          intent: 'PriceTrade',
          contextTemplate: { type: 'fdc3.trade' },
          inputBindings: [
            {
              fromStepId: 'discover',
              resultPath: 'trade',
              contextPath: 'trade',
              required: true,
            },
          ],
        },
      ],
    };
    const client = clientReturning({ trade: { tradeId: 'TR-3' } }, { price: 42 });
    const orchestrator = new WorkflowOrchestrator({ workflows: [workflow], client });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.completedSteps[1]?.context).toEqual({
      type: 'fdc3.trade',
      trade: { tradeId: 'TR-3' },
    });
  });

  it('binds an indexed result from a prior step', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        baseWorkflow.steps[0],
        {
          id: 'chart',
          intent: 'ViewChart',
          contextTemplate: { type: 'fdc3.instrument', id: {} },
          inputBindings: [
            {
              fromStepId: 'discover',
              resultPath: 'trades.0.instrument',
              contextPath: 'id.ticker',
              required: true,
            },
          ],
        },
      ],
    };
    const client = clientReturning({ trades: [{ instrument: 'ACME' }] }, { opened: true });
    const orchestrator = new WorkflowOrchestrator({ workflows: [workflow], client });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.status).toBe('success');
    expect(transcript.completedSteps[1]?.context).toEqual({
      type: 'fdc3.instrument',
      id: { ticker: 'ACME' },
    });
  });

  it('creates nested binding objects and fails required bindings after a continued error', async () => {
    const nestedWorkflow: WorkflowDefinition = {
      ...baseWorkflow,
      steps: [
        baseWorkflow.steps[0],
        {
          id: 'price',
          intent: 'PriceTrade',
          contextTemplate: { type: 'fdc3.trade', payload: 'replace-me', envelope: {} },
          inputBindings: [
            {
              fromStepId: 'discover',
              resultPath: '',
              contextPath: 'payload.trade',
              required: true,
            },
            {
              fromStepId: 'discover',
              resultPath: 'tradeId',
              contextPath: 'envelope.tradeId',
              required: true,
            },
          ],
        },
      ],
    };
    const nested = new WorkflowOrchestrator({
      workflows: [nestedWorkflow],
      client: clientReturning({ tradeId: 'TR-5' }, { price: 10 }),
    });
    const missingWorkflow: WorkflowDefinition = {
      ...nestedWorkflow,
      steps: [
        { ...baseWorkflow.steps[0], continueOnError: true },
        nestedWorkflow.steps[1],
      ],
    };
    const missing = new WorkflowOrchestrator({
      workflows: [missingWorkflow],
      client: clientReturning(undefined),
    });

    expect((await nested.execute('trade.insight', { desk: 'FX' })).completedSteps[1]?.context)
      .toEqual({
        type: 'fdc3.trade',
        payload: { trade: { tradeId: 'TR-5' } },
        envelope: { tradeId: 'TR-5' },
      });
    expect((await missing.execute('trade.insight', { desk: 'FX' })).failures.at(-1)?.code).toBe(
      'BINDING_FAILED',
    );
  });

  it('reports invalid input, invalid results, binding failures, and unknown workflows', async () => {
    const workflow: WorkflowDefinition = {
      ...baseWorkflow,
      validateInput: (input) => input.desk === 'FX',
      steps: [
        {
          ...baseWorkflow.steps[0],
          validateResult: (result) =>
            typeof result === 'object' &&
            result !== null &&
            'tradeId' in result,
        },
      ],
    };
    const orchestrator = new WorkflowOrchestrator({
      workflows: [workflow],
      client: clientReturning({ wrong: true }),
    });

    expect((await orchestrator.execute('missing')).failures[0]?.code).toBe('UNKNOWN_WORKFLOW');
    expect((await orchestrator.execute('trade.insight', { desk: 'EQ' })).failures[0]?.code).toBe(
      'INVALID_INPUT',
    );
    expect((await orchestrator.execute('trade.insight', { desk: 'FX' })).failures[0]?.code).toBe(
      'RESULT_INVALID',
    );
  });

  it('accepts optional results and contains throwing validators', async () => {
    const optionalWorkflow: WorkflowDefinition = {
      ...baseWorkflow,
      validateInput: () => {
        throw new Error('invalid');
      },
    };
    const optionalResultWorkflow: WorkflowDefinition = {
      ...baseWorkflow,
      workflowId: 'optional',
      steps: [{ ...baseWorkflow.steps[0], resultRequired: false }],
    };
    const throwingResultWorkflow: WorkflowDefinition = {
      ...baseWorkflow,
      workflowId: 'throwing-validator',
      steps: [
        {
          ...baseWorkflow.steps[0],
          validateResult: () => {
            throw new Error('bad validator');
          },
        },
      ],
    };
    const orchestrator = new WorkflowOrchestrator({
      workflows: [optionalWorkflow, optionalResultWorkflow, throwingResultWorkflow],
      client: clientReturning(undefined, { tradeId: 'TR-6' }),
    });

    expect((await orchestrator.execute('trade.insight', { desk: 'FX' })).failures[0]?.code).toBe(
      'INVALID_INPUT',
    );
    expect((await orchestrator.execute('optional', { desk: 'FX' })).status).toBe('success');
    expect(
      (await orchestrator.execute('throwing-validator', { desk: 'FX' })).failures[0]?.code,
    ).toBe('RESULT_INVALID');
  });

  it('isolates throwing observers and reports diagnostics', async () => {
    const diagnostic = vi.fn();
    const healthyObserver = vi.fn();
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-1' }),
      onDiagnostic: diagnostic,
    });
    orchestrator.subscribe(() => {
      throw new Error('observer failed');
    });
    orchestrator.subscribe(healthyObserver);

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.status).toBe('success');
    expect(healthyObserver).toHaveBeenCalled();
    expect(diagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'EVENT_OBSERVER_FAILED' }),
    );
  });

  it('supports unsubscribe, deterministic run ids, and throwing diagnostic hooks', async () => {
    const observer = vi.fn();
    const orchestrator = new WorkflowOrchestrator({
      workflows: [baseWorkflow],
      client: clientReturning({ tradeId: 'TR-7' }),
      createRunId: () => 'run-fixed',
      now: () => new Date('2026-07-25T00:00:00.000Z'),
      onDiagnostic: () => {
        throw new Error('diagnostic sink failed');
      },
    });
    const subscription = orchestrator.subscribe(observer);
    subscription.unsubscribe();
    orchestrator.subscribe(() => {
      throw new Error('observer failed');
    });

    const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' });

    expect(transcript.runId).toBe('run-fixed');
    expect(transcript.startedAt).toBe('2026-07-25T00:00:00.000Z');
    expect(observer).not.toHaveBeenCalled();
    expect(transcript.status).toBe('success');
  });
});
