import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import {
  createRuntimeToolkit,
  getProtocolToolDescriptors,
  runtimeToolkit,
} from '../index';
import { ChatbotSidebarV2 } from '../../index';

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
        expect.objectContaining({ name: 'propose_fdc3_action', source: 'human' }),
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
});
