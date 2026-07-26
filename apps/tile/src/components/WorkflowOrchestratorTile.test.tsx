/** @jest-environment jsdom */

import React, { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { TileProps } from '../Root/routing/common/interface';
import { WorkflowOrchestratorTile } from './WorkflowOrchestratorTile';
import {
  createInitialOrchestratorState,
  workflowOrchestratorReducer,
} from './workflowOrchestratorState';
import type { WorkflowEvent } from 'ratan-fdc3-agent';

const mockRaiseWorkflow = jest.fn();
const mockOpen = jest.fn();

jest.mock('../Root/import', () => ({
  FDC3Agent: {
    useFDC3: () => ({
      raiseWorkflow: mockRaiseWorkflow,
      open: mockOpen,
    }),
  },
}));

const baseProps: TileProps = {
  id: 'workflow-orchestrator-1',
  container: 'workspace-1',
  module: 'template',
  tile: '/template_tile_workflow_orchestrator',
  title: 'Workflow orchestrator',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

const eventBase = {
  runId: 'run-1',
  workflowId: 'trade.workflow.insight',
  timestamp: '2026-07-25T09:30:00.000Z',
};

describe('workflowOrchestratorReducer', () => {
  it('tracks node running, completion, selection, and final workflow state', () => {
    let state = createInitialOrchestratorState();
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 1,
        type: 'workflow.started',
      },
    });
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 2,
        type: 'node.started',
        stepId: 'discover-trade',
        intent: 'DiscoverWorkflowTrades',
        context: { type: 'fdc3.trade.query' },
      },
    });
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 3,
        type: 'node.completed',
        stepId: 'discover-trade',
        result: { trade: { tradeId: 'TR-ORCH-1042' } },
      },
    });
    state = workflowOrchestratorReducer(state, {
      type: 'select',
      stepId: 'discover-trade',
    });
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 4,
        type: 'workflow.completed',
        summary: 'Completed 3 of 3 workflow steps.',
      },
    });

    expect(state.status).toBe('completed');
    expect(state.selectedStepId).toBe('discover-trade');
    expect(state.nodes['discover-trade']).toMatchObject({
      status: 'completed',
      result: { trade: { tradeId: 'TR-ORCH-1042' } },
    });
  });

  it('records node and workflow failures', () => {
    let state = createInitialOrchestratorState();
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 1,
        type: 'node.failed',
        stepId: 'price-trade',
        error: 'pricing unavailable',
      },
    });
    state = workflowOrchestratorReducer(state, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 2,
        type: 'workflow.failed',
        error: 'pricing unavailable',
      },
    });

    expect(state.status).toBe('failed');
    expect(state.nodes['price-trade']).toMatchObject({
      status: 'failed',
      error: 'pricing unavailable',
    });
  });

  it('handles execution boundaries and defensive event fallbacks', () => {
    const initial = createInitialOrchestratorState();
    const starting = workflowOrchestratorReducer(initial, { type: 'execution-started' });
    expect(starting.status).toBe('running');
    expect(workflowOrchestratorReducer(starting, { type: 'select', stepId: 'missing' })).toBe(
      starting,
    );

    const unknownNode = workflowOrchestratorReducer(starting, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 1,
        type: 'node.started',
        stepId: 'missing',
      },
    });
    expect(unknownNode.nodes).toBe(starting.nodes);

    const noIntent = workflowOrchestratorReducer(starting, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 2,
        type: 'node.started',
        stepId: 'price-trade',
      },
    });
    expect(noIntent.nodes['price-trade'].latestMessage).toBe('Invoking capability');

    const noError = workflowOrchestratorReducer(noIntent, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 3,
        type: 'node.failed',
        stepId: 'price-trade',
      },
    });
    expect(noError.nodes['price-trade'].latestMessage).toBe('Processor failed');

    const failed = workflowOrchestratorReducer(noError, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 4,
        type: 'workflow.failed',
      },
    });
    expect(failed.error).toBe('Workflow failed');

    const executionError = workflowOrchestratorReducer(initial, {
      type: 'execution-error',
      error: 'connection lost',
    });
    expect(executionError).toMatchObject({ status: 'failed', error: 'connection lost' });

    const unknownEvent = workflowOrchestratorReducer(initial, {
      type: 'event',
      event: {
        ...eventBase,
        sequence: 5,
        type: 'workflow.unknown',
      } as unknown as WorkflowEvent,
    });
    expect(unknownEvent.lastSequence).toBe(5);
  });
});

