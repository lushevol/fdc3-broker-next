import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { createRuntimeToolkit, getProtocolToolDescriptors } from '../index';

jest.mock(
  'chat-protocol-ui',
  () => ({
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

describe('runtimeToolkit Flowzero tools', () => {
  it('registers the Flowzero workflow generator as an MCP backend tool', () => {
    const toolkit = createRuntimeToolkit();
    const descriptors = getProtocolToolDescriptors(toolkit);

    expect(descriptors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'generate_flowzero_workflow',
          source: 'mcp',
          providerId: 'flowzero-mcp',
        }),
      ]),
    );
  });

  it('renders a generated workflow card without opening another workspace tile', () => {
    const toolkit = createRuntimeToolkit();
    const Render = toolkit.generate_flowzero_workflow?.render as React.ComponentType<{
      args: Record<string, unknown>;
      result: unknown;
    }>;

    render(
      <Render
        args={{ workflowName: 'Expense Approval' }}
        result={{
          workflowId: 'wf-123',
          workflowName: 'Expense Approval',
          status: 'DRAFT',
          summary: 'Start -> Manager Approval -> End',
          steps: ['Start', 'Manager Approval', 'End'],
          workflowDetail: { id: 'wf-123' },
          open: {
            label: 'Open in Flowzero',
            route:
              '/flowzero/workflow-management/NewWorkflow/?workflowDetail=%7B%22id%22%3A%22wf-123%22%7D&from=detail',
          },
        }}
      />,
    );

    expect(screen.getByTestId('flowzero-workflow-card')).toBeInTheDocument();
    expect(screen.getByText('Expense Approval')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
    expect(screen.getByText('3 steps')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /open in flowzero/i })).not.toBeInTheDocument();
  });
});
