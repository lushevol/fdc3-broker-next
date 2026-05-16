import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { createRuntimeToolkit, getProtocolToolDescriptors, runtimeToolkit } from './tools';
import { ChatbotSidebarV2 } from '../index';

const mockProviderProps: Array<Record<string, unknown>> = [];
const mockFdc3Executor = {
  execute: jest.fn(),
};
const mockWorkflowExecutor = {
  execute: jest.fn(),
};

jest.mock('chat-protocol-ui', () => ({
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
}), { virtual: true });

jest.mock('recharts', () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => children,
  XAxis: () => null,
}));

jest.mock('./use-fdc3-action-executor', () => ({
  useFdc3ActionExecutor: () => mockFdc3Executor,
  useFdc3WorkflowExecutor: () => mockWorkflowExecutor,
}));

describe('runtimeToolkit FDC3 tools', () => {
  beforeEach(() => {
    mockProviderProps.length = 0;
    mockFdc3Executor.execute.mockReset();
    mockWorkflowExecutor.execute.mockReset();
  });

  it('keeps the static toolkit limited to non-executor FDC3 tools', () => {
    const descriptors = getProtocolToolDescriptors();

    expect(descriptors).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'propose_fdc3_action', source: 'human' })]),
    );
    expect(descriptors).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'execute_fdc3_action' })]),
    );

    expect(runtimeToolkit.propose_fdc3_action.type).toBe('human');
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
        expect.objectContaining({ name: 'execute_fdc3_action', source: 'frontend' }),
        expect.objectContaining({ name: 'propose_fdc3_workflow', source: 'human' }),
        expect.objectContaining({ name: 'execute_fdc3_workflow', source: 'frontend' }),
      ]),
    );

    expect(toolkit.propose_fdc3_action.type).toBe('human');
    expect(toolkit.execute_fdc3_action.type).toBe('frontend');
    expect(toolkit.propose_fdc3_workflow.type).toBe('human');
    expect(toolkit.execute_fdc3_workflow.type).toBe('frontend');
  });

  it('executes declared FDC3 workflows by id and input only', async () => {
    mockWorkflowExecutor.execute.mockResolvedValue({
      status: 'ok',
      workflowId: 'trade.pendingValidation.openChart',
    });
    const toolkit = createRuntimeToolkit({ workflowExecutor: mockWorkflowExecutor });

    await toolkit.execute_fdc3_workflow.execute?.({
      workflowId: 'trade.pendingValidation.openChart',
      input: { status: 'PENDING_VALIDATION' },
      steps: [{ id: 'should-not-be-forwarded' }],
    });

    expect(mockWorkflowExecutor.execute).toHaveBeenCalledWith({
      workflowId: 'trade.pendingValidation.openChart',
      input: { status: 'PENDING_VALIDATION' },
    });
  });

  it('renders meaningful FDC3 approval details and resumes on approve or cancel', () => {
    const resume = jest.fn();
    const ProposalTool = runtimeToolkit.propose_fdc3_action.render as React.ComponentType<{
      args: Record<string, unknown>;
      interrupt?: { type: 'human'; payload: unknown };
      resume?: (payload: { confirmed: boolean }) => void;
    }>;

    render(
      <ProposalTool
        args={{
          actionId: 'trade-blotter.pending-validation',
          question: 'how is trades pending validation status ?',
        }}
        interrupt={{ type: 'human', payload: {} }}
        resume={resume}
      />,
    );

    expect(screen.getByText('Check Pending Validation Trades')).toBeInTheDocument();
    expect(screen.getByText(/SearchTrades/)).toBeInTheDocument();
    expect(screen.getByText(/trade-blotter\.pending-validation/)).toBeInTheDocument();
    expect(screen.getByText(/fdc3\.trade\.query/)).toBeInTheDocument();
    expect(screen.getByText(/PENDING_VALIDATION/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(resume).toHaveBeenNthCalledWith(1, { confirmed: true });
    expect(resume).toHaveBeenNthCalledWith(2, { confirmed: false });
  });

  it('passes workspace snapshot through ChatProtocolProvider context', () => {
    const workspaceSnapshot = {
      activeWorkspaceId: 'workspace-1',
      activeWorkspaceLabel: 'Workspace 1',
      activeTileTitle: 'FDC3 Tile 2',
      activeTileId: 'tile-instance-1',
      activeAppId: 'template_tile_fdc3_2',
      totalWorkspaces: 1,
      totalTiles: 1,
      workspaces: [{ id: 'workspace-1', label: 'Workspace 1', tileCount: 1, isActive: true }],
    };

    render(
      <ChatbotSidebarV2
        toolRegistryConfig={{
          getWorkspaceSnapshot: () => workspaceSnapshot,
        }}
      />,
    );

    expect(mockProviderProps).toHaveLength(1);
    expect(mockProviderProps[0]?.context).toEqual({
      workspace: workspaceSnapshot,
    });

    const providerToolkit = mockProviderProps[0]?.toolkit as Record<string, { type: string }>;
    const providerTools = mockProviderProps[0]?.tools as Array<{ name: string; source: string }>;

    expect(providerToolkit.execute_fdc3_action?.type).toBe('frontend');
    expect(providerTools).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'execute_fdc3_action', source: 'frontend' })]),
    );
  });
});