describe('WorkflowOrchestratorTile', () => {
  beforeEach(() => {
    mockRaiseWorkflow.mockReset();
    mockOpen.mockReset();
  });

  it('renders three pending processors before execution', () => {
    render(<WorkflowOrchestratorTile {...baseProps} />);

    expect(screen.getByRole('heading', { name: 'Workflow orchestrator' })).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Run workflow' }) as HTMLButtonElement).disabled).toBe(
      false,
    );
    expect(screen.getByRole('button', { name: /Select Discover trade/i }).textContent).toContain(
      'Pending',
    );
    expect(screen.getByRole('button', { name: /Select Price trade/i }).textContent).toContain(
      'Pending',
    );
    expect(screen.getByRole('button', { name: /Select Assess risk/i }).textContent).toContain(
      'Pending',
    );
  });

  it('streams mini-processor progress and presents the final result', async () => {
    let listener: ((event: Record<string, unknown>) => void) | undefined;
    let resolveResult: ((value: unknown) => void) | undefined;
    const resultPromise = new Promise((resolve) => {
      resolveResult = resolve;
    });
    mockRaiseWorkflow.mockImplementation(async () => ({
      subscribe: (nextListener: (event: Record<string, unknown>) => void) => {
        listener = nextListener;
        return { unsubscribe: jest.fn() };
      },
      getResult: () => resultPromise,
    }));
    render(<WorkflowOrchestratorTile {...baseProps} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Run workflow' }));
    });
    expect(mockRaiseWorkflow).toHaveBeenCalledWith('trade.workflow.insight', {
      status: 'PENDING_VALIDATION',
    });
    expect((screen.getByRole('button', { name: 'Run workflow' }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    await act(async () => {
      listener?.({
        ...eventBase,
        sequence: 1,
        type: 'workflow.started',
      });
      listener?.({
        ...eventBase,
        sequence: 2,
        type: 'node.started',
        stepId: 'discover-trade',
        intent: 'DiscoverWorkflowTrades',
        context: { type: 'fdc3.trade.query' },
      });
    });
    expect(screen.getByRole('button', { name: /Select Discover trade/i }).textContent).toContain(
      'Processing',
    );

    await act(async () => {
      listener?.({
        ...eventBase,
        sequence: 3,
        type: 'node.completed',
        stepId: 'discover-trade',
        result: { trade: { tradeId: 'TR-ORCH-1042' } },
      });
      listener?.({
        ...eventBase,
        sequence: 4,
        type: 'node.completed',
        stepId: 'price-trade',
        result: { price: { mid: 214.32 } },
      });
      listener?.({
        ...eventBase,
        sequence: 5,
        type: 'node.completed',
        stepId: 'assess-risk',
        result: {
          tradeId: 'TR-ORCH-1042',
          classification: 'MODERATE',
          exposure: 535800,
        },
      });
      listener?.({
        ...eventBase,
        sequence: 6,
        type: 'workflow.completed',
        summary: 'Completed 3 of 3 workflow steps.',
      });
      resolveResult?.({
        status: 'ok',
        completedSteps: [],
      });
      await resultPromise;
    });

    expect(screen.getByText('Workflow completed')).toBeTruthy();
    expect(screen.getByText('TR-ORCH-1042')).toBeTruthy();
    expect(screen.getByText('MODERATE')).toBeTruthy();
    expect(screen.getByText('$535,800')).toBeTruthy();
  });

  it('opens the selected full tile through FDC3', () => {
    render(<WorkflowOrchestratorTile {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Select Price trade/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Open full tile' }));

    expect(mockOpen).toHaveBeenCalledWith(
      { appId: 'template_tile_workflow_pricing' },
      { type: 'ratan.workflow.processor' },
    );
  });

  it('renders workflow execution errors and releases the run control', async () => {
    mockRaiseWorkflow.mockRejectedValue(new Error('orchestrator unavailable'));
    render(<WorkflowOrchestratorTile {...baseProps} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Run workflow' }));
    });

    expect(screen.getByText('Workflow failed')).toBeTruthy();
    expect(screen.getByText('orchestrator unavailable')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Run workflow' }) as HTMLButtonElement).disabled).toBe(
      false,
    );
  });
});
