import { describe, expect, it, vi } from 'vitest';
import { WorkflowExecutor } from '../src/workflow-executor';
import type { WorkflowDefinition } from '../src/workflow-types';

const workflow: WorkflowDefinition = {
  workflowId: 'trade.pendingValidation.openChart',
  title: 'Open chart for pending validation trade',
  inputSchema: { type: 'object', properties: {}, required: [] },
  steps: [
    {
      id: 'search-trades',
      intent: 'SearchTrades',
      contextTemplate: {
        type: 'fdc3.trade.query',
        filters: { status: '{{input.status}}' },
      },
    },
    {
      id: 'view-chart',
      intent: 'ViewChart',
      contextTemplate: {
        type: 'fdc3.instrument',
        id: {},
      },
      inputBindings: [
        {
          fromStepId: 'search-trades',
          resultPath: '$.trades[0].instrument',
          contextPath: '$.id.ticker',
          required: true,
        },
      ],
    },
  ],
};

describe('WorkflowExecutor', () => {
  it('rejects invalid workflow definitions at construction time', () => {
    expect(() => new WorkflowExecutor([{ ...workflow, workflowId: '' }], vi.fn())).toThrow(
      'Workflow id is required',
    );
  });

  it('finds workflows by id and input', () => {
    const executor = new WorkflowExecutor([workflow], vi.fn());

    expect(executor.findWorkflow(workflow.workflowId)).toBe(workflow);
    expect(executor.findWorkflow('missing')).toBeNull();
    expect(executor.findWorkflowsByInput({ status: 'PENDING_VALIDATION' })).toEqual([workflow]);
  });

  it('returns a failed transcript for an unknown workflow id', async () => {
    const executor = new WorkflowExecutor([workflow], vi.fn());

    const transcript = await executor.execute('missing-workflow', { status: 'PENDING_VALIDATION' });

    expect(transcript).toMatchObject({
      status: 'error',
      workflowId: 'missing-workflow',
      title: 'missing-workflow',
      summary: 'Unknown workflow: missing-workflow',
      failedStep: {
        stepId: '__workflow__',
        error: 'Unknown workflow: missing-workflow',
      },
    });
  });

  it('raises workflow step intents in order and binds prior results into later contexts', async () => {
    const raiseIntent = vi
      .fn()
      .mockResolvedValueOnce({
        getResult: async () => ({ trades: [{ instrument: 'AAPL' }] }),
      })
      .mockResolvedValueOnce({
        getResult: async () => ({ opened: true }),
      });

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });

    expect(transcript.status).toBe('ok');
    expect(raiseIntent).toHaveBeenNthCalledWith(1, 'SearchTrades', {
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
    });
    expect(raiseIntent).toHaveBeenNthCalledWith(2, 'ViewChart', {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    });
    expect(transcript.completedSteps.map((step) => step.stepId)).toEqual([
      'search-trades',
      'view-chart',
    ]);
  });

  it('returns a failed transcript when a required binding cannot be resolved', async () => {
    const raiseIntent = vi.fn().mockResolvedValueOnce({
      getResult: async () => ({ trades: [] }),
    });

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });

    expect(transcript.status).toBe('error');
    expect(transcript.failedStep?.stepId).toBe('view-chart');
    expect(raiseIntent).toHaveBeenCalledTimes(1);
  });

  it('passes target app ids and preserves non-object step results', async () => {
    const targetedWorkflow: WorkflowDefinition = {
      ...workflow,
      steps: [
        {
          ...workflow.steps[0],
          targetAppId: 'chart-app',
        },
      ],
    };
    const raiseIntent = vi.fn().mockResolvedValueOnce({
      getResult: async () => 'done',
    });

    const executor = new WorkflowExecutor([targetedWorkflow], raiseIntent);
    const transcript = await executor.execute(targetedWorkflow.workflowId, {
      status: 'PENDING_VALIDATION',
    });

    expect(raiseIntent).toHaveBeenCalledWith(
      'SearchTrades',
      {
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      },
      { appId: 'chart-app' },
    );
    expect(transcript.completedSteps[0]?.result).toBe('done');
  });

  it('returns a failed transcript when an intent step rejects', async () => {
    const raiseIntent = vi.fn().mockRejectedValueOnce(new Error('intent unavailable'));

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute(workflow.workflowId, {
      status: 'PENDING_VALIDATION',
    });

    expect(transcript.status).toBe('error');
    expect(transcript.failedStep).toMatchObject({
      stepId: 'search-trades',
      intent: 'SearchTrades',
      error: 'intent unavailable',
    });
    expect(transcript.summary).toContain('Workflow failed at step search-trades');
  });

  it('uses a generic message for non-Error step failures', async () => {
    const raiseIntent = vi.fn().mockResolvedValueOnce({
      getResult: async () => {
        throw 'bad result';
      },
    });

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute(workflow.workflowId);

    expect(transcript.status).toBe('error');
    expect(transcript.failedStep?.error).toBe('Workflow step failed');
  });

  it('continues after failed optional steps when continueOnError is enabled', async () => {
    const resilientWorkflow: WorkflowDefinition = {
      ...workflow,
      steps: [
        {
          id: 'optional',
          intent: 'OptionalStep',
          contextTemplate: { type: 'fdc3.optional' },
          continueOnError: true,
        },
        {
          id: 'final',
          intent: 'FinalStep',
          contextTemplate: { type: 'fdc3.final' },
        },
      ],
    };
    const raiseIntent = vi
      .fn()
      .mockRejectedValueOnce(new Error('optional failed'))
      .mockResolvedValueOnce({ getResult: async () => ({ finished: true }) });

    const executor = new WorkflowExecutor([resilientWorkflow], raiseIntent);
    const transcript = await executor.execute(resilientWorkflow.workflowId);

    expect(transcript.status).toBe('ok');
    expect(transcript.completedSteps).toMatchObject([
      { stepId: 'optional', status: 'error', error: 'optional failed' },
      { stepId: 'final', status: 'ok', result: { finished: true } },
    ]);
  });
});
