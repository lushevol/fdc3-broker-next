import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createWorkspaceStatusToolkit } from '../tools/workspaceStatusTool';

describe('workspaceStatusTool', () => {
  const initialSnapshot = {
    activeWorkspaceId: 'ws-1',
    activeWorkspaceLabel: 'Workspace 1',
    activeTileTitle: 'Orders Tile',
    totalWorkspaces: 2,
    totalTiles: 3,
    workspaces: [
      { id: 'ws-1', label: 'Workspace 1', tileCount: 2, isActive: true },
      { id: 'ws-2', label: 'Workspace 2', tileCount: 1, isActive: false },
    ],
  };

  it('creates a frontend workspace status tool with browser execution', async () => {
    const toolkit = createWorkspaceStatusToolkit({
      getWorkspaceSnapshot: () => initialSnapshot,
      closeAllTiles: async () => ({
        activeWorkspaceId: 'ws-1',
        activeWorkspaceLabel: 'Workspace 1',
        activeTileTitle: null,
        totalWorkspaces: 2,
        totalTiles: 0,
        workspaces: [
          { id: 'ws-1', label: 'Workspace 1', tileCount: 0, isActive: true },
          { id: 'ws-2', label: 'Workspace 2', tileCount: 0, isActive: false },
        ],
      }),
    });

    expect(toolkit).toMatchObject({
      report_workspace_status: expect.objectContaining({
        description: expect.any(String),
        execute: expect.any(Function),
        render: expect.any(Function),
      }),
    });

    await expect(toolkit.report_workspace_status.execute(initialSnapshot)).resolves.toMatchObject({
      activeWorkspaceLabel: 'Workspace 1',
      totalTiles: 3,
      activeTileTitle: 'Orders Tile',
    });
  });

  it('renders the status card and closes all tiles from the inline action', async () => {
    const closeAllTiles = jest.fn().mockResolvedValue({
      activeWorkspaceId: 'ws-1',
      activeWorkspaceLabel: 'Workspace 1',
      activeTileTitle: null,
      totalWorkspaces: 2,
      totalTiles: 0,
      workspaces: [
        { id: 'ws-1', label: 'Workspace 1', tileCount: 0, isActive: true },
        { id: 'ws-2', label: 'Workspace 2', tileCount: 0, isActive: false },
      ],
      actionMessage: 'Closed all tiles across 2 workspaces.',
    });
    const toolkit = createWorkspaceStatusToolkit({
      getWorkspaceSnapshot: () => initialSnapshot,
      closeAllTiles,
    });
    const ToolUi = toolkit.report_workspace_status.render;
    const addResult = jest.fn();

    render(
      <ToolUi
        toolName="report_workspace_status"
        toolCallId="tool-status-1"
        status={{ type: 'complete' }}
        args={initialSnapshot}
        result={undefined}
        isError={false}
        addResult={addResult}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Workspace Status')).toBeInTheDocument();
    expect(screen.getByText('Active workspace: Workspace 1')).toBeInTheDocument();
    expect(screen.getByText('Active tile: Orders Tile')).toBeInTheDocument();
    expect(screen.getByText('Total opened tiles: 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close all tiles' }));

    await waitFor(() => {
      expect(closeAllTiles).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(addResult).toHaveBeenCalledWith(
        expect.objectContaining({
          totalTiles: 0,
          actionMessage: 'Closed all tiles across 2 workspaces.',
        }),
      );
    });
  });
});
