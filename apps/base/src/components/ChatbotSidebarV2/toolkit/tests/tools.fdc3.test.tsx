import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import {
  createRuntimeToolkit,
  getProtocolToolDescriptors,
  runtimeToolkit,
} from '../index';

const mockProviderProps: Array<Record<string, unknown>> = [];
const mockFdc3Executor = {
  execute: jest.fn(),
};
const mockWorkflowExecutor = {
  execute: jest.fn(),
};

jest.mock(
  'chat-protocol-ui',
  () => ({
    AssistantModal: () => <div>Assistant Modal</div>,
    ChatProtocolProvider: ({
      children,
      context,
      toolkit,
      tools,
    }: {
      children: React.ReactNode;
      context?: unknown;
      toolkit: Record<string, unknown>;
      tools?: unknown;
    }) => {
      mockProviderProps.push({ context, toolkit, tools });
      return <>{children}</>;
    },
    ChartContainer: ({ children }: { children: React.ReactNode }) => children,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
  }),
  { virtual: true },
);

jest.mock('recharts', () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => children,
  XAxis: () => null,
}));

jest.mock(
  '../fdc3/shared/hooks',
  () => ({
    useFdc3ActionExecutor: () => mockFdc3Executor,
    useFdc3WorkflowExecutor: () => mockWorkflowExecutor,
  }),
);

describe('runtimeToolkit FDC3 tools', () => {
  beforeEach(() => {
    mockProviderProps.length = 0;
    mockFdc3Executor.execute.mockReset();
    mockWorkflowExecutor.execute.mockReset();
  });

  it('keeps the static toolkit limited to non-executor FDC3 tools', () => {
    const descriptors = getProtocolToolDescriptors();

    expect(descriptors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'propose_fdc3_workflow',
          source: 'human',
          description: expect.stringContaining('ordered steps'),
        }),
      ]),
    );
    expect(descriptors).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'execute_fdc3_action' })]),
    );

    expect(runtimeToolkit.propose_fdc3_action?.type).toBe('human');
    expect('execute_fdc3_action' in runtimeToolkit).toBe(false);
  });

  it('adds the execution tool only for the injected runtime path', () => {
    const toolkit = createRuntimeToolkit({
      fdc3Executor: mockFdc3Executor,
      workflowExecutor: mockWorkflowExecutor,
    });
    const descriptors = getProtocolToolDescriptors(toolkit);

    expect(descriptors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'propose_fdc3_action', source: 'human' }),
      ]),
    );
  });

  it('shows the agent-selected workflow plan before approval and the final transcript after execution', () => {
    const toolkit = createRuntimeToolkit({ workflowExecutor: mockWorkflowExecutor });
    const Approval = toolkit.propose_fdc3_workflow?.render as React.ComponentType<{
      args: Record<string, unknown>;
      interrupt: { type: 'human'; payload: unknown };
      resume: (value: { confirmed: boolean }) => void;
    }>;
    const Transcript = toolkit.execute_fdc3_workflow?.render as React.ComponentType<{
      result: unknown;
    }>;
    const resume = jest.fn();

    const { rerender } = render(
      <Approval
        args={{ workflowId: 'trade.workflow.insight', input: { status: 'PENDING_VALIDATION' } }}
        interrupt={{ type: 'human', payload: {} }}
        resume={resume}
      />,
    );

    expect(screen.getByText('Planned Steps')).toBeInTheDocument();
    expect(screen.getByText(/discover-trade/i)).toBeInTheDocument();
    expect(screen.getByText(/price-trade/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(resume).toHaveBeenCalledWith({ confirmed: true });

    rerender(
      <Transcript
        result={{
          status: 'success',
          summary: 'Completed 3 of 3 workflow steps.',
          completedSteps: [
            { stepId: 'discover-trade', status: 'success' },
            { stepId: 'price-trade', status: 'success' },
            { stepId: 'assess-risk', status: 'success' },
          ],
        }}
      />,
    );

    expect(screen.getByTestId('fdc3-workflow-transcript')).toBeInTheDocument();
    expect(screen.getByText('Completed 3 of 3 workflow steps.')).toBeInTheDocument();
  });
});
