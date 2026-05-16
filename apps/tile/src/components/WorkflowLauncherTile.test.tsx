/** @jest-environment jsdom */

import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { TileProps } from '../Root/routing/common/interface';
import { WorkflowLauncherTile } from './WorkflowLauncherTile';

type MockRaiseWorkflow = {
  (...args: unknown[]): Promise<{ getResult: () => Promise<unknown> }>;
  mockReset: () => void;
  mockResolvedValue: (value: { getResult: () => Promise<unknown> }) => void;
};

const mockRaiseWorkflow = jest.fn() as unknown as MockRaiseWorkflow;

jest.mock('../Root/import', () => ({
  FDC3Agent: {
    AgentProvider: ({
      children,
    }: {
      appIdentifier: { appId: string; instanceId: string };
      children: React.ReactNode;
    }) => <>{children}</>,
    useFDC3: () => ({
      raiseWorkflow: mockRaiseWorkflow,
    }),
  },
}));

const baseProps: TileProps = {
  id: 'workflow-launcher-1',
  container: 'workspace-1',
  module: 'template',
  tile: '/template_tile_workflow_launcher',
  title: 'FDC3 Workflow Launcher',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('WorkflowLauncherTile', () => {
  beforeEach(() => {
    mockRaiseWorkflow.mockReset();
    mockRaiseWorkflow.mockResolvedValue({
      getResult: async () => ({
        workflowId: 'trade.pendingValidation.openChart',
        status: 'completed',
        steps: [
          { stepId: 'search-trades', status: 'completed' },
          { stepId: 'view-chart', status: 'completed' },
        ],
      }),
    });
  });

  it('raises the sample FDC3 workflow with a stable input payload', async () => {
    render(<WorkflowLauncherTile {...baseProps} />);

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'Run Workflow' }));
    });

    await waitFor(() => {
      expect(mockRaiseWorkflow).toHaveBeenCalledWith('trade.pendingValidation.openChart', {
        status: 'PENDING_VALIDATION',
        originalRequest: 'Open a chart for the first pending validation trade',
      });
    });
    expect(await screen.findByText('Workflow completed')).toBeTruthy();
    expect(screen.getByTestId('fdc3-workflow-launcher-result').textContent).toContain(
      'view-chart',
    );
  });
});
